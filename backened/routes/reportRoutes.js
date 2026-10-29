import express from "express";

import {
  getReportsAnalytics,
} from "../controllers/reportController.js";

const router =
  express.Router();

// ======================================================
// REPORTS & ANALYTICS
// ======================================================

// GET /api/reports/analytics
router.get(
  "/analytics",
  getReportsAnalytics
);

export default router;