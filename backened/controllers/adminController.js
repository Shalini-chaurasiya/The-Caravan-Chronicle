import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===============================
// ADMIN LOGIN
// ===============================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check whether email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check required environment variables
    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET
    ) {
      console.error("Admin environment variables are missing.");

      return res.status(500).json({
        success: false,
        message: "Admin configuration is missing on the server.",
      });
    }

    // Check admin email
    if (email.trim() !== process.env.ADMIN_EMAIL.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Compare entered password with bcrypt hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });

  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ===============================
// ADMIN DASHBOARD
// ===============================
const getAdminDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Welcome to Admin Dashboard",
      admin: req.admin,
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ===============================
// EXPORT
// ===============================
export {
  adminLogin,
  getAdminDashboard,
};