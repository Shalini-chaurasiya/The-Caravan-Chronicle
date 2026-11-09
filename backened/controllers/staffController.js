import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { timingSafeEqual } from "crypto";
import { generateResolutionOtp, hashResolutionOtp } from "../utils/resolutionOtp.js";
import sendResolutionOtpEmail from "../utils/sendResolutionOtpEmail.js";
import Staff from "../models/Staff.js";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import SLASettings from "../models/SLASettings.js";
import { createComplaintStatusNotification } from "../utils/createComplaintNotification.js";

const getComplaintTypePriority = (complaint) => {
  const type = String(
    complaint?.complaintType || complaint?.title || ""
  ).toLowerCase();
  const highPriority = [
    "water",
    "pipeline",
    "leakage",
    "road",
    "pothole",
    "drainage",
    "sewer",
    "flood",
    "electric",
    "street light",
    "fire",
  ];

  if (highPriority.some((item) => type.includes(item))) {
    return "High";
  }

  const mediumPriority = [
    "garbage",
    "sanitation",
    "waste",
    "construction",
    "building",
    "traffic",
    "park",
    "horticulture",
  ];

  return mediumPriority.some((item) => type.includes(item))
    ? "Medium"
    : "Low";
};

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

// GET /api/staff/dashboard
const getStaffDashboard = async (req, res) => {
  try {
    const [staff, statusCounts, recentComplaints] = await Promise.all([
      Staff.findById(req.staff.staffId)
        .select("-password")
        .lean(),
      Complaint.aggregate([
        { $match: { assignedStaff: new mongoose.Types.ObjectId(req.staff.staffId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Complaint.find({ assignedStaff: req.staff.staffId })
        .populate("assignedStaff", "department")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    const counts = Object.fromEntries(
      statusCounts.map(({ _id, count }) => [_id, count])
    );
    const total = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    return res.status(200).json({
      success: true,
      staff,
      stats: {
        total,
        pending: counts.Pending || 0,
        inProgress: counts["In Progress"] || 0,
        resolved: counts.Resolved || 0,
      },
      recentComplaints,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(401).json({
        success: false,
        message: "Invalid staff token. Please log in again.",
      });
    }

    console.error("Get staff dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching staff dashboard.",
    });
  }
};

// GET /api/staff/notifications
const getStaffNotifications = async (req, res) => {
  try {
    const filter = {
      staff: req.staff.staffId,
      isRead: false,
    };
    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter)
        .populate("complaint", "complaintType location status createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get staff notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching staff notifications.",
    });
  }
};

// PATCH /api/staff/notifications/:id/read
const markStaffNotificationAsRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        staff: req.staff.staffId,
        isRead: false,
      },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Unread staff notification not found.",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark staff notification read error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating staff notification.",
    });
  }
};

// GET /api/staff/complaints
const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedStaff: req.staff.staffId,
    })
      .select(
        "-resolutionOtp.codeHash -resolutionOtp.attempts -resolutionOtp.sendCount -resolutionOtp.windowStartedAt"
      )
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
          priority: getComplaintTypePriority(complaint),
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
    const allowedStatuses = ["Pending", "In Progress", "Rejected"];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    if (status === "Resolved") {
      return res.status(403).json({
        success: false,
        message: "A complaint can only be resolved after staff verifies the citizen-provided email code.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
        allowedStatuses,
      });
    }

    const complaint = await Complaint.findOne({
      _id: id,
      assignedStaff: req.staff.staffId,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Assigned complaint not found.",
      });
    }

    const previousStatus = complaint.status;
    complaint.status = status;
    await complaint.save();
    if (status !== previousStatus) {
      try {
        await createComplaintStatusNotification(complaint, status);
      } catch (notificationError) {
        console.error(
          "Complaint status was updated, but its notification could not be created:",
          notificationError
        );
      }
    }
    await complaint.populate([
      {
        path: "user",
        select: "name email contact address profileImage",
      },
      {
        path: "assignedStaff",
        select:
          "staffId name email phone department role experience status photo",
      },
    ]);

    const complaintData = complaint.toObject();
    delete complaintData.resolutionOtp;
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
    let priority = getComplaintTypePriority(complaintData);
    let slaDueAt = null;

    if (setting) {
      slaDueAt = new Date(
        new Date(complaintData.createdAt).getTime() +
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
        ...complaintData,
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

// POST /api/staff/complaints/:id/resolution-otp
const sendComplaintResolutionOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { email: submittedEmail } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findOne({
      _id: id,
      assignedStaff: req.staff.staffId,
    }).populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Assigned complaint not found.",
      });
    }

    if (complaint.status !== "In Progress") {
      return res.status(409).json({
        success: false,
        message: "Only an in-progress complaint can be sent for verification.",
      });
    }

    const registeredEmail = complaint.user?.email?.trim().toLowerCase();
    const email =
      typeof submittedEmail === "string"
        ? submittedEmail.trim().toLowerCase()
        : "";
    if (
      !registeredEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registeredEmail)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The citizen must have a valid email address on their profile before resolution verification.",
      });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter the citizen's registered email address.",
      });
    }
    if (email !== registeredEmail) {
      return res.status(400).json({
        success: false,
        message: "The email must match the citizen's registered email address.",
      });
    }

    const now = new Date();
    const otpState = complaint.resolutionOtp;
    if (
      otpState.sentAt &&
      now.getTime() - otpState.sentAt.getTime() < 60_000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait one minute before sending another verification code.",
      });
    }

    const windowIsActive =
      otpState.windowStartedAt &&
      now.getTime() - otpState.windowStartedAt.getTime() < 60 * 60 * 1000;
    const sendCount = windowIsActive ? otpState.sendCount : 0;
    if (sendCount >= 5) {
      return res.status(429).json({
        success: false,
        message: "The maximum number of verification codes was sent. Try again in one hour.",
      });
    }

    const code = generateResolutionOtp();
    const complaintReference = `CMP-${String(complaint._id)
      .slice(-6)
      .toUpperCase()}`;
    const codeHash = hashResolutionOtp(complaint._id.toString(), code);
    await sendResolutionOtpEmail({
      to: email,
      name: complaint.user.name,
      complaintReference,
      code,
    });

    otpState.codeHash = codeHash;
    otpState.expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    otpState.sentAt = now;
    otpState.windowStartedAt = windowIsActive
      ? otpState.windowStartedAt
      : now;
    otpState.sendCount = sendCount + 1;
    otpState.attempts = 0;
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Verification code sent to the citizen's registered email.",
      sentTo: `${email.slice(0, 2)}••••@${email.split("@")[1]}`,
      expiresAt: otpState.expiresAt,
    });
  } catch (error) {
    console.error("Send complaint resolution OTP error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send the verification code.",
    });
  }
};

