
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // REGISTERED CITIZEN
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // COMPLAINT TYPE
    complaintType: {
      type: String,
      required: true,
      trim: true,
    },

    // LOCATION
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // LIVE LOCATION COORDINATES
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    // COMPLAINT DESCRIPTION
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // COMPLAINT IMAGE
    photo: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    // ASSIGNED STAFF
    // Department will be read from this staff member's Staff document.
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },

    // COMPLAINT STATUS
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
