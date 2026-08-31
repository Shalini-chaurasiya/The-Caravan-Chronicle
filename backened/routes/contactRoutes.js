
import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact/send
router.post("/send", sendContactMessage);

export default router;
