
import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";

// ==========================================
// HELPER: GET LOGGED-IN USER ID
// ==========================================

const getUserId = (req) =>
  req.user?.id || req.user?._id || req.user?.userId;

// ==========================================
// HELPER: POPULATE COMPLAINT DETAILS
// ==========================================

const populateComplaint = (query) =>
  query
    .populate("user", "name email contact address profileImage")
    .populate(
      "assignedStaff",
      "staffId name email phone department role experience status photo"
    );

// ==========================================
// CREATE COMPLAINT - CITIZEN
// ==========================================

export const createComplaint = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { complaintType, location, latitude, longitude, description } =
      req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Please log in again.",
      });
    }

    // Verify the logged-in user exists.
    const citizen = await User.findById(userId).select(
      "_id name email contact"
    );

    if (!citizen) {
      return res.status(401).json({
        success: false,
        message: "User account not found. Please log in again.",
      });
    }

    if (!complaintType?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint type is required.",
      });
    }

    if (!location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    const parseCoordinate = (value) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }

      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    };

    const latitudeValue = parseCoordinate(latitude);
    const longitudeValue = parseCoordinate(longitude);

    if (
      (latitudeValue !== null &&
        (latitudeValue < -90 || latitudeValue > 90)) ||
      (longitudeValue !== null &&
        (longitudeValue < -180 || longitudeValue > 180))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude.",
      });
    }

    let photoData = { url: null, publicId: null };

    if (req.file) {
      photoData.url = `/uploads/complaints/${req.file.filename}`;
    }

    const complaint = await Complaint.create({
      user: citizen._id,
      complaintType: complaintType.trim(),
      location: location.trim(),
      latitude: latitudeValue,
      longitude: longitudeValue,
      description: description.trim(),
      photo: photoData,
      status: "Pending",
    });

    const populatedComplaint = await populateComplaint(
      Complaint.findById(complaint._id)
    );

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit complaint.",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY COMPLAINTS - CITIZEN
// ==========================================

export const getMyComplaints = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Please log in again.",
      });
    }

    const complaints = await populateComplaint(
      Complaint.find({ user: userId })
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your complaints.",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE COMPLAINT - CITIZEN
// ==========================================

export const getComplaintById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const complaintId = req.params.id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Please log in again.",
      });
    }

    if (!mongoose.isValidObjectId(complaintId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await populateComplaint(
      Complaint.findOne({
        _id: complaintId,
        user: userId,
      })
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get complaint by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint.",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL COMPLAINTS - ADMIN
// ==========================================

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await populateComplaint(
      Complaint.find()
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all complaints.",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE COMPLAINT - ADMIN
// ==========================================

export const getAdminComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await populateComplaint(
      Complaint.findById(id)
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get admin complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint details.",
      error: error.message,
    });
  }
};

// ==========================================
// GET STAFF AVAILABLE FOR A COMPLAINT
// ==========================================

export const getStaffForComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const filter = { status: "Active" };

    if (
      complaint.department &&
      complaint.department !== "General Administration"
    ) {
      filter.department = complaint.department;
    }

    const staff = await Staff.find(filter)
      .select(
        "staffId name email phone department role experience status photo"
      )
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error("Get staff for complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch available staff.",
      error: error.message,
    });
  }
};

// ==========================================
// ASSIGN STAFF - ADMIN
// ==========================================

export const assignStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    if (
      !mongoose.isValidObjectId(id) ||
      !mongoose.isValidObjectId(staffId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID or staff ID.",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    if (staff.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign an inactive staff member.",
      });
    }

    if (
      complaint.department &&
      complaint.department !== "General Administration" &&
      staff.department !== complaint.department
    ) {
      return res.status(400).json({
        success: false,
        message: `Staff must belong to ${complaint.department}.`,
      });
    }

    complaint.assignedStaff = staff._id;

    if (complaint.status === "Pending") {
      complaint.status = "In Progress";
    }

    await complaint.save();

    const updatedComplaint = await populateComplaint(
      Complaint.findById(complaint._id)
    );

    return res.status(200).json({
      success: true,
      message: "Staff assigned successfully.",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Assign staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign staff.",
      error: error.message,
    });
  }
};

// ==========================================
// REMOVE ASSIGNED STAFF - ADMIN
// ==========================================

export const removeStaff = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.assignedStaff = null;

    if (complaint.status === "In Progress") {
      complaint.status = "Pending";
    }

    await complaint.save();

    const updatedComplaint = await populateComplaint(
      Complaint.findById(complaint._id)
    );

    return res.status(200).json({
      success: true,
      message: "Staff removed successfully.",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Remove staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove staff.",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE COMPLAINT STATUS - ADMIN
// ==========================================

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

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

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const updatedComplaint = await populateComplaint(
      Complaint.findById(complaint._id)
    );

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update complaint status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status.",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE COMPLAINT - ADMIN
// ==========================================

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully.",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete complaint.",
      error: error.message,
    });
  }
};
