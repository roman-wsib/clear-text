import re
import uuid
import logging

logger = logging.getLogger(__name__)


def extract_document_structure(doc, highlighted_words=None, keywords_to_keep=None):
    """
    Extract document structure including styles, headings, lists, etc.
    Returns a structured representation that preserves formatting.
    
    Args:
        doc: The Word document to process
        highlighted_words: Set to collect highlighted words (modified in-place)
        keywords_to_keep: List of keywords that should be preserved
        
    Returns:
        list: A list of document elements with their structure and formatting
    """
    highlighted_words = highlighted_words or set()
    keywords_to_keep = keywords_to_keep or []
    
    # Don't automatically add keywords_to_keep to highlighted_words
    # We want to preserve these keywords but not highlight them
    # Commented out to ensure keywords are not automatically highlighted
    # if keywords_to_keep:
    #     highlighted_words.update(keywords_to_keep)
        
    logger.info("📑 Extracting document structure...")
    
    document_elements = []
    
    # Track media elements in the document
    media_elements = []
    
    # Process all paragraphs as structured elements
    for i, paragraph in enumerate(doc.paragraphs):
        if not paragraph.text.strip():
            continue  # Skip empty paragraphs but maintain them in the document
            
        # Determine paragraph type based on style
        style_name = paragraph.style.name.lower()
        
        # Extract formatting information
        format_info = _extract_paragraph_format(paragraph)
        
        # Determine element type
        element_type = _determine_element_type(paragraph, style_name)
        
        # Extract and process runs with their formatting
        runs_data = []
        highlighted_phrases = set()
        highlighted_text = ""
        
        for j, run in enumerate(paragraph.runs):
            run_data = {
                "text": run.text,
                "bold": run.bold,
                "italic": run.italic,
                "underline": run.underline,
                "highlight": run.font.highlight_color is not None,
                "font_size": run.font.size.pt if run.font.size else None,
                "font_name": run.font.name if run.font.name else None,
                "color": _extract_color(run)
            }
            
            if run.font.highlight_color:
                if j > 0 and paragraph.runs[j-1].font.highlight_color:
                    highlighted_text += run.text if run.text else " "
                else:
                    if highlighted_text:
                        highlighted_phrases.add(highlighted_text)
                        highlighted_words.add(highlighted_text)
                    highlighted_text = run.text if run.text else " "
            elif highlighted_text:
                highlighted_phrases.add(highlighted_text)
                highlighted_words.add(highlighted_text)
                highlighted_text = ""
            
            runs_data.append(run_data)
        
        # Add any remaining highlighted text
        if highlighted_text:
            highlighted_phrases.add(highlighted_text)
            highlighted_words.add(highlighted_text)
            highlighted_text = ""
        
        # Create a document element preserving structure and formatting
        element = {
            "id": str(uuid.uuid4()),
            "index": i,
            "type": element_type,
            "text": paragraph.text,
            "style": style_name,
            "format": format_info,
            "runs": runs_data,
            "highlighted_phrases": highlighted_phrases,
            "list_info": _extract_list_info(paragraph) if element_type == "list_item" else None
        }
        
        document_elements.append(element)
    
    # Extract inline shapes and media elements
    for i, paragraph in enumerate(doc.paragraphs):
        # Check for inline shapes in the paragraph
        for shape in paragraph._element.xpath('.//w:drawing'):
            media_element = {
                "id": str(uuid.uuid4()),
                "type": "media",
                "index": i,  # Associate with paragraph index
                "media_type": "inline_shape",
                "xml_element": shape
            }
            media_elements.append(media_element)
    
    # Extract all document parts that might contain media
    for rel_id, rel in doc.part.rels.items():
        # Check for images, charts, and other media
        if any(media_type in rel.target_ref for media_type in 
              ['image', 'media', 'chart', 'diagram', 'drawing']):
            media_element = {
                "id": str(uuid.uuid4()),
                "type": "media",
                "media_type": "embedded_media",
                "rel_id": rel_id,
                "target": rel.target_ref
            }
            media_elements.append(media_element)
    
    # Check for any shapes in the document
    if hasattr(doc, 'inline_shapes') and doc.inline_shapes:
        for i, shape in enumerate(doc.inline_shapes):
            # Find the paragraph containing this shape
            for p_idx, paragraph in enumerate(doc.paragraphs):
                if any(run._element.xpath('.//w:drawing') for run in paragraph.runs):
                    media_element = {
                        "id": str(uuid.uuid4()),
                        "type": "media",
                        "index": p_idx,  # Associate with paragraph index
                        "media_type": "inline_shape",
                        "shape_index": i
                    }
                    media_elements.append(media_element)
                    break
    
    # Add media elements to the document elements list
    document_elements.extend(media_elements)
    
    logger.info(f"📋 Extracted {len(document_elements)} document elements (including {len(media_elements)} media elements)")
    return document_elements

def _extract_paragraph_format(paragraph):
    """Extract paragraph formatting information"""
    return {
        "alignment": paragraph.alignment,
        "left_indent": paragraph.paragraph_format.left_indent.pt if paragraph.paragraph_format.left_indent else 0,
        "right_indent": paragraph.paragraph_format.right_indent.pt if paragraph.paragraph_format.right_indent else 0,
        "first_line_indent": paragraph.paragraph_format.first_line_indent.pt if paragraph.paragraph_format.first_line_indent else 0,
        "line_spacing": paragraph.paragraph_format.line_spacing,
        "keep_together": paragraph.paragraph_format.keep_together,
        "keep_with_next": paragraph.paragraph_format.keep_with_next,
        "page_break_before": paragraph.paragraph_format.page_break_before,
        "has_math": bool(paragraph._element.xpath(".//m:oMath"))
    }

def _extract_color(run):
    """Extract run color information"""
    if not run.font.color.rgb:
        return None
    return run.font.color.rgb

def _extract_list_info(paragraph):
    """Extract list information from a paragraph"""
    list_info = {}
    
    # Look for indentation and bullet/number markers
    text = paragraph.text.strip()
    if text.startswith('•') or text.startswith('-') or text.startswith('*'):
        list_info["type"] = "bullet"
        list_info["level"] = 0  # Default level
    elif re.match(r'^\d+\.', text) or re.match(r'^[a-zA-Z]\.', text):
        list_info["type"] = "number"
        list_info["level"] = 0  # Default level
    
    # If we identified a list item, adjust level based on indentation
    if list_info.get("type"):
        if paragraph.paragraph_format.left_indent:
            # Estimate list level based on indentation
            indent = paragraph.paragraph_format.left_indent.pt
            list_info["level"] = int(indent / 36)  # Rough estimate: ~36pt per level
    
    return list_info

def _determine_element_type(paragraph, style_name):
    """Determine the element type based on paragraph style and content"""
    # Check for headings
    if "heading" in style_name or "title" in style_name or "header" in style_name:
        level = 1
        if "heading" in style_name and any(digit in style_name for digit in "123456789"):
            # Extract heading level if present (e.g., "Heading 1" -> 1)
            for digit in "123456789":
                if digit in style_name:
                    level = int(digit)
                    break
        return f"heading_{level}"
    
    # Check for list items
    text = paragraph.text.strip()
    if text.startswith('•') or text.startswith('-') or text.startswith('*'):
        return "list_item"
    if re.match(r'^\d+\.', text) or re.match(r'^[a-zA-Z]\.', text):
        return "list_item"
    
    # Check for table of contents
    if "toc" in style_name or "contents" in style_name:
        return "toc_entry"
    
    # Check for captions
    if "caption" in style_name:
        return "caption"
    
    # Default to paragraph
    return "paragraph" 
