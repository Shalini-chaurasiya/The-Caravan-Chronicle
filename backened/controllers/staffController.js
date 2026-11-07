import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { randomBytes } from "crypto";
import Staff from "../models/Staff.js";
import Complaint from "../models/Complaint.js";
import SLASettings from "../models/SLASettings.js";

// ============================================
// STAFF LOGIN
// POST /api/staff/login
// ============================================
const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" ||
        !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT configuration is missing.",
      });
    }

    const staff = await Staff.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (
      !staff ||
      staff.status !== "Active" ||
      !(await bcrypt.compare(password, staff.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        staffId: String(staff._id),
        email: staff.email,
        role: "staff",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Staff login successful.",
      token,
      staff: {
        _id: staff._id,
        staffId: staff.staffId,
        name: staff.name,
        email: staff.email,
        department: staff.department,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Staff login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while signing in.",
    });
  }
};

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
      staffId: `STF-${randomBytes(4)
        .toString("hex")
        .toUpperCase()}`,

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
      staff: {
        ...staffResponse,
        complaints: 0,
      },
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
//
// IMPORTANT:
// Counts complaints assigned to each staff member.
// ============================================
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Get complaint counts for every staff member
    const complaintCounts = await Complaint.aggregate([
      {
        $match: {
          assignedStaff: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$assignedStaff",
          complaints: {
            $sum: 1,
          },
        },
      },
    ]);

    // Convert counts into an easy lookup object
    const countMap = {};

    complaintCounts.forEach((item) => {
      countMap[String(item._id)] = item.complaints;
    });

    // Add complaint count to every staff member
    const staffWithComplaints = staff.map((member) => ({
      ...member,

      complaints:
        countMap[String(member._id)] || 0,
    }));

    return res.status(200).json({
      success: true,
      count: staffWithComplaints.length,
      staff: staffWithComplaints,
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

    // Count complaints assigned to this staff member
    const complaints = await Complaint.countDocuments({
      assignedStaff: staff._id,
    });

    return res.status(200).json({
      success: true,
      staff: {
        ...staff,
        complaints,
      },
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

// GET /api/staff/complaints
const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedStaff: req.staff.staffId,
    })
      .populate("user", "name email contact address profileImage")
      .populate(
        "assignedStaff",
        "staffId name email phone department role experience status photo"
      )
      .sort({ createdAt: -1 })
      .lean();
    const departments = [
      ...new Set(
        complaints
          .map((complaint) => complaint.assignedStaff?.department)
          .filter(Boolean)
      ),
    ];
    const slaSettings = await SLASettings.find({
      status: "Active",
      department: { $in: departments },
    })
      .select("department defaultSLAHours warningBeforeHours")
      .lean();
    const slaByDepartment = new Map(
      slaSettings.map((setting) => [setting.department, setting])
    );
    const now = Date.now();

    const complaintsWithPriority = complaints.map((complaint) => {
      const setting = slaByDepartment.get(
        complaint.assignedStaff?.department
      );

      if (!setting) {
        return {
          ...complaint,
          priority: "Not configured",
          slaDueAt: null,
        };
      }

      const slaDueAt = new Date(
        new Date(complaint.createdAt).getTime() +
          setting.defaultSLAHours * 60 * 60 * 1000
      );
      const remainingHours = (slaDueAt.getTime() - now) / (60 * 60 * 1000);
      const priority =
        remainingHours < 0
          ? "High"
          : remainingHours <= setting.warningBeforeHours
            ? "Medium"
            : "Low";

      return {
        ...complaint,
        priority,
        slaDueAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: complaintsWithPriority.length,
      complaints: complaintsWithPriority,
    });
  } catch (error) {
    console.error("Get assigned complaints error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching assigned complaints.",
    });
  }
};

