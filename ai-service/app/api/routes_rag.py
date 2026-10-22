from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_internal_key
from app.rag import vectorstore
from app.rag.chunker import chunk_scheme
from app.rag.retriever import answer_question
from app.schemas.rag_schema import (
    IngestRequest, IngestResponse,
    QueryRequest, QueryResponse,
    StatsResponse, SourceChunk,
)
from app.config import settings
import traceback

router = APIRouter()

@router.post("/ingest", response_model=IngestResponse)
async def ingest_schemes(
    payload: IngestRequest,
    _: bool = Depends(verify_internal_key),
):
    try:
        # Reset collection for a clean ingest
        vectorstore.reset_collection()

        all_chunks = []
        for s in payload.schemes:
            chunks = chunk_scheme(s.model_dump())
            all_chunks.extend(chunks)

        added = vectorstore.add_chunks(all_chunks)
        print(f"✅ Ingested {len(payload.schemes)} schemes → {added} chunks")

        return IngestResponse(
            ingested=len(payload.schemes),
            total_chunks=added,
            message=f"Ingested {len(payload.schemes)} schemes into {added} chunks",
        )
    except Exception as e:
        print(f"❌ Ingest error: {type(e).__name__}: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Ingest error: {str(e)}")

@router.post("/query", response_model=QueryResponse)
async def query_rag(
    payload: QueryRequest,
    _: bool = Depends(verify_internal_key),
):
    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question is required")

    try:
        result = await answer_question(
            payload.question,
            top_k=payload.top_k or 4,
            scheme_filter=payload.scheme_filter,
        )
        return QueryResponse(
            answer=result["answer"],
            sources=[SourceChunk(**s) for s in result["sources"]],
            model=settings.groq_model,
        )
    except Exception as e:
        print(f"❌ RAG query error: {type(e).__name__}: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"RAG error: {str(e)}")

@router.get("/stats", response_model=StatsResponse)
async def rag_stats(_: bool = Depends(verify_internal_key)):
    return StatsResponse(
        total_chunks=vectorstore.count(),
        unique_schemes=vectorstore.unique_schemes(),
    )