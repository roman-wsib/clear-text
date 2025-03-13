import asyncio
import logging

from app.utils.config import config
from app.extensions.openai import async_openai_client

# Disable httpx logs
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

async def process_with_openai(system_prompt, user_prompt, semaphore=None):
    """
    Process a single text with OpenAI
    
    Args:
        system_prompt (str): The system prompt for the AI
        user_prompt (str): The user prompt for the AI
        semaphore (asyncio.Semaphore, optional): Not used, kept for compatibility
        
    Returns:
        str: The processed text
    """
    if not user_prompt or not user_prompt.strip():
        logger.warning("Empty or whitespace-only text received")
        return ""

    try:
        # Log API calls at debug level to reduce noise
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug("Calling Azure OpenAI API for text processing")
        
        # Make the API call directly
        response = await async_openai_client.chat.completions.create(
            model=config.AZURE_OPENAI_DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=4096,
        )
        
        # Log successful response only at debug level
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug("Successfully received API response")
        
        return response.choices[0].message.content
            
    except Exception as e:
        # Log errors at error level
        logger.error(f"Error during API call: {str(e)}")
        raise

