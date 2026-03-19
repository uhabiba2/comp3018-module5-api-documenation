import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables BEFORE your internal imports!
dotenv.config();

import setupSwagger from "../config/swagger";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import postRouter from "./api/v1/routes/postRoutes";
import userRouter from "./api/v1/routes/userRoutes";
import adminRouter from "./api/v1/routes/adminRoutes";
import { getHelmetConfig } from "../config/helmetConfig";
import { getCorsOptions } from "../config/corsConfig";


const app = express();

// Apply basic Helmet security
app.use(getHelmetConfig());

// apply cors security
app.use(cors(getCorsOptions()));


// 1. Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

// 2. Body parsing middleware
app.use(express.json());

// 3. API Routes
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter)

// 4. Global error handling middleware (MUST be applied last)
app.use(errorHandler);

setupSwagger(app);
export default app;