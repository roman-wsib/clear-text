# Document Simplification Tool

A powerful tool for simplifying complex language in Word documents while preserving document structure, formatting, and highlighted text.

## Overview

This tool uses Azure OpenAI's language models to simplify text in Word documents. It processes documents in batches, preserving the original structure, formatting, and highlighted text. The tool can be used via a REST API or directly through the command line.

## Features

- Simplifies complex language in Word documents
- Preserves document structure (headings, lists, etc.)
- Maintains original formatting (bold, italic, etc.)
- Preserves highlighted text
- Processes documents in parallel batches for efficiency
- Provides readability scores for simplified text
- Offers both API and command-line interfaces

## Architecture

The document simplification pipeline consists of several key components:

1. **Document Extraction**: Extracts the structure and formatting from the Word document
2. **Batch Processing**: Groups similar elements and processes them in parallel batches
3. **Text Simplification**: Uses Azure OpenAI to simplify the text while preserving key terms
4. **Document Rebuilding**: Reconstructs the document with simplified text while preserving formatting
5. **Readability Scoring**: Calculates readability metrics for the simplified text

### Batching and Concurrency

The tool uses an efficient batching and parallel processing approach:

- Document elements are grouped by type (paragraphs, headings, lists, etc.)
- Similar elements are processed in batches (default: 10 elements per batch)
- Multiple batches are processed concurrently (configurable, default: 10 concurrent batches)
- A semaphore controls the maximum number of concurrent batch operations
- Each batch is processed in a single API call to minimize API requests

## Setup

### Prerequisites

- Python 3.9+
- Azure OpenAI API access
- Required Python packages (see `requirements.txt`)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd simplifying-language-tool/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your Azure OpenAI credentials:
   ```
   AZURE_OPENAI_API_KEY=your_api_key
   AZURE_OPENAI_ENDPOINT=your_endpoint
   AZURE_OPENAI_API_VERSION=2024-08-01-preview
   AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
   ```

### Configuration

The tool's behavior can be customized in `app/utils/config.py`:

- `MAX_CONCURRENT_REQUESTS`: Number of batches to process in parallel (default: 10)
- `BATCH_SIZE`: Number of elements to include in each batch (default: 10)
- `OUTPUT_DIR`: Directory for storing processed documents (default: "test_runs")

## Usage

### Command Line

Process a document using the test script:

```bash
python test.py path/to/your/document.docx
```

This will:
1. Process the document
2. Save the simplified version to the `test_runs` directory
3. Display the readability score and processing time

### API Server

Start the API server:

```bash
python main.py
```

The server will start on http://0.0.0.0:5000 by default.

## API Endpoints

### Document Simplification

**Endpoint**: `POST /api/document/simplify`

**Description**: Simplifies a Word document

**Request**:
- Content-Type: `multipart/form-data`
- Body:
  - `file`: Word document file (.docx)
  - `custom_prompt` (optional): Custom system prompt for the AI

**Response**:
```json
{
  "output_file": "path/to/simplified/document.docx",
  "readability_score": 12.5
}
```

### Text Simplification

**Endpoint**: `POST /api/text/simplify`

**Description**: Simplifies a text string

**Request**:
- Content-Type: `application/json`
- Body:
```json
{
  "text": "Text to simplify",
  "custom_prompt": "Optional custom prompt"
}
```

**Response**:
```json
{
  "simplified_text": "Simplified version of the text",
  "readability_score": 12.5
}
```

### Service Status

**Endpoint**: `GET /api/service/status`

**Description**: Checks if the service is running

**Response**:
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Customization

### Prompt Configuration

The system prompt and other settings can be customized in `prompt-config.json`:

- `base_prompt`: The base system prompt for the AI
- `keywords_to_keep`: Words that should be preserved in the output
- `keywords_to_replace`: Words that should be replaced with simpler alternatives
- `examples`: Example simplifications to guide the AI

## Troubleshooting

- If you encounter rate limiting issues, reduce `MAX_CONCURRENT_REQUESTS` in `config.py`
- For memory issues with large documents, reduce `BATCH_SIZE` in `config.py`
- Check the logs for detailed error messages and processing information

## License

[License information]
