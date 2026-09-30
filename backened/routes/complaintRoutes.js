import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} from "../controllers/complaintController.js";

const router = express.Router();

// ==========================================
// CREATE COMPLAINT
// ==========================================
router.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  createComplaint
);

// ==========================================
// GET MY COMPLAINTS
// ==========================================
router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

// ==========================================
// GET SINGLE COMPLAINT
// ==========================================
router.get(
  "/:id",
  authMiddleware,
  getComplaintById
);

export default router;