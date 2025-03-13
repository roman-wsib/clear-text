import logging
import os
import docx
from datetime import datetime

from app.utils.config import config
from app.utils.folders import ensure_directory_exists
from app.services.document_processor import DocumentProcessor
from app.services.extraction import extract_document_structure
from app.services.formatting import rebuild_document
from app.services.text_utils import score_text
from app.services.openai_processor import process_with_openai
from app.services.prompt_generation import create_system_prompt

logger = logging.getLogger(__name__)


async def simplify_document(docx_path, system_prompt=None, prompt_config=None):
    """
    Simplify a document using the pipeline with improved structure preservation
    
    Args:
        docx_path (str): Path to the Word document to simplify
        system_prompt (str, optional): System prompt for the AI model. If None, created from config.
        prompt_config (dict, optional): Custom configuration. If None, loaded from config file.
        
    Returns:
        tuple: (output_path, readability_score)
    """
    
    if not prompt_config:
        prompt_config = config.PROMPT_CONFIG
    
    # Set to collect highlighted words during processing
    highlighted_words = set()
    
    # Create the system prompt if not provided
    if system_prompt is None:
        logger.info("🔄 Creating system prompt from config...")
        # Load base prompt and default parameters from config
        base_prompt = prompt_config["base_prompt"]
        keywords_to_keep = prompt_config["keywords_to_keep"]
        keywords_to_replace = prompt_config["keywords_to_replace"]
        samples = prompt_config["examples"]
        
        # Create the system prompt
        system_prompt = create_system_prompt(
            base_prompt,
            keywords_to_keep,
            keywords_to_replace,
            samples,
            highlighted_words
        )
    else:
        logger.info("ℹ️ Using provided system prompt")
    
    logger.info(f"🔄 Processing document: {docx_path}")
    
    # Generate output filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.basename(docx_path)
    filename_without_ext = os.path.splitext(filename)[0]
    output_docx = f"test_runs/{filename_without_ext}_{timestamp}.docx"
    
    # Load the document
    doc = docx.Document(docx_path)
    
    # Create a document processor
    processor = DocumentProcessor(system_prompt, 
                                 keywords_to_keep=prompt_config.get("keywords_to_keep", []), 
                                 highlighted_words=highlighted_words)
    
    # Extract document structure
    elements = extract_document_structure(doc, highlighted_words, 
                                          keywords_to_keep=prompt_config.get("keywords_to_keep", []))
    
    # Process document elements
    processed_elements = await processor.process_document_elements(elements)
    
    # Rebuild the document
    simplified_text = rebuild_document(doc, elements, processed_elements)
    
    # Save processed file
    ensure_directory_exists("test_runs")
    logger.info(f"💾 Saving processed file to: {output_docx}")
    doc.save(output_docx)
    
    # Calculate readability score
    readability_score = score_text(simplified_text)
    logger.info(f"✅ Processing completed. Readability score: {readability_score:.2f}")
    logger.info(f"📄 Simplified document saved to: {output_docx}")
    
    return output_docx, readability_score

async def simplify_text(text, system_prompt):
    """
    Simplify a text string using the AI model
    
    Args:
        text (str): Text to simplify
        system_prompt (str): System prompt for the AI model
        
    Returns:
        tuple: (simplified_text, readability_score)
    """
    logger.info(f"🔄 Simplifying text ({len(text)} characters)")
    
    # Create a document processor
    processor = DocumentProcessor(system_prompt)
    
    # Process with OpenAI directly
    prompt = f"Please simplify the following text:\n\n{text}"
    simplified_text = await process_with_openai(system_prompt, prompt, None)
    
    # Calculate readability score
    readability_score = score_text(simplified_text)
    logger.info(f"✅ Simplification completed. Readability score: {readability_score:.2f}")
    
    return simplified_text, readability_score 
