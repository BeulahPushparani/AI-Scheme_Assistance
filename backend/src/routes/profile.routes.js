import express from "express";
import { getProfile, upsertProfile, confirmProfile } from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { upsertProfileSchema } from "../validators/profile.validator.js";

const router = express.Router();

router.use(protect); // all profile routes require login

router.get("/", getProfile);
router.put("/", validate(upsertProfileSchema), upsertProfile);
router.post("/confirm", confirmProfile);

export default router;