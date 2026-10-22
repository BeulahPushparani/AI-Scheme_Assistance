import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  // Mongoose: bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    statusCode = 409;
    message = `${field} already exists`;
  }

  // Mongoose: validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Zod error (fallback if validation middleware didn't catch)
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    errors = err.errors.map((e) => ({ field: e.path.join("."), message: e.message }));
  }

  // Log non-operational errors
  if (statusCode >= 500) {
    console.error("🔥 Server error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}