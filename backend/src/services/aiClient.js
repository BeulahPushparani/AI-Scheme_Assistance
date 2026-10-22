import axios from "axios";
import { env } from "../config/env.js";

const aiClient = axios.create({
  baseURL: process.env.AI_SERVICE_URL || "http://localhost:8000",
  timeout: 45000, // 45s — LLM can be slow
  headers: {
    "Content-Type": "application/json",
    "X-Internal-Key": process.env.INTERNAL_API_KEY || "",
  },
});

/**
 * Ask the AI service to explain an eligibility result in plain English.
 */
export async function explainEligibilityWithAI(result) {
  const { scheme, status, score, matched, unmatched, missing } = result;

  try {
    const res = await aiClient.post("/ai/explain-eligibility", {
      scheme: {
        schemeId: scheme.schemeId,
        name: scheme.name,
        shortDescription: scheme.shortDescription || "",
        officialSource: scheme.officialSource || "",
      },
      status,
      score,
      matched: matched.map((m) => ({
        rule: m.rule,
        label: m.label,
        weight: m.weight || 0,
        mandatory: m.mandatory || false,
      })),
      unmatched: unmatched.map((m) => ({
        rule: m.rule,
        label: m.label,
        weight: m.weight || 0,
        mandatory: m.mandatory || false,
      })),
      missing: missing.map((m) => ({
        rule: m.rule,
        label: m.label,
        weight: m.weight || 0,
        mandatory: m.mandatory || false,
      })),
    });

    return res.data.explanation;
  } catch (err) {
    console.error("AI service error:", err.message);
    return null;
  }
}

/**
 * Simple health check for the AI service.
 */
export async function checkAIService() {
  try {
    const res = await aiClient.get("/health");
    return res.data;
  } catch (err) {
    return { success: false, error: err.message };
  }
}
/**
 * Send all schemes to Python for RAG ingestion.
 */
export async function ingestSchemesForRAG(schemes) {
  try {
    const res = await aiClient.post("/ai/rag/ingest", { schemes });
    return res.data;
  } catch (err) {
    console.error("RAG ingest error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Query the RAG system with a user question.
 */
export async function queryRAG(question, topK = 4, schemeFilter = null) {
  try {
    const res = await aiClient.post("/ai/rag/query", {
      question,
      top_k: topK,
      scheme_filter: schemeFilter,
    });
    return res.data;
  } catch (err) {
    console.error("RAG query error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Get RAG stats (chunk count, unique schemes).
 */
export async function getRAGStats() {
  try {
    const res = await aiClient.get("/ai/rag/stats");
    return res.data;
  } catch (err) {
    return { total_chunks: 0, unique_schemes: 0 };
  }
}