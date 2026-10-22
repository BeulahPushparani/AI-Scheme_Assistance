import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SavedScheme } from "../models/SavedScheme.js";
import { Scheme } from "../models/Scheme.js";

/**
 * POST /api/saved/:schemeId
 * Save a scheme for the current user.
 */
export const saveScheme = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;

  const scheme = await Scheme.findOne({ schemeId });
  if (!scheme) throw ApiError.notFound("Scheme not found");

  const existing = await SavedScheme.findOne({ userId: req.user._id, schemeId });
  if (existing) {
    return res
      .status(200)
      .json(new ApiResponse(200, { saved: true }, "Already saved"));
  }

  await SavedScheme.create({ userId: req.user._id, schemeId });

  return res
    .status(201)
    .json(new ApiResponse(201, { saved: true }, "Scheme saved"));
});

/**
 * DELETE /api/saved/:schemeId
 * Remove a saved scheme.
 */
export const unsaveScheme = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;

  const removed = await SavedScheme.findOneAndDelete({
    userId: req.user._id,
    schemeId,
  });
  if (!removed) throw ApiError.notFound("Not saved");

  return res
    .status(200)
    .json(new ApiResponse(200, { saved: false }, "Scheme removed"));
});

/**
 * GET /api/saved
 * List all saved schemes for the current user (with full scheme data).
 */
export const listSaved = asyncHandler(async (req, res) => {
  const savedRecords = await SavedScheme.find({ userId: req.user._id }).sort({
    savedAt: -1,
  });

  const schemeIds = savedRecords.map((r) => r.schemeId);
  const schemes = await Scheme.find({ schemeId: { $in: schemeIds } });

  const schemeMap = Object.fromEntries(schemes.map((s) => [s.schemeId, s]));

  const items = savedRecords.map((rec) => ({
    _id: rec._id,
    schemeId: rec.schemeId,
    note: rec.note,
    savedAt: rec.savedAt,
    scheme: schemeMap[rec.schemeId] || null,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { saved: items }, "Saved schemes fetched"));
});

/**
 * GET /api/saved/:schemeId/check
 * Check if a specific scheme is saved.
 */
export const checkSaved = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;

  const saved = await SavedScheme.exists({
    userId: req.user._id,
    schemeId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { saved: Boolean(saved) }, "Checked"));
});