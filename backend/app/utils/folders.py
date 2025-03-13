import os

def ensure_directory_exists(directory: str) -> None:
    """
    Ensure a directory exists, creating it if necessary
    
    Args:
        directory (str): Directory path
    """
    if not os.path.exists(directory):
        os.makedirs(directory)