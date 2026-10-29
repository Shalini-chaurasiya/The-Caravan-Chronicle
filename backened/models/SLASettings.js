import mongoose from "mongoose";

const escalationLevelSchema =
  new mongoose.Schema(
    {
      level: {
        type: Number,
        required: true,
      },

      afterHours: {
        type: Number,
        required: true,
        min: 0,
      },

      escalateTo: {
        type: String,
        required: true,
        enum: [
          "Department Head",
          "Senior Staff",
          "Admin",
        ],
      },

      notifyEmail: {
        type: Boolean,
        default: true,
      },

      notifySystem: {
        type: Boolean,
        default: true,
      },
    },
    {
      _id: false,
    }
  );

const slaSettingsSchema =
  new mongoose.Schema(
    {
      department: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      defaultSLAHours: {
        type: Number,
        required: true,
        min: 1,
        default: 24,
      },

      warningBeforeHours: {
        type: Number,
        required: true,
        min: 0,
        default: 2,
      },

      autoEscalation: {
        type: Boolean,
        default: true,
      },

      escalationLevels: {
        type: [escalationLevelSchema],
        default: [],
      },

      emailNotifications: {
        type: Boolean,
        default: true,
      },

      systemNotifications: {
        type: Boolean,
        default: true,
      },

      status: {
        type: String,
        enum: [
          "Active",
          "Inactive",
        ],
        default: "Active",
      },
    },
    {
      timestamps: true,
    }
  );

const SLASettings =
  mongoose.model(
    "SLASettings",
    slaSettingsSchema
  );

export default SLASettings;