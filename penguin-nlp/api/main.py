from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import spacy
from transformers import pipeline
import random
import json
import os

# Initialize FastAPI app
app = FastAPI(title="Penguin NLP Chat")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLP models
try:
    nlp = spacy.load("en_core_web_sm")
except:
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Initialize sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis")

# Load responses from JSON
with open("api/responses.json", "r") as f:
    response_data = json.load(f)

class Message(BaseModel):
    text: str
    user_id: Optional[str] = None

class Response(BaseModel):
    text: str
    sentiment: str
    entities: List[dict]

def get_response(intent: str, sentiment: str) -> str:
    """Get appropriate response based on intent and sentiment."""
    if intent in response_data:
        responses = response_data[intent]
        if sentiment == "POSITIVE":
            return random.choice(responses["positive"])
        elif sentiment == "NEGATIVE":
            return random.choice(responses["negative"])
        return random.choice(responses["neutral"])
    return random.choice(response_data["default"]["neutral"])

def analyze_text(text: str):
    """Analyze text using spaCy and transformers."""
    # SpaCy analysis
    doc = nlp(text)
    
    # Extract entities
    entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
    
    # Sentiment analysis
    sentiment_result = sentiment_analyzer(text)[0]
    sentiment = sentiment_result["label"]
    
    # Basic intent detection
    intent = "default"
    if any(word in text.lower() for word in ["hello", "hi", "hey"]):
        intent = "greeting"
    elif any(word in text.lower() for word in ["bye", "goodbye", "see you"]):
        intent = "farewell"
    elif "?" in text:
        intent = "question"
    elif any(word in text.lower() for word in ["thank", "thanks"]):
        intent = "thanks"
    
    response_text = get_response(intent, sentiment)
    
    return {
        "text": response_text,
        "sentiment": sentiment,
        "entities": entities
    }

@app.post("/chat", response_model=Response)
async def chat(message: Message):
    """Process chat message and return response."""
    try:
        analysis = analyze_text(message.text)
        return Response(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"} 