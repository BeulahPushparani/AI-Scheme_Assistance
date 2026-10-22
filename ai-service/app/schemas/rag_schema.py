from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SchemeForIngest(BaseModel):
    schemeId: str
    name: str
    category: str
    shortDescription: Optional[str] = ""
    description: Optional[str] = ""
    benefits: Optional[List[str]] = []
    eligibilityText: Optional[str] = ""
    requiredDocuments: Optional[List[str]] = []
    applicationSteps: Optional[List[str]] = []
    officialLink: Optional[str] = ""
    officialSource: Optional[str] = ""
    lastVerifiedDate: Optional[str] = ""

class IngestRequest(BaseModel):
    schemes: List[SchemeForIngest]

class IngestResponse(BaseModel):
    ingested: int
    total_chunks: int
    message: str

class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = 4
    scheme_filter: Optional[str] = None  # optional schemeId filter

class SourceChunk(BaseModel):
    schemeId: str
    schemeName: str
    section: str
    text: str
    distance: Optional[float] = None
    officialSource: Optional[str] = ""

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceChunk]
    model: str

class StatsResponse(BaseModel):
    total_chunks: int
    unique_schemes: int