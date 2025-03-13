import logging
import sys

# Custom filter to only show errors, warnings and important INFO logs
class BoilerplateFilter(logging.Filter):
    def filter(self, record):
        # Always allow errors and warnings
        if record.levelno >= logging.WARNING:
            return True
        
        # Filter out noisy httpx logs
        if record.name == 'httpx' and record.levelno == logging.INFO:
            # Only show rate limit and error messages
            msg = record.getMessage()
            return ('429 Too Many Requests' in msg or 
                   'error' in msg.lower() or
                   '400 Bad Request' in msg)
        
        # Filter out noisy OpenAI API call logs
        if record.name == 'app.services.openai_processor' and record.levelno == logging.INFO:
            msg = record.getMessage()
            if ('Calling Azure OpenAI API' in msg or 
                'Successfully received API response' in msg):
                return False
            
        # Filter out noisy asyncio logs
        if record.name.startswith('asyncio') and record.levelno == logging.INFO:
            return False
        
        # Allow other INFO logs
        return True

def init_logger():
    """Initialize logging with configuration for the entire application"""
    # Reset handlers if they've been configured before
    root_logger = logging.getLogger()
    if root_logger.handlers:
        for handler in root_logger.handlers[:]:
            root_logger.removeHandler(handler)
    
    # Configure standard stream handler
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    ))
    
    # Add the handler to root logger
    root_logger.addHandler(stream_handler)
    root_logger.setLevel(logging.INFO)
    
    # Apply our custom filter to root logger
    boilerplate_filter = BoilerplateFilter()
    root_logger.addFilter(boilerplate_filter)
    
    # Explicitly configure individual loggers
    for logger_name in ['httpx', 'openai', 'app.services.openai_processor', 'asyncio']:
        module_logger = logging.getLogger(logger_name)
        module_logger.addFilter(boilerplate_filter)
