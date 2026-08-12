from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time

from app.schemas import (
    SpellCheckRequest,
    SpellCheckResponse,
    AutoCorrectRequest,
    AutoCorrectResponse
)
from app.spell_checker import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting FastAPI Tamil Spell Checker Server...")
    engine.load_resources()
    yield
    # Shutdown logic
    print("Shutting down Tamil Spell Checker Server...")


app = FastAPI(
    title="Tamil Spell Checker API (தமிழ் சொல் திருத்தி)",
    description="A high-performance FastAPI backend for Tamil spelling correction, sandhi error detection, and word suggestions.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend (allows all origins during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": "Tamil Spell Checker FastAPI Backend",
        "version": "1.0.0",
        "docs_url": "/docs",
        "loaded_resources": engine.is_loaded
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "engine_ready": engine.is_loaded,
        "bloom_filter": engine.bloom is not None,
        "bk_tree": engine.bk_tree is not None,
        "vaani_engine": engine.vaani is not None
    }


@app.post("/api/check-spelling", response_model=SpellCheckResponse, tags=["Spell Checker"])
async def check_spelling(request: SpellCheckRequest):
    """
    Analyzes Tamil text and identifies misspelled words, sandhi issues, spacing errors, and returns top suggestions.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty."
        )

    result = engine.analyze_text(request.text)
    return result


@app.post("/api/auto-correct", response_model=AutoCorrectResponse, tags=["Spell Checker"])
async def auto_correct(request: AutoCorrectRequest):
    """
    Automatically replaces misspelled words with the highest probability suggestion.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty."
        )

    analysis = engine.analyze_text(request.text)
    return {
        "original_text": analysis["original_text"],
        "corrected_text": analysis["corrected_text"],
        "changes_made": analysis["error_count"]
    }
