import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", authMiddleware, getDashboard);

export default router;