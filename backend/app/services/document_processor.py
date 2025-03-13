import asyncio
import logging
from typing import List, Dict, Any, Tuple, Set
import math

from app.utils.config import config
from app.services.openai_processor import process_with_openai
from app.services.prompt_generation import create_element_prompt

logger = logging.getLogger(__name__)

# Constants for batch processing
ELEMENT_START = "[ELEMENT_START]"
ELEMENT_END = "[ELEMENT_END]"


class DocumentProcessor:
    """Class for processing and simplifying Word documents with structure preservation"""
    
    def __init__(self, system_prompt, keywords_to_keep=None, highlighted_words=None):
        """
        Initialize the document processor
        
        Args:
            system_prompt (str): The system prompt to use for the AI
            keywords_to_keep (list): Words that should be preserved in the output
            highlighted_words (set): Set to collect highlighted words
        """
        self.system_prompt = system_prompt
        self.keywords_to_keep = set(keywords_to_keep or [])
        self.highlighted_words = set(highlighted_words or [])
        
        # Semaphore for limiting concurrent batch processing
        self.batch_semaphore = asyncio.Semaphore(config.MAX_CONCURRENT_REQUESTS)
    
    async def process_element(self, element):
        """
        Process a single document element
        
        Args:
            element (dict): The document element to process
            
        Returns:
            str: The processed text for the element
        """
        # Skip processing for certain element types
        if element["type"].startswith("heading_") or element["type"] in ["toc_entry", "caption"]:
            return element["text"]
            
        # Skip empty elements
        if not element["text"].strip():
            return element["text"]
            
        element_text = element["text"]
        
        # Create a context-aware prompt based on element type
        user_prompt = create_element_prompt(element, element_text)
        
        # Process with OpenAI
        processed_text = await process_with_openai(
            self.system_prompt, 
            user_prompt, 
            None  # No semaphore
        )
        
        return processed_text if processed_text else element["text"]
        
    async def process_element_batch(self, elements: List[Dict[str, Any]], 
                                   start_idx: int, batch_size: int, 
                                   batch_num: int, total_batches: int,
                                   element_type: str) -> List[Tuple[int, str]]:
        """
        Process a batch of document elements in a single API call
        
        Args:
            elements: List of document elements to process
            start_idx: Starting index in the elements list
            batch_size: Maximum number of elements to process in this batch
            batch_num: Current batch number (1-based)
            total_batches: Total number of batches
            element_type: Type of element being processed
            
        Returns:
            List of tuples containing (element_index, processed_text)
        """
        # Use the semaphore to limit concurrent batch processing
        async with self.batch_semaphore:
            batch_elements = []
            batch_indices = []
            batch_prompts = []
            
            # Prepare batch of elements
            for i in range(start_idx, min(start_idx + batch_size, len(elements))):
                element = elements[i]
                
                # Skip processing for certain element types
                if element["type"].startswith("heading_") or element["type"] in ["toc_entry", "caption"]:
                    continue
                    
                # Skip empty elements
                if not element["text"].strip():
                    continue
                    
                # Create a context-aware prompt
                element_prompt = create_element_prompt(element, element["text"])
                
                batch_indices.append(i)
                batch_elements.append(element)
                batch_prompts.append(f"{ELEMENT_START}{element_prompt}{ELEMENT_END}")
            
            # If no elements to process, return empty list
            if not batch_prompts:
                logger.info(f"[Batch {batch_num}/{total_batches}] {element_type}: No elements to process")
                return []
                
            # Combine all prompts into one
            combined_prompt = "\n\n".join(batch_prompts)
            
            try:
                logger.info(f"▶️ [Batch {batch_num}/{total_batches}] Starting {element_type} batch with {len(batch_prompts)} elements")
                
                # Process the batch with OpenAI
                response = await process_with_openai(
                    system_prompt=f"{self.system_prompt}\nImportant: Maintain the element markers {ELEMENT_START} and {ELEMENT_END} in your response.",
                    user_prompt=f"Simplify each text segment between the markers:\n\n{combined_prompt}",
                    semaphore=None
                )
                    
                # Extract individual responses from the combined response
                results = []
                current_text = response
                
                for i, idx in enumerate(batch_indices):
                    if ELEMENT_START in current_text and ELEMENT_END in current_text:
                        start = current_text.find(ELEMENT_START) + len(ELEMENT_START)
                        end = current_text.find(ELEMENT_END)
                        
                        if start >= 0 and end >= 0:
                            processed_text = current_text[start:end].strip()
                            results.append((idx, processed_text))
                            current_text = current_text[end + len(ELEMENT_END):]
                        else:
                            # Fallback to original text if markers are not found
                            results.append((idx, elements[idx]["text"]))
                    else:
                        # Fallback to original text if markers are not found
                        results.append((idx, elements[idx]["text"]))
                
                logger.info(f"✅ [Batch {batch_num}/{total_batches}] Completed {element_type} batch: {len(results)} elements processed")
                return results
                
            except Exception as e:
                logger.error(f"❌ [Batch {batch_num}/{total_batches}] Error processing {element_type} batch: {str(e)}")
                # Return original text for failed elements
                return [(idx, elements[idx]["text"]) for idx in batch_indices]
    
    async def process_document_elements(self, elements):
        """
        Process all document elements
        
        Args:
            elements (list): The document elements to process
            
        Returns:
            dict: A mapping of element IDs to processed text
        """
        processed_elements = {}
        
        # Group elements to process by type for batching similar elements
        elements_by_type = {}
        for element in elements:
            element_type = element["type"]
            if element_type not in elements_by_type:
                elements_by_type[element_type] = []
            elements_by_type[element_type].append(element)
        
        logger.info(f"Processing {len(elements)} elements in groups by type...")
        
        # Process each type of element
        for element_type, type_elements in elements_by_type.items():
            total_elements = len(type_elements)
            logger.info(f"📄 Processing {total_elements} elements of type: {element_type}")
            
            # Skip batch processing for headings and TOC entries (process as before)
            if element_type.startswith("heading_") or element_type in ["toc_entry", "caption"]:
                processed_texts = [element["text"] for element in type_elements]
                for element, processed_text in zip(type_elements, processed_texts):
                    processed_elements[element["id"]] = processed_text
                logger.info(f"✅ Processed all {total_elements} elements of type: {element_type} (no batching needed)")
                continue
            
            # For other element types, use batch processing
            results = [None] * total_elements
            
            # Calculate total number of batches
            total_batches = math.ceil(total_elements / config.BATCH_SIZE)
            logger.info(f"🔄 Processing {element_type} in {total_batches} batches (size: {config.BATCH_SIZE}, concurrent: {config.MAX_CONCURRENT_REQUESTS})")
            
            # Create tasks for parallel batch processing
            batch_tasks = []
            for batch_idx in range(total_batches):
                batch_num = batch_idx + 1  # 1-based batch numbering for readability
                start_idx = batch_idx * config.BATCH_SIZE
                
                # Create a task for each batch
                task = asyncio.create_task(self.process_element_batch(
                    type_elements, start_idx, config.BATCH_SIZE,
                    batch_num, total_batches, element_type
                ))
                batch_tasks.append((batch_num, task))
            
            # Wait for all batches to complete
            for batch_num, task in batch_tasks:
                batch_results = await task
                
                # Store results
                for idx, processed_text in batch_results:
                    results[idx] = processed_text
            
            # Fill in any missing results with original text
            for i, element in enumerate(type_elements):
                if results[i] is None:
                    results[i] = element["text"]
                processed_elements[element["id"]] = results[i]
            
            logger.info(f"✅ Completed all {total_batches} batches of {element_type}")
        
        return processed_elements 
