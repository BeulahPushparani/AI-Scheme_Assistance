import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../services/token.service.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Not authenticated. Please login.");
  }

  const token = header.split(" ")[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw ApiError.unauthorized("Session expired. Please login again.");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized("User no longer exists.");

  req.user = user;
  next();
});

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(ApiError.forbidden("Admin access required."));
  }
  next();
};