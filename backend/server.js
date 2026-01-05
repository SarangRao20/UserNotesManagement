import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Global Middleware
app.use(cors()); // Allow Frontend to connect
app.use(express.json()); // Parse JSON bodies

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// 5. Health Check Route
app.get("/", (req, res) => {
    res.send("API is Running (v1.0)");
});

// 6. Start Server (Only after DB Connects)
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`   Frontend should connect to: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server due to DB connection error.");
    }
};

startServer();
