import cors from "cors"
import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import authRoutes from "./routes/auth.routes.js";
import folderRoutes from "./routes/folder.routes.js";

// initializing the app
const app = express();

// cors middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// parsing json data
app.use(json({ limit: "16kb" }));

// parsing url encoded data
app.use(urlencoded({ extended: true, limit: "16kb" }));

// parsing cookies
app.use(cookieParser());

const api_version = `/api/v1`

// auth routes
app.use(`${api_version}/auth`, authRoutes);

// folder routes
app.use(`${api_version}/folders`, folderRoutes);

export default app;