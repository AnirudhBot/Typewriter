import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/documents.js";
import logger from "./utils/logger.js";
import { ApiError } from "./utils/errors.js";
import { setupWebSocketServer } from "./config/websocket.js";

dotenv.config();

const app = express();
const server = createServer(app);
setupWebSocketServer(server);

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
      logger.info(`HTTP Server running on port ${PORT}`);
      logger.info(`WebSocket Server is ready for connections`);
    });
  } catch (error) {
    logger.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

init();
