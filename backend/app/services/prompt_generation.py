def create_system_prompt(
    base_prompt,
    keywords_to_keep,
    keywords_to_replace,
    samples,
    highlighted_words=None
):
    """
    Creates a system prompt for the AI model
    
    Args:
        base_prompt (str): Base instruction prompt
        keywords_to_keep (list): List of keywords to preserve
        keywords_to_replace (list): List of replacement dictionaries
        samples (list): List of example dictionaries
        highlighted_words (set): Optional set to collect highlighted words
        
    Returns:
        str: Formatted system prompt
    """
    # Convert keywords_to_replace from list of dicts to formatted string
    replacements_text = ""
    if keywords_to_replace:
        replacements_text = "REPLACEMENTS:\n"
        for replacement in keywords_to_replace:
            replacements_text += f"- Replace '{replacement['original']}' with '{replacement['replacement']}'\n"
            # Add to highlighted words
            if highlighted_words is not None:
                highlighted_words.add(replacement['original'])

    # Convert keywords_to_keep to formatted string
    keywords_text = ""
    if keywords_to_keep:
        keywords_text = "KEYWORDS TO KEEP:\n"
        for keyword in keywords_to_keep:
            keywords_text += f"- {keyword}\n"
            # Add to highlighted words
            if highlighted_words is not None:
                highlighted_words.add(keyword)

    # Format examples
    examples_text = ""
    if samples:
        examples_text = "EXAMPLES:\n"
        for i, sample in enumerate(samples, 1):
            examples_text += f"Example {i}:\nOriginal: {sample['original']}\nSimplified: {sample['simplified']}\n\n"

    # Combine all parts into the full system prompt
    system_prompt = f"{base_prompt}\n\n{keywords_text}\n{replacements_text}\n{examples_text}"
    return system_prompt


def create_element_prompt(element, text=None):
    """Create a prompt specifically tailored to the element type"""
    element_type = element["type"]
    # Use the provided text if available, otherwise use the element's text
    text = text or element["text"]
    
    # Base prompt for all elements
    prompt = f"Simplify the following text to grade 6 reading level:\n\n{text}\n\n"
    
    # Add element-specific instructions
    if element_type == "list_item":
        prompt += "This is a list item. Maintain the bullet point or numbering format. "
        if element.get("list_info", {}).get("type") == "bullet":
            prompt += "Preserve the bullet symbol at the beginning. "
        elif element.get("list_info", {}).get("type") == "number":
            prompt += "Preserve the numbering at the beginning. "
    
    # Add general reminders for all elements - using clear instruction markers to prevent them leaking into output
    prompt += "INSTRUCTIONS FOR AI (DO NOT INCLUDE IN RESPONSE): Keep the same general structure. Do not add or remove information. Simplify language only."
    
    # For elements with highlighted phrases, add a reminder to preserve them
    if element["highlighted_phrases"]:
        highlighted = list(element["highlighted_phrases"])
        phrases_text = ", ".join([f"'{phrase}'" for phrase in highlighted[:5]])
        if len(highlighted) > 5:
            phrases_text += f", and {len(highlighted) - 5} more"
        prompt += f"\n\nINSTRUCTIONS FOR AI (DO NOT INCLUDE IN RESPONSE): CRITICAL: You MUST preserve these exact phrases in your output - do not modify, replace, or remove them: {phrases_text}"
    
    # Stronger instruction for URL preservation
    if element.get("urls"):
        urls = list(element["urls"])
        urls_text = ", ".join([f"'{url}'" for url in urls[:3]])
        if len(urls) > 3:
            urls_text += f", and {len(urls) - 3} more"
        prompt += f"\n\nINSTRUCTIONS FOR AI (DO NOT INCLUDE IN RESPONSE): CRITICAL: Preserve these exact URLs in your output - do not modify or remove them: {urls_text}"
    
    return prompt

