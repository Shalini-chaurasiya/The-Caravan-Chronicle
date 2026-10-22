
import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import Staff from "../models/Staff.js";

// ==========================================
// HELPER: DETERMINE DEPARTMENT FROM TYPE
// Used only to filter suitable staff.
// Department is not saved in Complaint.
// ==========================================

const getDepartmentFromType = (complaintType = "") => {
  const type = complaintType.trim().toLowerCase();

  if (/water|supply|leakage|pipeline/.test(type)) {
    return "Water Supply";
  }

  if (/road|pothole|footpath/.test(type)) {
    return "Roads & Infrastructure";
  }

  if (/electric|street light|lighting|lamp/.test(type)) {
    return "Electrical & Street Lighting";
  }

  if (/drain|sewer/.test(type)) {
    return "Drainage & Sewerage";
  }

  if (/sanitation|garbage|waste|cleanliness/.test(type)) {
    return "Sanitation";
  }

  if (/park|garden|horticulture/.test(type)) {
    return "Parks & Horticulture";
  }

  if (/traffic|signal/.test(type)) {
    return "Traffic Management";
  }

  if (/building|construction/.test(type)) {
    return "Building & Construction";
  }

  return "General Administration";
};

// ==========================================
// HELPER: VALIDATE MONGODB ID
// ==========================================

const isValidId = (id) => mongoose.isValidObjectId(id);

// ==========================================
// HELPER: POPULATE COMPLAINT
// ==========================================

const populateComplaint = (query) =>
  query
    .populate({
      path: "user",
      select: "name email contact address profileImage",
    })
    .populate({
      path: "assignedStaff",
      select:
        "staffId name email phone department role experience status photo",
    });

// ==========================================
// GET ALL COMPLAINTS
// ==========================================

const getAllComplaints = async (req, res) => {
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
      message: "Server error while fetching complaints.",
    });
  }
};

// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
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
    console.error("Get complaint by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaint.",
    });
  }
};

// ==========================================
// GET STAFF AVAILABLE FOR A COMPLAINT
// ==========================================

const getStaffForComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
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

    const department = getDepartmentFromType(
      complaint.complaintType
    );

    const filter = { status: "Active" };

    // Filter by department when the complaint type matches
    // a specific department.
    if (department !== "General Administration") {
      filter.department = department;
    }

    const staff = await Staff.find(filter)
      .select(
        "staffId name email phone department role experience photo status"
      )
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      department,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error("Get staff for complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching staff.",
    });
  }
};

// ==========================================
// ASSIGN STAFF TO COMPLAINT
// ==========================================

const assignStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    if (!isValidId(id) || !isValidId(staffId)) {
      return res.status(400).json({
        success: false,
        message: "Valid complaint ID and staff ID are required.",
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
        message: "Inactive staff cannot be assigned.",
      });
    }

    const department = getDepartmentFromType(
      complaint.complaintType
    );

    // Check department only when the complaint type maps
    // to a specific department.
    if (
      department !== "General Administration" &&
      staff.department !== department
    ) {
      return res.status(400).json({
        success: false,
        message: `Please assign staff from ${department}.`,
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
      message: "Server error while assigning staff.",
    });
  }
};

// ==========================================
// REMOVE ASSIGNED STAFF
// ==========================================

const removeStaff = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
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
      message: "Assigned staff removed successfully.",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Remove staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while removing staff.",
    });
  }
};

// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!isValidId(id)) {
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

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.status = status;
    await complaint.save();

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
      message: "Server error while updating complaint status.",
    });
  }
};

// ==========================================
// DELETE COMPLAINT
// ==========================================

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
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
      message: "Server error while deleting complaint.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLER FUNCTIONS
// ==========================================

export {
  getAllComplaints,
  getComplaintById,
  getStaffForComplaint,
  assignStaff,
  removeStaff,
  updateComplaintStatus,
  deleteComplaint,
};
