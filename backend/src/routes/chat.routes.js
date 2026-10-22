import express from "express";
import {
  askQuestion,
  reindexSchemes,
  chatStats,
} from "../controllers/chat.controller.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/ask", askQuestion);
router.get("/stats", chatStats);
router.post("/reindex", requireAdmin, reindexSchemes);

export default router;