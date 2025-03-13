import re
import nltk
from nltk.tokenize import sent_tokenize

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')


def score_text(text: str) -> float:
    """
    Calculate a readability score for the given text (Flesch-Kincaid Grade Level)
    
    Args:
        text (str): Text to score
        
    Returns:
        float: Readability score (higher scores indicate higher complexity)
    """
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text).strip()
    
    if not text:
        return 0.0
        
    # Count characters, words, and sentences
    num_chars = len(text)
    num_words = len(text.split())
    num_sentences = max(1, len(sent_tokenize(text)))  # Avoid division by zero
    
    # Calculate Flesch-Kincaid Grade Level
    score = (4.71 * (num_chars / num_words)) + (0.5 * (num_words / num_sentences)) - 21.43
    
    # Clamp score to non-negative values
    return max(0, score) 
