from pydantic import BaseModel
from typing import List, Optional

class Criterion(BaseModel):
    rule: str
    label: str
    weight: Optional[int] = 0
    mandatory: Optional[bool] = False

class SchemeInfo(BaseModel):
    schemeId: str
    name: str
    shortDescription: Optional[str] = ""
    officialSource: Optional[str] = ""

class ExplainRequest(BaseModel):
    scheme: SchemeInfo
    status: str
    score: int
    matched: List[Criterion] = []
    unmatched: List[Criterion] = []
    missing: List[Criterion] = []

class ExplainResponse(BaseModel):
    explanation: str
    model: str