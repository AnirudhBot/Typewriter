import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/documents.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// Initialize services
const init = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

init();