// PATCH /api/staff/complaints/:id/status
const updateAssignedComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
        allowedStatuses,
      });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { _id: id, assignedStaff: req.staff.staffId },
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate("user", "name email contact address profileImage")
      .populate(
        "assignedStaff",
        "staffId name email phone department role experience status photo"
      )
      .lean();

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Assigned complaint not found.",
      });
    }

    const staff = await Staff.findById(req.staff.staffId)
      .select("department")
      .lean();
    const setting = staff
      ? await SLASettings.findOne({
          department: staff.department,
          status: "Active",
        })
          .select("defaultSLAHours warningBeforeHours")
          .lean()
      : null;
    let priority = "Not configured";
    let slaDueAt = null;

    if (setting) {
      slaDueAt = new Date(
        new Date(complaint.createdAt).getTime() +
          setting.defaultSLAHours * 60 * 60 * 1000
      );
      const remainingHours =
        (slaDueAt.getTime() - Date.now()) / (60 * 60 * 1000);
      priority =
        remainingHours < 0
          ? "High"
          : remainingHours <= setting.warningBeforeHours
            ? "Medium"
            : "Low";
    }

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint: {
        ...complaint,
        priority,
        slaDueAt,
      },
    });
  } catch (error) {
    console.error("Update assigned complaint status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating complaint status.",
    });
  }
};

// ============================================
// GET STAFF PROFILE
// GET /api/staff/profile
// ============================================
const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.staff.staffId)
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
      return res.status(401).json({
        success: false,
        message: "Invalid staff token. Please login again.",
      });
    }

    console.error("Get staff profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching staff profile.",
    });
  }
};

// ============================================
// UPDATE STAFF PROFILE
// PUT /api/staff/profile
// ============================================
const updateStaffProfile = async (req, res) => {
  try {
    const body = req.body || {};
    const editableFields = [
      "phone",
      "experience",
      "address",
      "city",
      "state",
      "pincode",
      "status",
    ];

    const updates = {};

    for (const field of editableFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.phone !== undefined) {
      if (typeof updates.phone !== "string" || !updates.phone.trim()) {
        return res.status(400).json({
          success: false,
          message: "Phone number cannot be empty.",
        });
      }

      updates.phone = updates.phone.trim();
    }

    for (const field of ["address", "city", "state", "pincode"]) {
      if (updates[field] !== undefined) {
        if (typeof updates[field] !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be a string.`,
          });
        }

        updates[field] = updates[field].trim();
      }
    }

    if (updates.experience !== undefined) {
      updates.experience = updates.experience === ""
        ? 0
        : Number(updates.experience);

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

    if (
      updates.status !== undefined &&
      !["Active", "Inactive"].includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "Active" or "Inactive".',
      });
    }

    if (req.file) {
      updates.photo = `/uploads/staff/${req.file.filename}`;
    } else if (body.removePhoto === "true") {
      updates.photo = "";
    }

    const staff = await Staff.findByIdAndUpdate(
      req.staff.staffId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    )
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
      message: "Profile updated successfully.",
      staff,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update staff profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating staff profile.",
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

    // NAME
    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      updates.name = updates.name.trim();
    }

    // EMAIL
    if (updates.email !== undefined) {
      if (!updates.email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty.",
        });
      }

      updates.email = updates.email.trim().toLowerCase();
    }

    // PHONE
    if (updates.phone !== undefined) {
      updates.phone = updates.phone.trim();
    }

    // EXPERIENCE
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

    // PHOTO
    if (req.file) {
      updates.photo = `/uploads/staff/${req.file.filename}`;
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        $set: updates,
      },
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

    // Count complaints after update
    const complaints = await Complaint.countDocuments({
      assignedStaff: staff._id,
    });

    return res.status(200).json({
      success: true,
      message: "Staff details updated successfully.",
      staff: {
        ...staff.toObject(),
        complaints,
      },
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
        message:
          error.message ||
          "Invalid staff ID or data.",
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
      {
        $set: {
          status,
        },
      },
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

    // Count complaints assigned to this staff member
    const complaints = await Complaint.countDocuments({
      assignedStaff: staff._id,
    });

    return res.status(200).json({
      success: true,
      message: `Staff member is now ${status.toLowerCase()}.`,
      staff: {
        ...staff.toObject(),
        complaints,
      },
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
    const staff = await Staff.findByIdAndDelete(
      req.params.id
    );

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

// ============================================
// EXPORT
// ============================================
export {
  staffLogin,
  createStaff,
  getAllStaff,
  getStaffById,
  getAssignedComplaints,
  updateAssignedComplaintStatus,
  getStaffProfile,
  updateStaffProfile,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
};
