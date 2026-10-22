import express from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import schemeRoutes from "./scheme.routes.js";
import eligibilityRoutes from "./eligibility.routes.js";    
import dashboardRoutes from "./dashboard.routes.js"; 
import savedRoutes from "./saved.routes.js";              // 👈 new
import applicationRoutes from "./application.routes.js";
import chatRoutes from "./chat.routes.js"; 

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/schemes", schemeRoutes);
router.use("/eligibility", eligibilityRoutes); 
router.use("/dashboard", dashboardRoutes); 
router.use("/saved", savedRoutes);                        // 👈 new
router.use("/applications", applicationRoutes); 
router.use("/chat", chatRoutes);                

// Future:
// router.use("/profiles", profileRoutes);
// router.use("/schemes", schemeRoutes);
// router.use("/eligibility", eligibilityRoutes);

export default router;