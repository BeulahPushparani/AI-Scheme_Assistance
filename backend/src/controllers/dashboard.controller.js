import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/Profile.js";
import { Scheme } from "../models/Scheme.js";
import { SavedScheme } from "../models/SavedScheme.js";
import { Application } from "../models/Application.js";
import { analyzeAllSchemes } from "../services/eligibilityEngine.js";

/**
 * GET /api/dashboard/stats
 * Returns real counts for the user's dashboard cards.
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Parallel DB queries
  const [profile, savedCount, appliedCount] = await Promise.all([
    Profile.findOne({ userId }),
    SavedScheme.countDocuments({ userId }),
    Application.countDocuments({ userId }),
  ]);

  let eligibleCount = 0;
  let possiblyEligibleCount = 0;
  let hasProfile = Boolean(profile);
  let isConfirmed = profile?.status === "confirmed";

  // Only run the engine when profile is confirmed
  if (isConfirmed) {
    const schemes = await Scheme.find({ status: "active" });
    const results = analyzeAllSchemes(profile, schemes);

    eligibleCount = results.filter((r) => r.status === "eligible").length;
    possiblyEligibleCount = results.filter((r) => r.status === "possibly_eligible").length;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        saved: savedCount,
        eligible: eligibleCount,
        applied: appliedCount,
        pending: possiblyEligibleCount,
        hasProfile,
        isConfirmed,
      },
      "Dashboard stats fetched"
    )
  );
});