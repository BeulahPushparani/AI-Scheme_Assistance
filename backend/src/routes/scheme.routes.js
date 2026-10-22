import express from "express";
import {
  listSchemes, getScheme, createScheme, updateScheme, deleteScheme,
} from "../controllers/scheme.controller.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSchemeSchema, updateSchemeSchema } from "../validators/scheme.validator.js";

const router = express.Router();

// Public
router.get("/", listSchemes);
router.get("/:schemeId", getScheme);

// Admin
router.post("/", protect, requireAdmin, validate(createSchemeSchema), createScheme);
router.put("/:schemeId", protect, requireAdmin, validate(updateSchemeSchema), updateScheme);
router.delete("/:schemeId", protect, requireAdmin, deleteScheme);

export default router;