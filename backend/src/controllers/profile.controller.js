import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/Profile.js";

/**
 * GET /api/profile
 * Returns the current user's profile (or null if not created yet).
 */
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });
  return res.status(200).json(
    new ApiResponse(200, { profile }, "Profile fetched")
  );
});

/**
 * PUT /api/profile
 * Upsert — creates if missing, updates if exists.
 * Partial updates are supported (wizard sends per-step data).
 */
export const upsertProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Build $set — only include fields present in the body
  const updates = {};
  for (const [key, value] of Object.entries(req.body)) {
    if (value === undefined) continue;
    if (value === null) {
      updates[key] = null;
      continue;
    }
    // Merge nested objects (student, farmer, etc.)
    if (typeof value === "object" && !Array.isArray(value)) {
      for (const [subKey, subVal] of Object.entries(value)) {
        updates[`${key}.${subKey}`] = subVal;
      }
    } else {
      updates[key] = value;
    }
  }

  // Once confirmed, reset to draft when user edits again
  const existing = await Profile.findOne({ userId });
  if (existing?.status === "confirmed") {
    updates.status = "draft";
    updates.confirmedAt = null;
  }

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: updates, $setOnInsert: { userId } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json(
    new ApiResponse(200, { profile }, "Profile saved")
  );
});

/**
 * POST /api/profile/confirm
 * Marks the profile as confirmed after basic completeness check.
 */
export const confirmProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });
  if (!profile) throw ApiError.badRequest("No profile found to confirm");

  // Basic completeness checks
  const missing = [];
  if (!profile.fullName) missing.push("fullName");
  if (!profile.district) missing.push("district");
  if (profile.annualFamilyIncome === null || profile.annualFamilyIncome === undefined)
    missing.push("annualFamilyIncome");

  if (missing.length > 0) {
    throw ApiError.badRequest(`Please fill: ${missing.join(", ")}`);
  }

  profile.status = "confirmed";
  profile.confirmedAt = new Date();
  await profile.save();

  return res.status(200).json(
    new ApiResponse(200, { profile }, "Profile confirmed successfully")
  );
});