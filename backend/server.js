import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import routes from "./src/routes/index.js";
import { notFoundHandler, errorHandler } from "./src/middleware/error.middleware.js";

const app = express();

// ---------- Global middleware ----------
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: [env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === "development") app.use(morgan("dev"));

// ---------- Trust proxy (for rate limiter behind Render/Heroku) ----------
app.set("trust proxy", 1);

// ---------- Routes ----------
app.use("/api", routes);

// ---------- 404 + Error ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Start ----------
const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
    console.log(`   ENV: ${env.NODE_ENV}`);
    console.log(`   CORS allowed: ${env.CLIENT_URL}`);
  });
};

start();