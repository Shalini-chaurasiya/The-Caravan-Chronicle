import User from "../models/User.js";
import fs from "fs";


// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.userId)
            .select(
                "-password -resetPasswordToken -resetPasswordExpire"
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        res.status(200).json({

            success: true,

            user

        });


    } catch (error) {

        console.error(
            "Get Profile Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (req, res) => {

    try {

        const {
            name,
            email,
            address,
            gender,
            contact,
            dob
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !email) {

            return res.status(400).json({

                success: false,

                message:
                    "Name and email are required"

            });

        }


        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const existingUser =
            await User.findOne({

                email: email.toLowerCase(),

                _id: {
                    $ne: req.user.userId
                }

            });


        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is already registered"

            });

        }


        // ==========================================
        // FIND LOGGED-IN USER
        // ==========================================

        const user =
            await User.findById(req.user.userId);


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // ==========================================
        // UPDATE PROFILE DATA
        // ==========================================

        user.name = name;

        user.email = email.toLowerCase();

        user.address = address || "";

        user.gender = gender || "";

        user.contact = contact || "";

        user.dob = dob || null;


        // ==========================================
        // UPDATE PROFILE IMAGE
        // ==========================================

        if (req.file) {

            // Delete previous image

            if (user.profileImage) {

                const oldImagePath =
                    user.profileImage.startsWith("/")
                        ? user.profileImage.substring(1)
                        : user.profileImage;


                if (fs.existsSync(oldImagePath)) {

                    fs.unlinkSync(oldImagePath);

                }

            }


            // Save new image path

            user.profileImage =
                `/uploads/profile/${req.file.filename}`;

        }


        // ==========================================
        // SAVE USER
        // ==========================================

        await user.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                address: user.address,

                gender: user.gender,

                contact: user.contact,

                dob: user.dob,

                profileImage:
                    user.profileImage

            }

        });


    } catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};