
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
} from "../controllers/staffController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory for uploaded staff photos
const uploadDirectory = path.join(
  __dirname,
  "../uploads/staff"
);

fs.mkdirSync(uploadDirectory, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      `staff-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  },
});

// Accept supported image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WebP images are allowed."));
  }
};

// Upload limit: 2 MB
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

// All routes below require admin authentication
router.use(adminMiddleware);

// GET: Fetch all staff members
// GET /api/staff
router.get("/", getAllStaff);

// GET: Fetch one staff member
// GET /api/staff/:id
router.get("/:id", getStaffById);

// POST: Create a staff member with an optional photo
// POST /api/staff
router.post("/", upload.single("photo"), createStaff);

// PUT: Update staff details and optionally upload a new photo
// PUT /api/staff/:id
router.put("/:id", upload.single("photo"), updateStaff);

// PATCH: Activate or deactivate a staff member
// PATCH /api/staff/:id/status
router.patch("/:id/status", toggleStaffStatus);

// DELETE: Delete a staff member
// DELETE /api/staff/:id
router.delete("/:id", deleteStaff);

export default router;
