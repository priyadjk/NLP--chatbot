# Penguin NLP Chat Backend

A Natural Language Processing-powered backend for the Penguin Chat application. This service provides intelligent responses with sentiment analysis, entity recognition, and context-aware conversations.

## Features

- Sentiment Analysis using Hugging Face Transformers
- Named Entity Recognition using spaCy
- Intent Detection
- Context-aware responses
- Emotion-based response selection
- RESTful API using FastAPI

## Setup

1. Create and activate virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

3. Start the server:

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### POST /chat

Process a chat message and return an intelligent response.

Request body:

```json
{
  "text": "Hello, how are you?",
  "user_id": "user123" // optional
}
```

Response:

```json
{
  "text": "Hi there! How can I help? *tilts head curiously*",
  "sentiment": "POSITIVE",
  "entities": []
}
```

### GET /health

Health check endpoint.

Response:

```json
{
  "status": "healthy"
}
```

## NLP Features

1. **Sentiment Analysis**: Detects the emotional tone of messages (POSITIVE, NEGATIVE, NEUTRAL)
2. **Entity Recognition**: Identifies named entities in the text (people, places, organizations, etc.)
3. **Intent Detection**: Recognizes user intents like greetings, questions, farewells, and thanks
4. **Contextual Responses**: Provides appropriate responses based on intent and sentiment

## Integration with Frontend

To connect with the React frontend, update the API endpoint in your frontend configuration to point to this backend server (default: http://localhost:8000).

## Development

The backend uses:

- FastAPI for the web framework
- spaCy for NLP tasks
- Transformers for sentiment analysis
- Pydantic for data validation

To modify responses, edit the `api/responses.json` file.
