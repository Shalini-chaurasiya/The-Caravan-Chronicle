
import mongoose from "mongoose";
import Department from "../models/Department.js";
import Staff from "../models/Staff.js";
import Complaint from "../models/Complaint.js";

// ======================================================
// HELPER: GET STAFF AND COMPLAINT STATISTICS
// ======================================================

const getDepartmentStats = async (departmentName) => {
  const staff = await Staff.find({
    department: departmentName,
  }).select(
    "staffId name email phone role status address"
  );

  const staffIds = staff.map((member) => member._id);

  const activeStaff = staff.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveStaff = staff.filter(
    (member) => member.status === "Inactive"
  ).length;

  let complaints = 0;
  let resolvedComplaints = 0;

  if (staffIds.length > 0) {
    // Assumes assignedStaff stores a Staff ObjectId.
    complaints = await Complaint.countDocuments({
      assignedStaff: { $in: staffIds },
    });

    resolvedComplaints = await Complaint.countDocuments({
      assignedStaff: { $in: staffIds },
      status: "Resolved",
    });
  }

  return {
    totalStaff: staff.length,
    activeStaff,
    inactiveStaff,
    complaints,
    resolvedComplaints,
    staff,
  };
};

// ======================================================
// GET ALL DEPARTMENTS
// GET /api/departments
// ======================================================

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({
      name: 1,
    });

    const departmentsWithStats = await Promise.all(
      departments.map(async (department) => {
        const stats = await getDepartmentStats(
          department.name
        );

        return {
          ...department.toObject(),
          totalStaff: stats.totalStaff,
          activeStaff: stats.activeStaff,
          inactiveStaff: stats.inactiveStaff,
          complaints: stats.complaints,
          resolvedComplaints: stats.resolvedComplaints,
        };
      })
    );

    res.status(200).json(departmentsWithStats);
  } catch (error) {
    console.error("Get departments error:", error);

    res.status(500).json({
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE DEPARTMENT
// GET /api/departments/:id
// ======================================================

export const getDepartmentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    const department = await Department.findById(
      req.params.id
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const stats = await getDepartmentStats(
      department.name
    );

    res.status(200).json({
      ...department.toObject(),
      totalStaff: stats.totalStaff,
      activeStaff: stats.activeStaff,
      inactiveStaff: stats.inactiveStaff,
      complaints: stats.complaints,
      resolvedComplaints: stats.resolvedComplaints,
      staff: stats.staff,
    });
  } catch (error) {
    console.error("Get department error:", error);

    res.status(500).json({
      message: "Failed to fetch department",
      error: error.message,
    });
  }
};

// ======================================================
// ADD DEPARTMENT
// POST /api/departments
// ======================================================

export const createDepartment = async (req, res) => {
  try {
    const { name, description, icon, status } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          "Department name and description are required",
      });
    }

    const trimmedName = name.trim();

    const existingDepartment = await Department.findOne({
      name: {
        $regex: `^${trimmedName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}$`,
        $options: "i",
      },
    });

    if (existingDepartment) {
      return res.status(409).json({
        message: "Department with this name already exists",
      });
    }

    if (
      status !== undefined &&
      !["Active", "Inactive"].includes(status)
    ) {
      return res.status(400).json({
        message: "Status must be Active or Inactive",
      });
    }

    const department = await Department.create({
      name: trimmedName,
      description: description.trim(),
      icon: icon || "🏢",
      status: status || "Active",
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("Create department error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Department with this name already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create department",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE DEPARTMENT
// PUT /api/departments/:id
// ======================================================

export const updateDepartment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    const {
      name,
      description,
      icon,
      status,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          "Department name and description are required",
      });
    }

    if (
      status !== undefined &&
      !["Active", "Inactive"].includes(status)
    ) {
      return res.status(400).json({
        message: "Status must be Active or Inactive",
      });
    }

    const department = await Department.findById(
      req.params.id
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const newName = name.trim();

    const duplicate = await Department.findOne({
      name: {
        $regex: `^${newName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}$`,
        $options: "i",
      },
      _id: { $ne: department._id },
    });

    if (duplicate) {
      return res.status(409).json({
        message:
          "Another department with this name already exists",
      });
    }

    const oldName = department.name;

    department.name = newName;
    department.description = description.trim();
    department.icon = icon || "🏢";

    if (status !== undefined) {
      department.status = status;
    }

    await department.save();

    // Keep existing staff linked to the renamed department.
    if (oldName !== newName) {
      await Staff.updateMany(
        { department: oldName },
        { $set: { department: newName } }
      );
    }

    res.status(200).json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("Update department error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Department with this name already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update department",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE DEPARTMENT
// DELETE /api/departments/:id
// ======================================================

export const deleteDepartment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    const department = await Department.findById(
      req.params.id
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const staffCount = await Staff.countDocuments({
      department: department.name,
    });

    if (staffCount > 0) {
      return res.status(400).json({
        message: `Cannot delete department because ${staffCount} staff member(s) are assigned to it.`,
      });
    }

    await Department.findByIdAndDelete(department._id);

    res.status(200).json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete department error:", error);

    res.status(500).json({
      message: "Failed to delete department",
      error: error.message,
    });
  }
};

// ======================================================
// GET STAFF OF DEPARTMENT
// GET /api/departments/:id/staff
// ======================================================

export const getDepartmentStaff = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    const department = await Department.findById(
      req.params.id
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const stats = await getDepartmentStats(
      department.name
    );

    res.status(200).json({
      department: department.name,
      count: stats.staff.length,
      staff: stats.staff,
      totalStaff: stats.totalStaff,
      activeStaff: stats.activeStaff,
      inactiveStaff: stats.inactiveStaff,
      complaints: stats.complaints,
      resolvedComplaints: stats.resolvedComplaints,
    });
  } catch (error) {
    console.error("Get department staff error:", error);

    res.status(500).json({
      message: "Failed to fetch department staff",
      error: error.message,
    });
  }
};
