from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get("/health")
async def health():
    return {
        "success": True,
        "service": "ai-service",
        "model": settings.groq_model,
        "status": "healthy",
    }