import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.js";
import { signToken } from "../services/token.service.js";

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already registered");

  const user = await User.create({ name, email, password });
  const token = signToken({ id: user._id, role: user.role });

  return res.status(201).json(
    new ApiResponse(
      201,
      { user: user.toPublicJSON(), token },
      "Account created successfully"
    )
  );
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized("Invalid email or password");

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken({ id: user._id, role: user.role });

  return res.status(200).json(
    new ApiResponse(
      200,
      { user: user.toPublicJSON(), token },
      "Logged in successfully"
    )
  );
});

/**
 * GET /api/auth/me
 */
export const me = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { user: req.user.toPublicJSON() }, "Current user")
  );
});

/**
 * POST /api/auth/logout
 * JWT is stateless — logout is client-side (clear token).
 * Kept for future refresh-token/blacklist support.
 */
export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Logged out"));
});