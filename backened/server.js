import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const app = express();

<<<<<<< HEAD
const mongoose = require("mongoose");
=======
// CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
>>>>>>> a8ac77f2350f3f588e7a2c17b961f9dd69b72701

// Middleware
app.use(express.json());

// Connect MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("Hello World this is me");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});