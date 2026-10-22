import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/Profile.js";
import { Scheme } from "../models/Scheme.js";
import { analyzeAllSchemes, evaluateScheme } from "../services/eligibilityEngine.js";
import { explainEligibilityWithAI } from "../services/aiClient.js";
/**
 * POST /api/eligibility/analyze
 * Analyzes current user's confirmed profile against all active schemes.
 */
export const analyzeEligibility = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });
  if (!profile) {
    throw ApiError.badRequest("Please complete your profile first.");
  }
  if (profile.status !== "confirmed") {
    throw ApiError.badRequest("Please confirm your profile first.");
  }

  const schemes = await Scheme.find({ status: "active" });
  const results = analyzeAllSchemes(profile, schemes);

  // Return only the top N (all by default, but keep response lean)
  const topResults = results.slice(0, 50);

  const counts = {
    eligible: results.filter((r) => r.status === "eligible").length,
    possibly_eligible: results.filter((r) => r.status === "possibly_eligible").length,
    not_eligible: results.filter((r) => r.status === "not_eligible").length,
    total: results.length,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      { results: topResults, counts },
      "Eligibility analyzed successfully"
    )
  );
});

/**
 * GET /api/eligibility/scheme/:schemeId
 * Analyzes current user's profile against ONE scheme.
 */
export const analyzeOneScheme = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;

  const scheme = await Scheme.findOne({ schemeId });
  if (!scheme) throw ApiError.notFound("Scheme not found");

  const profile = await Profile.findOne({ userId: req.user._id });
  if (!profile) throw ApiError.badRequest("Please complete your profile first.");

  const evaluation = evaluateScheme(profile, scheme);

  return res.status(200).json(
    new ApiResponse(200, { scheme, ...evaluation }, "Scheme evaluated")
  );
});
export const explainOneWithAI = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;

  const scheme = await Scheme.findOne({ schemeId });
  if (!scheme) throw ApiError.notFound("Scheme not found");

  const profile = await Profile.findOne({ userId: req.user._id });
  if (!profile) throw ApiError.badRequest("Please complete your profile first.");

  // Run the deterministic engine first
  const evaluation = evaluateScheme(profile, scheme);

  // Then ask AI to explain it (never to decide it)
  const explanation = await explainEligibilityWithAI({
    scheme,
    ...evaluation,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        scheme,
        ...evaluation,
        aiExplanation: explanation,
      },
      explanation ? "AI explanation generated" : "Rule result only (AI unavailable)"
    )
  );
});