from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_health import router as health_router
from app.api.routes_llm import router as llm_router
from app.api.routes_rag import router as rag_router
from app.config import settings

app = FastAPI(
    title="Scheme Saathi AI Service",
    description="LLM + RAG service for government scheme assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, tags=["Health"])
app.include_router(llm_router, prefix="/ai", tags=["AI"])
app.include_router(rag_router, prefix="/ai/rag", tags=["RAG"])

@app.get("/")
async def root():
    return {"service": "ai-service", "docs": "/docs", "health": "/health"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)