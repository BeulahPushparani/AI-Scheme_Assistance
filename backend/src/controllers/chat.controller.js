import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Scheme } from "../models/Scheme.js";
import {
  ingestSchemesForRAG,
  queryRAG,
  getRAGStats,
} from "../services/aiClient.js";

/**
 * POST /api/chat/ask
 * Ask a question about schemes.
 */
export const askQuestion = asyncHandler(async (req, res) => {
  const { question, schemeId } = req.body;
  if (!question || !question.trim()) {
    throw ApiError.badRequest("Question is required");
  }

  const result = await queryRAG(question.trim(), 4, schemeId || null);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        answer: result.answer,
        sources: result.sources || [],
        model: result.model,
      },
      "Answer generated"
    )
  );
});

/**
 * POST /api/chat/reindex
 * Admin-only. Re-ingests all schemes into the RAG vector store.
 */
export const reindexSchemes = asyncHandler(async (req, res) => {
  const schemes = await Scheme.find({ status: "active" }).lean();

  const payload = schemes.map((s) => ({
    schemeId: s.schemeId,
    name: s.name,
    category: s.category,
    shortDescription: s.shortDescription || "",
    description: s.description || "",
    benefits: s.benefits || [],
    eligibilityText: s.eligibilityText || "",
    requiredDocuments: s.requiredDocuments || [],
    applicationSteps: s.applicationSteps || [],
    officialLink: s.officialLink || "",
    officialSource: s.officialSource || "",
    lastVerifiedDate: s.lastVerifiedDate
      ? new Date(s.lastVerifiedDate).toISOString()
      : "",
  }));

  const result = await ingestSchemesForRAG(payload);

  return res.status(200).json(
    new ApiResponse(200, result, "Schemes re-indexed successfully")
  );
});

/**
 * GET /api/chat/stats
 * Returns RAG index stats.
 */
export const chatStats = asyncHandler(async (req, res) => {
  const stats = await getRAGStats();
  return res.status(200).json(
    new ApiResponse(200, stats, "RAG stats fetched")
  );
});