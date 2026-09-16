import express from "express";

import {
    getProfile,
    updateProfile
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import uploadProfile from "../middleware/profileUploadMiddleware.js";


const router = express.Router();


// ==========================================
// GET PROFILE
// ==========================================

router.get(
    "/",
    authMiddleware,
    getProfile
);


// ==========================================
// UPDATE PROFILE
// ==========================================

router.put(
    "/",
    authMiddleware,
    uploadProfile.single("profileImage"),
    updateProfile
);


export default router;