import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("Hello World this is me");
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});