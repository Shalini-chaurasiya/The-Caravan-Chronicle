import express from "express";

import {
  getAllComplaints,
  getComplaintById,
  getStaffForComplaint,
  assignStaff,
  removeStaff,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/adminComplaintController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// ALL ROUTES REQUIRE ADMIN LOGIN
// ==========================================

// Get all complaints
router.get(
  "/",
  adminMiddleware,
  getAllComplaints
);

// Get one complaint
router.get(
  "/:id",
  adminMiddleware,
  getComplaintById
);

// Get active staff for this complaint
router.get(
  "/:id/staff",
  adminMiddleware,
  getStaffForComplaint
);

// Assign staff
router.put(
  "/:id/assign",
  adminMiddleware,
  assignStaff
);

// Remove staff
router.put(
  "/:id/remove-staff",
  adminMiddleware,
  removeStaff
);

// Update status
router.put(
  "/:id/status",
  adminMiddleware,
  updateComplaintStatus
);

// Delete complaint
router.delete(
  "/:id",
  adminMiddleware,
  deleteComplaint
);

export default router;