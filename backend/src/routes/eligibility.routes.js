import express from "express";
import { analyzeEligibility, analyzeOneScheme, explainOneWithAI, } from "../controllers/eligibility.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // both endpoints require login

router.post("/analyze", analyzeEligibility);
router.get("/scheme/:schemeId", analyzeOneScheme);
router.post("/explain/:schemeId", explainOneWithAI);

export default router;