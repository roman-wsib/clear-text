import os
from dotenv import load_dotenv
from pathlib import Path
import json

load_dotenv()

class Config:
    AZURE_OPENAI_API_KEY = os.environ.get("AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_ENDPOINT = os.environ.get("AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_API_VERSION = os.environ.get("AZURE_OPENAI_API_VERSION")
    AZURE_OPENAI_DEPLOYMENT_NAME = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME")

    # Number of batches to process in parallel
    MAX_CONCURRENT_REQUESTS = 10
    
    # Batch size for document processing
    BATCH_SIZE = 10
    
    # Output directory for processed documents
    OUTPUT_DIR = "test_runs"
    
    # Rate limit backoff settings (kept for compatibility)
    RATE_LIMIT_BACKOFF = {
        "initial_wait": 10,
        "max_wait": 120,
        "multiplier": 2,
        "max_retries": 3
    }
    
    def __init__(self):
        self.PROMPT_CONFIG = self._load_prompt_config()
    
    def _load_prompt_config(self) -> dict:
        current_dir = Path(__file__).resolve().parent.parent.parent
        config_path = os.path.join(current_dir, "prompt-config.json")
        
        with open(config_path, "r") as f:
            prompt_config = json.load(f)
        
        return prompt_config

config = Config()
