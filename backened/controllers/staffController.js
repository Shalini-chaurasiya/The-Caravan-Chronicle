
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import Staff from "../models/Staff.js";

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

    // Validate required fields
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
      experience: experience === "" || experience == null
        ? 0
        : Number(experience),
      address,
      city,
      state,
      pincode,
      photo: req.file ? `/uploads/staff/${req.file.filename}` : "",
      password: hashedPassword,
      status: "Active",
    });

    // Never send the password back to the frontend
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

const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .select("-password")
      .sort({ createdAt: -1 });

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

export { createStaff, getAllStaff };
