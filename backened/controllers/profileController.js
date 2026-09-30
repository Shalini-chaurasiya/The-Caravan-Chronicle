import User from "../models/User.js";
import fs from "fs";

// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async (req, res) => {
  try {
    console.log("=================================");
    console.log("GET PROFILE");
    console.log("JWT USER:", req.user);
    console.log("=================================");

    // Your JWT contains "id"
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      gender,
      contact,
      dob,
    } = req.body;

    // ==========================================
    // GET USER ID FROM JWT
    // ==========================================

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // ==========================================
    // CHECK EMAIL
    // ==========================================

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: {
        $ne: userId,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // ==========================================
    // FIND LOGGED-IN USER
    // ==========================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // UPDATE PROFILE DATA
    // ==========================================

    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    user.address = address || "";
    user.gender = gender || "";
    user.contact = contact || "";
    user.dob = dob || null;

    // ==========================================
    // UPDATE PROFILE IMAGE
    // ==========================================

    if (req.file) {
      // Delete previous image
      if (user.profileImage) {
        const oldImagePath = user.profileImage.startsWith("/")
          ? user.profileImage.substring(1)
          : user.profileImage;

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path
      user.profileImage =
        `/uploads/profile/${req.file.filename}`;
    }

    // ==========================================
    // SAVE USER
    // ==========================================

    await user.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        gender: user.gender,
        contact: user.contact,
        dob: user.dob,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};