import express from "express";

import {
  getSLASettings,
  getSLAByDepartment,
  createSLASettings,
  updateSLASettings,
  deleteSLASettings,
} from "../controllers/slaController.js";

const router = express.Router();

// ======================================================
// SLA SETTINGS ROUTES
// ======================================================

// Get all SLA settings
router.get(
  "/",
  getSLASettings
);

// Get SLA by department
router.get(
  "/department/:department",
  getSLAByDepartment
);

// Create SLA settings
router.post(
  "/",
  createSLASettings
);

// Update SLA settings
router.put(
  "/:id",
  updateSLASettings
);

// Delete SLA settings
router.delete(
  "/:id",
  deleteSLASettings
);

export default router;