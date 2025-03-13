from openai import AzureOpenAI, AsyncAzureOpenAI

from ..utils.config import config


openai_client = AzureOpenAI(
    api_key=config.AZURE_OPENAI_API_KEY,
    api_version=config.AZURE_OPENAI_API_VERSION,
    azure_endpoint=config.AZURE_OPENAI_ENDPOINT,
    max_retries=2,  # Limit retries at the client level
)

async_openai_client = AsyncAzureOpenAI(
    api_key=config.AZURE_OPENAI_API_KEY,
    api_version=config.AZURE_OPENAI_API_VERSION,
    azure_endpoint=config.AZURE_OPENAI_ENDPOINT,
    max_retries=2,
)
