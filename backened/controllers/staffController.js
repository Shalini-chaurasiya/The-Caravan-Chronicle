
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import Staff from "../models/Staff.js";

// ============================================
// CREATE STAFF
// POST /api/staff
// ============================================
const createStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      dob,
      department,
      role,
      experience,
      address,
      city,
      state,
      pincode,
      password,
      confirmPassword,
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !department ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingStaff = await Staff.findOne({
      email: normalizedEmail,
    });

    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: "A staff account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const staff = await Staff.create({
      staffId: `STF-${randomBytes(4).toString("hex").toUpperCase()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      gender,
      dob: dob || undefined,
      department,
      role: role || "Staff",
      experience:
        experience === "" || experience == null
          ? 0
          : Number(experience),
      address,
      city,
      state,
      pincode,
      photo: req.file
        ? `/uploads/staff/${req.file.filename}`
        : "",
      password: hashedPassword,
      status: "Active",
    });

    const staffResponse = staff.toObject();
    delete staffResponse.password;

    return res.status(201).json({
      success: true,
      message: "Staff added successfully.",
      staff: staffResponse,
    });
  } catch (error) {
    console.error("Create staff error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Staff email or ID already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while adding staff.",
    });
  }
};

// ============================================
// GET ALL STAFF
// GET /api/staff
// ============================================
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error("Get staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching staff.",
    });
  }
};

// ============================================
// GET ONE STAFF MEMBER
// GET /api/staff/:id
// ============================================
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select("-password")
      .lean();

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    console.error("Get staff details error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching staff details.",
    });
  }
};

// ============================================
// UPDATE STAFF
// PUT /api/staff/:id
// ============================================
const updateStaff = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "gender",
      "dob",
      "department",
      "role",
      "experience",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      updates.name = updates.name.trim();
    }

    if (updates.email !== undefined) {
      if (!updates.email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty.",
        });
      }

      updates.email = updates.email.trim().toLowerCase();
    }

    if (updates.phone !== undefined) {
      updates.phone = updates.phone.trim();
    }

    if (updates.experience !== undefined) {
      updates.experience = Number(updates.experience);

      if (
        !Number.isFinite(updates.experience) ||
        updates.experience < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Experience must be a non-negative number.",
        });
      }
    }

    // Only replace the photo if a new one was uploaded.
    if (req.file) {
      updates.photo = `/uploads/staff/${req.file.filename}`;
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff details updated successfully.",
      staff,
    });
  } catch (error) {
    console.error("Update staff error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Another staff member already uses this email.",
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid staff ID or data.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating staff.",
    });
  }
};

// ============================================
// ACTIVATE / DEACTIVATE STAFF
// PATCH /api/staff/:id/status
// ============================================
const toggleStaffStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "Active" or "Inactive".',
      });
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Staff member is now ${status.toLowerCase()}.`,
      staff,
    });
  } catch (error) {
    console.error("Toggle staff status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating staff status.",
    });
  }
};

// ============================================
// DELETE STAFF
// DELETE /api/staff/:id
// ============================================
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff member deleted successfully.",
      staffId: staff._id,
    });
  } catch (error) {
    console.error("Delete staff error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while deleting staff.",
    });
  }
};

export {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
};
