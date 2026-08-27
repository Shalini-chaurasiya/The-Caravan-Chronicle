import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Register Citizen
export const registerCitizen = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create citizen
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "citizen"
    });

    res.status(201).json({
      message: "Citizen registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Login Citizen
export const loginCitizen = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide email"
            });
        }

        const user = await User.findOne({ email });

        // Don't reveal whether email exists
        if (!user) {
            return res.status(200).json({
                message: "If the email exists, a reset link has been sent"
            });
        }

        // Generate random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing in DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;

        // Token valid for 15 minutes
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Reset link
        const resetLink =
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Reset Your Password",
            html: `
                <h2>Password Reset</h2>

                <p>Hello ${user.name},</p>

                <p>
                    You requested to reset your password.
                </p>

                <p>
                    Click the button below to reset your password.
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display:inline-block;
                        padding:10px 20px;
                        background:#007bff;
                        color:white;
                        text-decoration:none;
                        border-radius:5px;
                    "
                >
                    Reset Password
                </a>

                <p>This link will expire in 15 minutes.</p>

                <p>If you did not request this, please ignore this email.</p>
            `
        });

        res.status(200).json({
            message: "If the email exists, a reset link has been sent"
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Please provide new password"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Hash token received from URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        // Remove reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};