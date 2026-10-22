import express from "express";
import {
  createApplication,
  updateApplication,
  listApplications,
  getApplication,
  deleteApplication,
} from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listApplications);
router.post("/", createApplication);
router.get("/:schemeId", getApplication);
router.put("/:schemeId", updateApplication);
router.delete("/:schemeId", deleteApplication);

export default router;