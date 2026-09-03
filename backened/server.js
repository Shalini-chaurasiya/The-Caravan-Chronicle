
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import dns from "dns";

// =====================================================
// DNS
// =====================================================

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config();

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        credentials: true,
    })
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.status(200).send("Hello World this is me");
});

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

// =====================================================
// CONTACT ROUTES
// =====================================================

app.use("/api/contact", contactRoutes);

// =====================================================
// DASHBOARD ROUTES
// =====================================================

app.use("/api/dashboard", dashboardRoutes);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

// =====================================================
// PORT
// =====================================================

const PORT = process.env.PORT || 3000;

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log("==========================================");
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log("------------------------------------------");
    console.log(
        `Contact API: POST http://localhost:${PORT}/api/contact/send`
    );
    console.log(
        `Dashboard API: GET http://localhost:${PORT}/api/dashboard`
    );
    console.log("==========================================");
});