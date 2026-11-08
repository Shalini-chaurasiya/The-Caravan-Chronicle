
import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const resolutionOtpSchema = new mongoose.Schema(
  {
    codeHash: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    windowStartedAt: {
      type: Date,
      default: null,
    },
    sendCount: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

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
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    resolutionOtp: {
      type: resolutionOtpSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.pre("save", function recordStatusHistory() {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      note: "Complaint submitted",
      changedAt: this.createdAt || new Date(),
    });
  } else if (this.isModified("status")) {
    if (this.status !== "In Progress" && this.resolutionOtp) {
      this.resolutionOtp.codeHash = null;
      this.resolutionOtp.expiresAt = null;
    }

    this.statusHistory.push({
      status: this.status,
      note: `Status changed to ${this.status}`,
      changedAt: new Date(),
    });
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
