import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import SLASettings from "../models/SLASettings.js";
import getDepartmentFromComplaintType from "../utils/getDepartmentFromComplaintType.js";

const syncOverdueNotifications = async () => {
  const [complaints, settings] = await Promise.all([
    Complaint.find({ status: { $in: ["Pending", "In Progress"] } }).select(
      "_id complaintType createdAt"
    ),
    SLASettings.find({
      status: "Active",
      systemNotifications: true,
    }).select("department defaultSLAHours"),
  ]);

  const settingsByDepartment = new Map(
    settings.map((setting) => [setting.department, setting])
  );
  const now = Date.now();

  const operations = complaints.flatMap((complaint) => {
    const department = getDepartmentFromComplaintType(complaint.complaintType);
    const setting = settingsByDepartment.get(department);
    const slaDurationMs = setting?.defaultSLAHours * 60 * 60 * 1000;

    if (!setting || now - complaint.createdAt.getTime() < slaDurationMs) {
      return [];
    }

    const reference = `CMP-${String(complaint._id).slice(-6).toUpperCase()}`;

    return [
      {
        updateOne: {
          filter: { eventKey: `complaint:${complaint._id}:sla-exceeded` },
          update: {
            $setOnInsert: {
              type: "sla_exceeded",
              complaint: complaint._id,
              title: "Complaint exceeded SLA",
              detail: `${reference} · ${complaint.complaintType}`,
            },
          },
          upsert: true,
        },
      },
    ];
  });

  if (operations.length > 0) {
    await Notification.bulkWrite(operations, { ordered: false });
  }
};

export const getNotifications = async (req, res) => {
  try {
    await syncOverdueNotifications();

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ isRead: false, staff: { $exists: false } })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("type complaint title detail isRead createdAt")
        .lean(),
      Notification.countDocuments({
        isRead: false,
        staff: { $exists: false },
      }),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications.",
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, staff: { $exists: false } },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while marking the notification as read.",
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { isRead: false, staff: { $exists: false } },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while marking notifications as read.",
    });
  }
};
