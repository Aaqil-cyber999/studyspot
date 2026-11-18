import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/locations.js";
import reviewRoutes from "./routes/reviews.js";
import reportRoutes from "./routes/reports.js";
import dashboardRoutes from "./routes/dashboard.js";
import userRoutes from "./routes/users.js";
import universityRoutes from "./routes/universities.js";
import registrationRequestRoutes from "./routes/registration-requests.js";
import savedRoutes from "./routes/saved.js";
import reportOptionRoutes from "./routes/report-options.js";
import otpRoutes from "./routes/otp.js";
import amenityRoutes from "./routes/amenities.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";
import { closeDb } from "./db/index.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.disable("x-powered-by");

// Allow localhost-ish origins plus private LAN ranges so devices on the same network (phones) can reach the dev frontend.
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3001",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
  /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
  /^http:\/\/172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}(:\d+)?$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((item) => (typeof item === "string" ? item === origin : item.test(origin)))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
// Profile photos travel as base64 data URLs, so the body limit is generous.
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Log every request with the path only (no query strings, tokens or bodies).
morgan.token<Request, Response>("path", (req) => req.path);
app.use(morgan<Request, Response>(":method :path :status :response-time ms"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/registration-requests", registrationRequestRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/report-options", reportOptionRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/auth/otp", otpRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`SpotWise backend running on http://localhost:${PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down…`);
  server.close(async () => {
    await closeDb();
    process.exit(0);
  });
  // Force-exit if connections linger.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
