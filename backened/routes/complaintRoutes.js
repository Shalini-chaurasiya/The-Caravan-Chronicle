
import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  createComplaint,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("photo"),
  createComplaint
);

export default router;
