import express from "express";

import {
  adminLogin,
  getAdminDashboard
} from "../controllers/adminController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();


// ==========================================
// ADMIN LOGIN
// POST /api/admin/login
// ==========================================

router.post(
  "/login",
  adminLogin
);


// ==========================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// ==========================================

router.get(
  "/dashboard",
  adminMiddleware,
  getAdminDashboard
);


export default router;