
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    dob: {
      type: Date,
    },
    department: {
      type: String,
      required: true,
      enum: [
        "Roads & Infrastructure",
        "Electrical & Street Lighting",
        "Water Supply",
        "Sanitation",
        "Drainage & Sewerage",
        "Parks & Horticulture",
        "Traffic Management",
        "Building & Construction",
        "General Administration",
      ],
    },
    role: {
      type: String,
      enum: [
        "Staff",
        "Senior Staff",
        "Department Officer",
        "Supervisor",
      ],
      default: "Staff",
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
