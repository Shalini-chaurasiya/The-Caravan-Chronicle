
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const getCurrentAdmin = async (req) => {
  const email = req.admin?.email;

  if (!email) return null;

  return Admin.findOne({
    email: email.toLowerCase(),
    role: "admin",
  });
};

// GET PROFILE
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await getCurrentAdmin(req);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        gender: admin.gender,
        role: admin.role,
        department: admin.department,
        status: admin.status,
        lastLogin: admin.lastLogin,
        accountCreated: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// UPDATE PROFILE
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await getCurrentAdmin(req);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const { name, email, phone, gender } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }
      admin.name = name.trim();
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid email",
        });
      }
      admin.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number",
        });
      }
      admin.phone = phone.trim();
    }

    if (gender !== undefined) {
      if (!["Male", "Female", "Other", ""].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender",
        });
      }
      admin.gender = gender;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        gender: admin.gender,
        role: admin.role,
        department: admin.department,
        status: admin.status,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use",
      });
    }

    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// CHANGE PASSWORD
export const changeAdminPassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Choose a different password",
      });
    }

    const admin = await Admin.findOne({
      email: req.admin?.email?.toLowerCase(),
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const matches = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!matches) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};
