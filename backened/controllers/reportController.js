import Complaint from "../models/Complaint.js";
import Staff from "../models/Staff.js";
import SLASettings from "../models/SLASettings.js";

// ======================================================
// GET REPORTS & ANALYTICS
// GET /api/reports/analytics
// ======================================================

export const getReportsAnalytics = async (req, res) => {
  try {
    const {
      from,
      to,
      department,
      status,
      priority,
      assignedStaff,
      type,
    } = req.query;

    // ==================================================
    // BUILD FILTER
    // ==================================================

    const filter = {};

    // ----------------------------------------------
    // DATE FILTER
    // ----------------------------------------------

    if (from || to) {
      filter.createdAt = {};

      if (from) {
        const startDate = new Date(from);
        startDate.setHours(0, 0, 0, 0);

        filter.createdAt.$gte = startDate;
      }

      if (to) {
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = endDate;
      }
    }

    // ----------------------------------------------
    // DEPARTMENT
    // ----------------------------------------------

    if (department && department !== "All") {
      filter.department = department;
    }

    // ----------------------------------------------
    // STATUS
    // ----------------------------------------------

    if (status && status !== "All") {
      filter.status = status;
    }

    // ----------------------------------------------
    // PRIORITY
    // ----------------------------------------------

    if (priority && priority !== "All") {
      filter.priority = priority;
    }

    // ----------------------------------------------
    // ASSIGNED STAFF
    // ----------------------------------------------

    if (assignedStaff && assignedStaff !== "All") {
      filter.assignedStaff = assignedStaff;
    }

    // ----------------------------------------------
    // COMPLAINT TYPE
    // ----------------------------------------------

    if (type && type !== "All") {
      filter.type = type;
    }

    // ==================================================
    // FETCH COMPLAINTS
    // ==================================================

    const complaints = await Complaint.find(filter)
      .populate(
        "user",
        "name email"
      )
      .populate(
        "assignedStaff",
        "name email department role"
      )
      .sort({
        createdAt: -1,
      });

    // ==================================================
    // BASIC COUNTS
    // ==================================================

    const total = complaints.length;

    const pending = complaints.filter(
      (complaint) =>
        complaint.status === "Pending"
    ).length;

    const inProgress = complaints.filter(
      (complaint) =>
        complaint.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
      (complaint) =>
        complaint.status === "Resolved"
    ).length;

    const rejected = complaints.filter(
      (complaint) =>
        complaint.status === "Rejected"
    ).length;

    const unassigned = complaints.filter(
      (complaint) =>
        !complaint.assignedStaff
    ).length;

    // ==================================================
    // RESOLUTION RATE
    // ==================================================

    const resolutionRate =
      total > 0
        ? Number(
            (
              (resolved / total) *
              100
            ).toFixed(2)
          )
        : 0;

    // ==================================================
    // AVERAGE RESOLUTION TIME
    // ==================================================

    let totalResolutionHours = 0;
    let resolvedComplaints = 0;

    complaints.forEach((complaint) => {
      if (
        complaint.status === "Resolved" &&
        complaint.createdAt
      ) {
        const createdTime =
          new Date(
            complaint.createdAt
          ).getTime();

        const resolvedTime =
          new Date(
            complaint.updatedAt
          ).getTime();

        const difference =
          resolvedTime -
          createdTime;

        if (difference >= 0) {
          totalResolutionHours +=
            difference /
            (1000 * 60 * 60);

          resolvedComplaints++;
        }
      }
    });

    const averageResolutionTime =
      resolvedComplaints > 0
        ? Number(
            (
              totalResolutionHours /
              resolvedComplaints
            ).toFixed(2)
          )
        : 0;

    // ==================================================
    // COMPLAINTS BY STATUS
    // ==================================================

    const statusMap = {};

    complaints.forEach(
      (complaint) => {
        const complaintStatus =
          complaint.status ||
          "Unknown";

        statusMap[
          complaintStatus
        ] =
          (statusMap[
            complaintStatus
          ] || 0) + 1;
      }
    );

    const complaintsByStatus =
      Object.entries(
        statusMap
      ).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

    // ==================================================
    // COMPLAINTS BY DEPARTMENT
    // ==================================================

    const departmentMap = {};

    complaints.forEach(
      (complaint) => {
        const complaintDepartment =
          complaint.department ||
          complaint.assignedStaff
            ?.department ||
          "Unassigned";

        departmentMap[
          complaintDepartment
        ] =
          (departmentMap[
            complaintDepartment
          ] || 0) + 1;
      }
    );

    const complaintsByDepartment =
      Object.entries(
        departmentMap
      ).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

    // ==================================================
    // COMPLAINTS BY TYPE / CATEGORY
    // ==================================================

    const typeMap = {};

    complaints.forEach(
      (complaint) => {
        const complaintType =
          complaint.type ||
          "Other";

        typeMap[
          complaintType
        ] =
          (typeMap[
            complaintType
          ] || 0) + 1;
      }
    );

    const complaintsByType =
      Object.entries(
        typeMap
      )
        .map(
          ([name, value]) => ({
            name,
            value,
          })
        )
        .sort(
          (a, b) =>
            b.value - a.value
        );

    // ==================================================
    // COMPLAINTS BY PRIORITY
    // ==================================================

    const priorityMap = {};

    complaints.forEach(
      (complaint) => {
        const complaintPriority =
          complaint.priority ||
          "Unknown";

        priorityMap[
          complaintPriority
        ] =
          (priorityMap[
            complaintPriority
          ] || 0) + 1;
      }
    );

    const complaintsByPriority =
      Object.entries(
        priorityMap
      ).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

    // ==================================================
    // MONTHLY / WEEKLY TREND
    // ==================================================

    const monthlyMap = {};

    complaints.forEach(
      (complaint) => {
        if (!complaint.createdAt) {
          return;
        }

        const date =
          new Date(
            complaint.createdAt
          );

        const month =
          date.toLocaleString(
            "en-US",
            {
              month: "short",
              year: "numeric",
            }
          );

        monthlyMap[month] =
          (monthlyMap[month] ||
            0) + 1;
      }
    );

    const complaintsOverTime =
      Object.entries(
        monthlyMap
      ).map(
        ([month, count]) => ({
          month,
          count,
        })
      );

    // ==================================================
    // STAFF PERFORMANCE
    // ==================================================

    const staffMap = {};

    complaints.forEach(
      (complaint) => {
        if (
          !complaint.assignedStaff
        ) {
          return;
        }

        const staff =
          complaint.assignedStaff;

        const staffId =
          staff._id.toString();

        if (!staffMap[staffId]) {
          staffMap[staffId] = {
            staffId,
            name:
              staff.name ||
              "Unknown Staff",
            department:
              staff.department ||
              "Unknown",
            assigned: 0,
            resolved: 0,
            inProgress: 0,
            pending: 0,
          };
        }

        staffMap[
          staffId
        ].assigned++;

        if (
          complaint.status ===
          "Resolved"
        ) {
          staffMap[
            staffId
          ].resolved++;
        }

        if (
          complaint.status ===
          "In Progress"
        ) {
          staffMap[
            staffId
          ].inProgress++;
        }

        if (
          complaint.status ===
          "Pending"
        ) {
          staffMap[
            staffId
          ].pending++;
        }
      }
    );

    const staffPerformance =
      Object.values(
        staffMap
      ).map((staff) => ({
        ...staff,

        resolutionRate:
          staff.assigned > 0
            ? Number(
                (
                  (staff.resolved /
                    staff.assigned) *
                  100
                ).toFixed(2)
              )
            : 0,
      }));

    // ==================================================
    // SLA ANALYTICS
    // ==================================================

    const slaSettings =
      await SLASettings.find();

    let slaEligible = 0;
    let slaCompliant = 0;
    let slaBreached = 0;

    for (const complaint of complaints) {
      if (!complaint.createdAt) {
        continue;
      }

      const complaintDepartment =
        complaint.department ||
        complaint.assignedStaff
          ?.department;

      if (!complaintDepartment) {
        continue;
      }

      const sla =
        slaSettings.find(
          (setting) =>
            setting.department
              .toLowerCase() ===
            complaintDepartment.toLowerCase()
        );

      if (!sla) {
        continue;
      }

      const createdTime =
        new Date(
          complaint.createdAt
        ).getTime();

      let endTime;

      if (
        complaint.status ===
          "Resolved" ||
        complaint.status ===
          "Rejected"
      ) {
        endTime =
          new Date(
            complaint.updatedAt
          ).getTime();
      } else {
        endTime = Date.now();
      }

      const hours =
        (endTime -
          createdTime) /
        (1000 * 60 * 60);

      slaEligible++;

      if (
        hours <=
        sla.defaultSLAHours
      ) {
        slaCompliant++;
      } else {
        slaBreached++;
      }
    }

    const slaCompliance =
      slaEligible > 0
        ? Number(
            (
              (slaCompliant /
                slaEligible) *
              100
            ).toFixed(2)
          )
        : 0;

    // ==================================================
    // RETURN RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,

      summary: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
        unassigned,
        resolutionRate,
        averageResolutionTime,
        slaCompliance,
        slaCompliant,
        slaBreached,
      },

      complaintsOverTime,

      complaintsByStatus,

      complaintsByDepartment,

      complaintsByType,

      complaintsByPriority,

      staffPerformance,
    });
  } catch (error) {
    console.error(
      "Reports analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate reports and analytics",
      error: error.message,
    });
  }
};