import asyncio
import logging
import time
from contextlib import asynccontextmanager

from app.utils.config import config

logger = logging.getLogger(__name__)

class RateLimitError(Exception):
    """Custom error for rate limit handling"""
    def __init__(self, wait_time: int, message: str = "Rate limit exceeded"):
        self.wait_time = wait_time
        self.message = message
        super().__init__(self.message)

# Track last request time to enforce rate limits
_last_request_time = 0
_request_lock = asyncio.Lock()

@asynccontextmanager
async def handle_rate_limit():
    """
    Async context manager for rate limiting
    
    Usage:
        async with handle_rate_limit():
            # Make API call here
    """
    global _last_request_time
    
    async with _request_lock:
        # Ensure minimum delay between requests
        current_time = time.time()
        time_since_last_request = current_time - _last_request_time
        
        if time_since_last_request < config.REQUEST_DELAY and _last_request_time > 0:
            delay = config.REQUEST_DELAY - time_since_last_request
            if logger.isEnabledFor(logging.DEBUG):
                logger.debug(f"Rate limiting: waiting {delay:.2f}s between requests")
            await asyncio.sleep(delay)
        
        # Update last request time
        _last_request_time = time.time()
    
    try:
        # Yield control back to the caller
        yield
    
    except Exception as e:
        # Check if this is a rate limit error (based on OpenAI error messages)
        if "429" in str(e) or "too many requests" in str(e).lower() or "rate limit" in str(e).lower():
            raise RateLimitError(
                wait_time=config.RATE_LIMIT_BACKOFF["initial_wait"],
                message=f"Rate limit exceeded: {str(e)}"
            )
        # Re-raise other exceptions
        raise

# Helper to calculate backoff time for retries
def calculate_backoff(current_retry: int, last_wait: int) -> int:
    """Calculate next wait time using exponential backoff"""
    return min(
        last_wait * config.RATE_LIMIT_BACKOFF["multiplier"],
        config.RATE_LIMIT_BACKOFF["max_wait"]
    )