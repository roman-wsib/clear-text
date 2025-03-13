import logging
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import Dict, Any
import json
from datetime import datetime
import docx
import os

from app.services.prompt_generation import create_system_prompt
from app.services.simplification import simplify_document
from app.utils.folders import ensure_directory_exists
from app.utils.config import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/docs", tags=["Docs"])
 

@router.post("/dummy")
async def dummy_upload(formData: Dict[str, Any]):
    """Dummy upload endpoint for testing"""
    return {"message": "File received", "data": formData}


@router.post("/simplification")
async def simplify_file(
    file: UploadFile = File(...),
    base_prompt: str = Form(None),
    keywords_to_keep: str = Form(None),
    keywords_to_replace: str = Form(None),
    samples: str = Form(None)
):
    """
    Simplifies a docx file and returns the simplified version
    """
    # Parse JSON strings from form data    
    try:
        base_prompt = base_prompt or config.PROMPT_CONFIG["base_prompt"]
        keywords_to_keep_list = json.loads(keywords_to_keep) if keywords_to_keep else config.PROMPT_CONFIG["keywords_to_keep"]
        keywords_to_replace_list = json.loads(keywords_to_replace) if keywords_to_replace else config.PROMPT_CONFIG["keywords_to_replace"]
        samples_list = json.loads(samples) if samples else config.PROMPT_CONFIG["examples"]
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    
    # Validate file type
    if not file.filename.lower().endswith('.docx'):
        raise HTTPException(status_code=400, detail="Only .docx files are supported")

    # Create temporary file
    temp_dir = "temp_uploads"
    ensure_directory_exists(temp_dir)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_file_path = f"{temp_dir}/{file.filename}_{timestamp}"
    
    # Save uploaded file
    try:
        with open(temp_file_path, "wb") as f:
            content = await file.read()
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

    # Process the document
    try:
        # Create a set to store highlighted words
        highlighted_words = set()
        
        # Create system prompt
        system_prompt = create_system_prompt(
            base_prompt,
            keywords_to_keep_list,
            keywords_to_replace_list,
            samples_list,
            highlighted_words
        )
        
        # Replace existing configuration with form data for this request
        custom_prompt_config = {
            "base_prompt": base_prompt,
            "keywords_to_keep": keywords_to_keep_list,
            "keywords_to_replace": keywords_to_replace_list,
            "examples": samples_list
        }
        
        # Process the document
        output_file_path, readability_score = await simplify_document(
            temp_file_path, 
            system_prompt=system_prompt,
            prompt_config=custom_prompt_config
        )
        
        # Extract simplified text for readability calculation
        doc = docx.Document(output_file_path)
        full_text = " ".join([para.text for para in doc.paragraphs])
        
        return {
            "message": "File processed successfully",
            "filename": os.path.basename(output_file_path),
            "readabilityScore": round(readability_score, 2),
            "simplifiedText": full_text
        }
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")
    finally:
        # Clean up temporary file
        try:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        except Exception as e:
            logger.error(f"Error removing temporary file: {str(e)}")


@router.get("/simplification")
async def get_file(filename: str):
    """
    Returns a processed file
    """
    try:
        file_path = f"test_runs/{filename}"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File not found: {filename}")
            
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error retrieving file: {str(e)}")

