#!/usr/bin/env python3
import asyncio
import sys
import os
import logging
import time
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import the document simplification function
from app.services.simplification import simplify_document
from app.services.prompt_generation import create_system_prompt
from app.utils.config import config


async def main():
    """
    Run the document simplification pipeline on a given docx file
    Usage: python test.py filename.docx
    """
    # Check command-line arguments
    if len(sys.argv) < 2:
        print("Usage: python test.py filename.docx")
        sys.exit(1)
    
    input_filename = sys.argv[1]
    
    # Validate input file
    if not os.path.exists(input_filename):
        print(f"Error: File '{input_filename}' not found.")
        sys.exit(1)
    
    if not input_filename.lower().endswith('.docx'):
        print(f"Error: File '{input_filename}' must be a .docx file.")
        sys.exit(1)
    
    try:
        # Get absolute path to the file
        input_path = os.path.abspath(input_filename)
        print(f"Processing document: {input_path}")
        
        # Generate system prompt from config
        system_prompt = create_system_prompt(
            base_prompt=config.PROMPT_CONFIG["base_prompt"],
            keywords_to_keep=config.PROMPT_CONFIG["keywords_to_keep"],
            keywords_to_replace=config.PROMPT_CONFIG["keywords_to_replace"],
            samples=config.PROMPT_CONFIG["examples"]
        )
        
        # Start timer
        start_time = time.time()
        
        # Process the document
        print("Starting document simplification...")
        output_path, readability_score = await simplify_document(
            docx_path=input_path,
            system_prompt=system_prompt
        )
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Print results
        print("\nDocument simplification completed:")
        print(f"- Input file: {input_path}")
        print(f"- Output file: {output_path}")
        print(f"- Readability score: {readability_score}")
        print(f"- Processing time: {processing_time:.2f} seconds")
        
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}", exc_info=True)
        print(f"Error processing document: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main()) 