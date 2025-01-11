import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './src/routes/user.routes.js';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __dirName = path.resolve(); // Get the absolute path of the current directory
const frontendPath = path.join(__dirName, '..', 'frontend', 'dist'); // Path to frontend build folder

const app = express();

// CORS configuration (ensure CORS_ORIGIN is set in .env)
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Fallback if not set
    credentials: true
}));

// Middleware to parse incoming request bodies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Serve static files from 'public'
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/v1/users", router);

// Production environment: serve frontend assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}


export { app }; 
