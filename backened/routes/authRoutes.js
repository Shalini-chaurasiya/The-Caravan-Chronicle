import express from "express";

import {
    registerCitizen,
    loginCitizen,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerCitizen);

router.post("/login", loginCitizen);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;