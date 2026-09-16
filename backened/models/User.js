import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["citizen", "staff", "admin"],
            default: "citizen"
        },

        // ==========================================
        // PROFILE INFORMATION
        // ==========================================

        address: {
            type: String,
            default: ""
        },

        gender: {
            type: String,
            enum: ["Female", "Male", "Other", ""],
            default: ""
        },

        contact: {
            type: String,
            default: ""
        },

        dob: {
            type: Date,
            default: null
        },

        profileImage: {
            type: String,
            default: ""
        },

        // ==========================================
        // PASSWORD RESET
        // ==========================================

        resetPasswordToken: {
            type: String,
            default: null
        },

        resetPasswordExpire: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);

export default User;