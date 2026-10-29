import Admin from "../models/Admin.js";
import Complaint from "../models/Complaint.js";
import SLASettings from "../models/SLASettings.js";
import Staff from "../models/Staff.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    return res.status(200).json({
      success: true,
      message: "Dashboard loaded successfully",
      userId,
      role,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getChartRange = (period, now) => {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  if (period === "30days") {
    start.setUTCDate(start.getUTCDate() - 29);
    return { start, interval: "day" };
  }

  if (period === "year") {
    start.setUTCMonth(0, 1);
    return { start, interval: "month" };
  }

  start.setUTCDate(1);
  start.setUTCMonth(start.getUTCMonth() - 6);
  return { start, interval: "month" };
};

const getChartBuckets = (period, start, now) => {
  const buckets = [];
  const cursor = new Date(start);

  while (cursor <= now) {
    const key =
      period === "30days"
        ? cursor.toISOString().slice(0, 10)
        : cursor.toISOString().slice(0, 7);
    const label =
      period === "30days"
        ? cursor.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            timeZone: "UTC",
          })
        : cursor.toLocaleDateString("en-IN", {
            month: "short",
            timeZone: "UTC",
          });

    buckets.push({ key, label, total: 0, resolved: 0, new: 0 });

    if (period === "30days") {
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    } else {
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
  }

  return buckets;
};

export const getAdminDashboard = async (req, res) => {
  try {
    const period = ["7months", "30days", "year"].includes(req.query.period)
      ? req.query.period
      : "7months";
    const now = new Date();
    const { start, interval } = getChartRange(period, now);
    const dateFormat = interval === "day" ? "%Y-%m-%d" : "%Y-%m";

    const [admin, [counts = {}], recentComplaints, monthlyCounts, workload, openComplaints, slaSettings] =
      await Promise.all([
        Admin.findOne({
          email: req.admin.email.toLowerCase(),
          role: "admin",
        }).select("name email"),
        Complaint.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              unassigned: {
                $sum: {
                  $cond: [{ $eq: ["$assignedStaff", null] }, 1, 0],
                },
              },
              inProgress: {
                $sum: {
                  $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0],
                },
              },
              resolved: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0],
                },
              },
            },
          },
        ]),
        Complaint.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("complaintType location status assignedStaff createdAt")
          .populate({ path: "assignedStaff", select: "name" })
          .lean(),
        Complaint.aggregate([
          { $match: { createdAt: { $gte: start, $lte: now } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: dateFormat,
                  date: "$createdAt",
                  timezone: "UTC",
                },
              },
              total: { $sum: 1 },
              resolved: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0],
                },
              },
              new: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Pending"] }, 1, 0],
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Staff.aggregate([
          { $match: { status: "Active" } },
          {
            $lookup: {
              from: Complaint.collection.name,
              let: { staffId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$assignedStaff", "$$staffId"] },
                        { $in: ["$status", ["Pending", "In Progress"]] },
                      ],
                    },
                  },
                },
                { $count: "assigned" },
              ],
              as: "workload",
            },
          },
          {
            $addFields: {
              assigned: {
                $ifNull: [{ $arrayElemAt: ["$workload.assigned", 0] }, 0],
              },
            },
          },
          { $sort: { assigned: -1, name: 1 } },
          { $limit: 3 },
          { $project: { name: 1, department: 1, assigned: 1 } },
        ]),
        Complaint.find({
          status: { $in: ["Pending", "In Progress"] },
          assignedStaff: { $ne: null },
        })
          .select("createdAt assignedStaff")
          .populate({ path: "assignedStaff", select: "department" })
          .lean(),
        SLASettings.find({ status: "Active" })
          .select("department defaultSLAHours warningBeforeHours")
          .lean(),
      ]);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const slaByDepartment = new Map(
      slaSettings.map((setting) => [setting.department, setting])
    );
    const attention = { nearingSla: 0, exceededSla: 0 };

    for (const complaint of openComplaints) {
      const setting = slaByDepartment.get(complaint.assignedStaff?.department);

      if (!setting) continue;

      const deadline =
        new Date(complaint.createdAt).getTime() +
        setting.defaultSLAHours * 60 * 60 * 1000;
      const remainingHours = (deadline - now.getTime()) / (60 * 60 * 1000);

      if (remainingHours < 0) {
        attention.exceededSla += 1;
      } else if (remainingHours <= setting.warningBeforeHours) {
        attention.nearingSla += 1;
      }
    }

    const chart = getChartBuckets(period, start, now);
    const chartByKey = new Map(chart.map((bucket) => [bucket.key, bucket]));

    for (const item of monthlyCounts) {
      const bucket = chartByKey.get(item._id);
      if (bucket) {
        bucket.total = item.total;
        bucket.resolved = item.resolved;
        bucket.new = item.new;
      }
    }

    return res.status(200).json({
      success: true,
      dashboard: {
        admin: { name: admin.name, email: admin.email },
        stats: {
          total: counts.total || 0,
          unassigned: counts.unassigned || 0,
          inProgress: counts.inProgress || 0,
          resolved: counts.resolved || 0,
        },
        chart,
        recentComplaints,
        workload,
        attention,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
