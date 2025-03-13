import logging
from fastapi import APIRouter, HTTPException

from app.utils.config import config

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": 200, "health": "OK"}


@router.get("/default-config")
def get_default_config():
    """
    Returns pre-populated data for the frontend
    """
    try:
        # Load configuration for default values
        return {
            "base_prompt": config.PROMPT_CONFIG["base_prompt"],
            "keywords_to_keep": config.PROMPT_CONFIG["keywords_to_keep"],
            "keywords_to_replace": config.PROMPT_CONFIG["keywords_to_replace"],
            "samples": config.PROMPT_CONFIG["examples"]
        }
    except Exception as e:
        logger.error(f"Error getting prepopulated data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error getting prepopulated data: {str(e)}")
