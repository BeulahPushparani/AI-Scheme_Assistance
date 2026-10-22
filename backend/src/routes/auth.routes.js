import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

// Brute-force protection for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 requests per window
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

export default router;