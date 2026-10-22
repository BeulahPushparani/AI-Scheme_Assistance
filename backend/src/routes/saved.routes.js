import express from "express";
import {
  saveScheme,
  unsaveScheme,
  listSaved,
  checkSaved,
} from "../controllers/saved.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listSaved);
router.post("/:schemeId", saveScheme);
router.delete("/:schemeId", unsaveScheme);
router.get("/:schemeId/check", checkSaved);

export default router;