
import "dotenv/config";

import express from "express";
import cors from "cors";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProfileRoutes from "./routes/adminProfileRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import adminComplaintRoutes from "./routes/adminComplaintRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import slaRoutes from "./routes/slaRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import { seedAdmin } from "./utils/seedAdmin.js";

// ==========================================
// DIRECTORY PATH
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// DNS CONFIGURATION
// ==========================================

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// ==========================================
// BODY PARSERS
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// SERVE UPLOADED FILES
// ==========================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Caravan Chronicle Backend is running",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/profile", profileRoutes);

// ==========================================
// ADMIN ROUTES
// ==========================================

// POST /api/admin/login
// GET  /api/admin/dashboard
app.use("/api/admin", adminRoutes);

// GET /api/admin/profile
// PUT /api/admin/profile
// PUT /api/admin/profile/password
app.use("/api/admin", adminProfileRoutes);

// ==========================================
// ADMIN COMPLAINTS
// ==========================================

app.use("/api/admin/complaints", adminComplaintRoutes);

// ==========================================
// STAFF MANAGEMENT
// ==========================================

app.use("/api/staff", staffRoutes);

// ==========================================
// DEPARTMENT MANAGEMENT
// ==========================================

app.use("/api/departments", departmentRoutes);

// ==========================================
// SLA & ESCALATION SETTINGS
// ==========================================

app.use("/api/sla", slaRoutes);

// ==========================================
// REPORTS & ANALYTICS
// ==========================================

app.use("/api/reports", reportRoutes);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Photo size must not exceed 2 MB."
          : err.message,
    });
  }

  if (
    err.message ===
    "Only JPG, PNG, and WebP images are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==========================================
// PORT
// ==========================================

const PORT = process.env.PORT || 3000;

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB connected successfully");

    // Initialize the admin account if it does not exist.
    await seedAdmin();

    console.log("Admin initialization completed");

    app.listen(PORT, () => {
      console.log("==========================================");
      console.log("       CARAVAN CHRONICLE BACKEND");
      console.log("==========================================");

      console.log(`Server running on port: ${PORT}`);
      console.log(`Server URL: http://localhost:${PORT}`);

      console.log("------------------------------------------");
      console.log(`Auth API:         http://localhost:${PORT}/api/auth`);
      console.log(`Contact API:      http://localhost:${PORT}/api/contact`);
      console.log(`Dashboard API:    http://localhost:${PORT}/api/dashboard`);
      console.log(`Complaint API:    http://localhost:${PORT}/api/complaints`);
      console.log(`Profile API:      http://localhost:${PORT}/api/profile`);
      console.log(`Admin API:        http://localhost:${PORT}/api/admin`);
      console.log(`Admin Profile:    http://localhost:${PORT}/api/admin/profile`);
      console.log(`Admin Complaints: http://localhost:${PORT}/api/admin/complaints`);
      console.log(`Staff API:        http://localhost:${PORT}/api/staff`);
      console.log(`Department API:   http://localhost:${PORT}/api/departments`);
      console.log(`SLA API:          http://localhost:${PORT}/api/sla`);
      console.log(`Reports API:      http://localhost:${PORT}/api/reports`);
      console.log(`Uploads URL:      http://localhost:${PORT}/uploads/`);

      console.log("==========================================");
    });
  } catch (error) {
    console.error("==========================================");
    console.error("SERVER STARTUP FAILED");
    console.error("==========================================");
    console.error(error);

    process.exit(1);
  }
};

startServer();
