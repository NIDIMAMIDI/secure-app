import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectDB from "./config/db/db.js";
import router from "./routes/index.router.js";
import { errorHandler } from "./middleware/errors/errors.middleware.js";

// Initialize Express application
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
// Rate Limiting (Prevents brute-force attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Define API Routes
app.use("/api/v1", router);

// Error Handling Middleware (MUST be placed **after** routes)
app.use(errorHandler);

// Start Server Only After Connecting to Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
