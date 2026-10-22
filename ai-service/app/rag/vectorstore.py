import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Optional
import os

# Persist Chroma data next to the ai-service folder
CHROMA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_data")
os.makedirs(CHROMA_DIR, exist_ok=True)

_client = None
_collection = None

COLLECTION_NAME = "schemes"

def get_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(
            path=CHROMA_DIR,
            settings=ChromaSettings(anonymized_telemetry=False, allow_reset=True),
        )
    return _client

def get_collection():
    global _collection
    if _collection is None:
        _collection = get_client().get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection

def reset_collection():
    """Delete and recreate the collection (used before re-ingest)."""
    global _collection
    client = get_client()
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    _collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
    return _collection

def add_chunks(chunks: List[Dict]):
    """chunks: [{id, text, metadata}]"""
    if not chunks:
        return 0
    col = get_collection()
    col.upsert(
        ids=[c["id"] for c in chunks],
        documents=[c["text"] for c in chunks],
        metadatas=[c["metadata"] for c in chunks],
    )
    return len(chunks)

def query(text: str, top_k: int = 4, scheme_filter: Optional[str] = None) -> List[Dict]:
    col = get_collection()
    where = {"schemeId": scheme_filter} if scheme_filter else None
    res = col.query(
        query_texts=[text],
        n_results=top_k,
        where=where,
    )
    results = []
    if not res or not res.get("documents"):
        return results
    docs = res["documents"][0]
    metas = res["metadatas"][0] if res.get("metadatas") else [{}] * len(docs)
    dists = res["distances"][0] if res.get("distances") else [None] * len(docs)

    for doc, meta, dist in zip(docs, metas, dists):
        results.append({
            "text": doc,
            "metadata": meta,
            "distance": dist,
        })
    return results

def count() -> int:
    col = get_collection()
    return col.count()

def unique_schemes() -> int:
    col = get_collection()
    try:
        result = col.get(include=["metadatas"])
        metas = result.get("metadatas") or []
        return len({m.get("schemeId") for m in metas if m})
    except Exception:
        return 0