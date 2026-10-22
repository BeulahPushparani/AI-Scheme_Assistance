import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Application } from "../models/Application.js";
import { Scheme } from "../models/Scheme.js";

/**
 * POST /api/applications
 * Start tracking a scheme application.
 * Body: { schemeId, notes? }
 */
export const createApplication = asyncHandler(async (req, res) => {
  const { schemeId, notes = "" } = req.body;

  const scheme = await Scheme.findOne({ schemeId });
  if (!scheme) throw ApiError.notFound("Scheme not found");

  const existing = await Application.findOne({
    userId: req.user._id,
    schemeId,
  });
  if (existing) throw ApiError.conflict("Already tracking this application");

  const application = await Application.create({
    userId: req.user._id,
    schemeId,
    status: "started",
    notes,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { application }, "Application tracked"));
});

/**
 * PUT /api/applications/:schemeId
 * Update status or notes.
 * Body: { status?, notes? }
 */
export const updateApplication = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;
  const { status, notes } = req.body;

  const application = await Application.findOne({
    userId: req.user._id,
    schemeId,
  });
  if (!application) throw ApiError.notFound("Application not found");

  if (status) {
    application.status = status;
    if (status === "applied" && !application.appliedAt) {
      application.appliedAt = new Date();
    }
  }
  if (notes !== undefined) application.notes = notes;

  await application.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { application }, "Application updated"));
});

/**
 * GET /api/applications
 * List all applications for the user.
 */
export const listApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ userId: req.user._id }).sort({
    updatedAt: -1,
  });

  const schemeIds = apps.map((a) => a.schemeId);
  const schemes = await Scheme.find({ schemeId: { $in: schemeIds } });
  const schemeMap = Object.fromEntries(schemes.map((s) => [s.schemeId, s]));

  const items = apps.map((a) => ({
    _id: a._id,
    schemeId: a.schemeId,
    status: a.status,
    notes: a.notes,
    appliedAt: a.appliedAt,
    updatedAt: a.updatedAt,
    scheme: schemeMap[a.schemeId] || null,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { applications: items }, "Applications fetched"));
});

/**
 * GET /api/applications/:schemeId
 * Get application for a specific scheme (or null).
 */
export const getApplication = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;

  const application = await Application.findOne({
    userId: req.user._id,
    schemeId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { application: application || null }, "Fetched")
    );
});

/**
 * DELETE /api/applications/:schemeId
 * Remove tracked application.
 */
export const deleteApplication = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;

  const removed = await Application.findOneAndDelete({
    userId: req.user._id,
    schemeId,
  });
  if (!removed) throw ApiError.notFound("Application not found");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Application removed"));
});