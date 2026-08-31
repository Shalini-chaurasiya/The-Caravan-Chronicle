import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const app = express();

const mongoose = require("mongoose");

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