// POST /api/staff/complaints/:id/verify-resolution-otp
const verifyComplaintResolutionOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "Enter the 6-digit verification code provided by the citizen.",
      });
    }

    const complaint = await Complaint.findOne({
      _id: id,
      assignedStaff: req.staff.staffId,
    });
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Assigned complaint not found.",
      });
    }

    if (complaint.status !== "In Progress") {
      return res.status(409).json({
        success: false,
        message: "Only an in-progress complaint can be verified.",
      });
    }

    const otp = complaint.resolutionOtp;
    if (!otp?.codeHash || !otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active verification code exists. Send a new code first.",
      });
    }

    const now = new Date();
    if (otp.expiresAt.getTime() <= now.getTime()) {
      await Complaint.updateOne(
        {
          _id: id,
          assignedStaff: req.staff.staffId,
          "resolutionOtp.codeHash": otp.codeHash,
        },
        {
          $set: {
            "resolutionOtp.codeHash": null,
            "resolutionOtp.expiresAt": null,
          },
        }
      );
      return res.status(400).json({
        success: false,
        message: "The verification code expired. Send a new code.",
      });
    }

    if (otp.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Send a new verification code.",
      });
    }

    const submittedHash = Buffer.from(hashResolutionOtp(id, code), "hex");
    const savedHash = Buffer.from(otp.codeHash, "hex");
    const hashesMatch =
      submittedHash.length === savedHash.length &&
      timingSafeEqual(submittedHash, savedHash);

    const otpFilter = {
      _id: id,
      assignedStaff: req.staff.staffId,
      status: "In Progress",
      "resolutionOtp.codeHash": otp.codeHash,
      "resolutionOtp.expiresAt": { $gt: now },
      "resolutionOtp.attempts": { $lt: 5 },
    };

    if (!hashesMatch) {
      const failedAttempt = await Complaint.findOneAndUpdate(
        { ...otpFilter, "resolutionOtp.attempts": { $lt: 4 } },
        { $inc: { "resolutionOtp.attempts": 1 } },
        { new: true }
      );

      if (!failedAttempt) {
        const lockedOtp = await Complaint.findOneAndUpdate(
          { ...otpFilter, "resolutionOtp.attempts": 4 },
          {
            $set: {
              "resolutionOtp.attempts": 5,
              "resolutionOtp.codeHash": null,
              "resolutionOtp.expiresAt": null,
            },
          },
          { new: true }
        );

        if (lockedOtp) {
          return res.status(429).json({
            success: false,
            message: "Too many incorrect attempts. Send a new verification code.",
          });
        }
        return res.status(409).json({
          success: false,
          message: "The code expired or was already used. Send a new code.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "The verification code is incorrect.",
      });
    }

    const resolvedComplaint = await Complaint.findOneAndUpdate(
      otpFilter,
      {
        $set: {
          status: "Resolved",
          "resolutionOtp.codeHash": null,
          "resolutionOtp.expiresAt": null,
          "resolutionOtp.attempts": 0,
        },
        $push: {
          statusHistory: {
            status: "Resolved",
            note: "Resolution verified using the citizen-provided email code",
            changedAt: now,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!resolvedComplaint) {
      return res.status(409).json({
        success: false,
        message: "The code expired or was already used. Send a new code.",
      });
    }

    const persistedComplaint = await Complaint.findById(resolvedComplaint._id)
      .select("_id complaintType status statusHistory updatedAt")
      .lean();
    if (persistedComplaint?.status !== "Resolved") {
      console.error(
        `Complaint ${resolvedComplaint._id} did not persist its resolved status after OTP verification.`
      );
      return res.status(500).json({
        success: false,
        message: "The code was accepted, but the complaint status could not be saved. Please retry.",
      });
    }

    try {
      await createComplaintStatusNotification(persistedComplaint, "Resolved");
    } catch (notificationError) {
      console.error(
        "Complaint was resolved, but its status notification could not be created:",
        notificationError
      );
    }

    return res.status(200).json({
      success: true,
      message: "Code verified. Complaint marked resolved.",
      complaint: {
        _id: persistedComplaint._id,
        status: persistedComplaint.status,
        statusHistory: persistedComplaint.statusHistory,
        updatedAt: persistedComplaint.updatedAt,
      },
    });
  } catch (error) {
    console.error("Verify complaint resolution OTP by staff error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify complaint resolution.",
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
  getStaffDashboard,
  getStaffNotifications,
  markStaffNotificationAsRead,
  getAssignedComplaints,
  updateAssignedComplaintStatus,
  sendComplaintResolutionOtp,
  verifyComplaintResolutionOtp,
  getStaffProfile,
  updateStaffProfile,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
};
