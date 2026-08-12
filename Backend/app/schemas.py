from pydantic import BaseModel, Field
from typing import List, Optional

class SpellCheckRequest(BaseModel):
    text: str = Field(..., description="The Tamil text to check for spelling and grammar errors", example="நான் கடைக்கு சொன்றேன்")

class WordResult(BaseModel):
    word: str = Field(..., description="Original word token")
    is_correct: bool = Field(..., description="Whether the word is spelled correctly")
    error_type: Optional[str] = Field(None, description="Category of error: spelling, grammar, sandhi, colloquial, spacing, or blacklist")
    suggestions: List[str] = Field(default_factory=list, description="Suggested corrections for misspelled words")

class SpacingError(BaseModel):
    type: str = Field(..., description="Type of spacing error")
    message: str = Field(..., description="Description of the error")

class SpellCheckResponse(BaseModel):
    original_text: str
    corrected_text: str
    has_errors: bool
    error_count: int
    words: List[WordResult]
    spacing_errors: List[SpacingError] = Field(default_factory=list)
    process_time_ms: float

class AutoCorrectRequest(BaseModel):
    text: str = Field(..., description="Tamil text to automatically correct", example="அவன் வந்தாள்")

class AutoCorrectResponse(BaseModel):
    original_text: str
    corrected_text: str
    changes_made: int
