import express from "express";

import {
  registerCitizen,
  loginCitizen
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerCitizen);

router.post("/login", loginCitizen);

export default router;