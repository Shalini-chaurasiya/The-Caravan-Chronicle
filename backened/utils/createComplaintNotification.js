import Notification from "../models/Notification.js";

const getComplaintReference = (complaint) =>
  `CMP-${String(complaint._id).slice(-6).toUpperCase()}`;

const getComplaintDetail = (complaint) =>
  `${getComplaintReference(complaint)} · ${complaint.complaintType}`;

export const createComplaintNotification = async (complaint) => {
  await Notification.findOneAndUpdate(
    { eventKey: `complaint:${complaint._id}:created` },
    {
      $setOnInsert: {
        type: "new_complaint",
        complaint: complaint._id,
        title: "New complaint submitted",
        detail: getComplaintDetail(complaint),
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

export const createComplaintStatusNotification = async (
  complaint,
  status
) => {
  const title =
    status === "Resolved"
      ? "Complaint resolved"
      : status === "Rejected"
        ? "Complaint rejected"
        : "Complaint status updated";

  await Notification.findOneAndUpdate(
    {
      eventKey: `complaint:${complaint._id}:status:${status}:${complaint.updatedAt.getTime()}`,
    },
    {
      $setOnInsert: {
        type: "status_update",
        complaint: complaint._id,
        title,
        detail: `${getComplaintDetail(complaint)} · ${status}`,
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

export const createComplaintAdminActionNotification = async (
  complaint,
  action,
  detail = ""
) => {
  await Notification.findOneAndUpdate(
    {
      eventKey: `complaint:${complaint._id}:${action}:${complaint.updatedAt.getTime()}`,
    },
    {
      $setOnInsert: {
        type: "status_update",
        complaint: complaint._id,
        title: action,
        detail: [getComplaintDetail(complaint), detail, complaint.status]
          .filter(Boolean)
          .join(" · "),
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
};
