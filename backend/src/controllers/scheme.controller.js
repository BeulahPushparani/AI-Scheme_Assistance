import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Scheme } from "../models/Scheme.js";

/**
 * GET /api/schemes?category=&status=&q=&page=&limit=
 * Public — anyone can browse schemes.
 */
export const listSchemes = asyncHandler(async (req, res) => {
  const { category, status, q, page, limit } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { shortDescription: { $regex: q, $options: "i" } },
      { tags: { $in: [new RegExp(q, "i")] } },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Scheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Scheme.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      schemes: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }, "Schemes fetched")
  );
});

/**
 * GET /api/schemes/:schemeId
 * Public — fetch one scheme by its human-readable schemeId.
 */
export const getScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findOne({ schemeId: req.params.schemeId });
  if (!scheme) throw ApiError.notFound("Scheme not found");

  return res.status(200).json(
    new ApiResponse(200, { scheme }, "Scheme fetched")
  );
});

/**
 * POST /api/schemes
 * Admin only.
 */
export const createScheme = asyncHandler(async (req, res) => {
  const { schemeId } = req.body;

  const existing = await Scheme.findOne({ schemeId });
  if (existing) throw ApiError.conflict(`Scheme ${schemeId} already exists`);

  const scheme = await Scheme.create(req.body);

  return res.status(201).json(
    new ApiResponse(201, { scheme }, "Scheme created")
  );
});

/**
 * PUT /api/schemes/:schemeId
 * Admin only.
 */
export const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findOneAndUpdate(
    { schemeId: req.params.schemeId },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!scheme) throw ApiError.notFound("Scheme not found");

  return res.status(200).json(
    new ApiResponse(200, { scheme }, "Scheme updated")
  );
});

/**
 * DELETE /api/schemes/:schemeId
 * Admin only.
 */
export const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findOneAndDelete({ schemeId: req.params.schemeId });
  if (!scheme) throw ApiError.notFound("Scheme not found");

  return res.status(200).json(
    new ApiResponse(200, null, "Scheme deleted")
  );
});