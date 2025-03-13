import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

from app.services.prompt_generation import create_system_prompt
from app.services.simplification import simplify_text
from app.utils.config import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/text", tags=["Text"])


class SimplifyTextRequest(BaseModel):
    text: str
    base_prompt: str = config.PROMPT_CONFIG["base_prompt"]
    keywords_to_keep: List[str] = config.PROMPT_CONFIG["keywords_to_keep"]
    keywords_to_replace: List[Dict[str, str]] = config.PROMPT_CONFIG["keywords_to_replace"]
    samples: List[Dict[str, str]] = config.PROMPT_CONFIG["examples"]
    

@router.post("/simplification")
async def simplify_text_endpoint(request: SimplifyTextRequest):
    """
    Simplifies a text string and returns the simplified version
    """
    try:
        # Create a set to store highlighted words (not used for text simplification but included for consistency)
        highlighted_words = set()
        
        # Create system prompt
        system_prompt = create_system_prompt(
            request.base_prompt,
            request.keywords_to_keep,
            request.keywords_to_replace,
            request.samples,
            highlighted_words
        )
    
        # Process the text
        simplified_text, readability_score = await simplify_text(request.text, system_prompt)
        
        return {
            "message": "Text processed successfully",
            "simplifiedText": simplified_text,
            "readabilityScore": round(readability_score, 2)
        }
    except Exception as e:
        logger.error(f"Error processing text: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")
