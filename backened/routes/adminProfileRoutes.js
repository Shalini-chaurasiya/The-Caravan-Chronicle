
import express from "express";

import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/adminProfileController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET /api/admin/profile
router.get("/profile", adminMiddleware, getAdminProfile);

// PUT /api/admin/profile
router.put("/profile", adminMiddleware, updateAdminProfile);

// PUT /api/admin/profile/password
router.put(
  "/profile/password",
  adminMiddleware,
  changeAdminPassword
);

export default router;
