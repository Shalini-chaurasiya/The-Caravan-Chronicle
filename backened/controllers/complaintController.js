import Complaint from "../models/Complaint.js";


// ==========================================
// CREATE COMPLAINT
// ==========================================

export const createComplaint = async (req, res) => {
  try {
    console.log("");
    console.log("==========================================");
    console.log("       CREATE COMPLAINT REQUEST");
    console.log("==========================================");

    // ==========================================
    // Logged-in user
    // ==========================================

    console.log("Logged-in User:", req.user);

    // ==========================================
    // Get data from request
    // ==========================================

    const {
      complaintType,
      location,
      latitude,
      longitude,
      description,
    } = req.body;

    console.log("Complaint Type:", complaintType);
    console.log("Location:", location);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Description:", description);

    // ==========================================
    // Validate complaint type
    // ==========================================

    if (!complaintType || !complaintType.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint type is required",
      });
    }

    // ==========================================
    // Validate location
    // ==========================================

    if (!location || !location.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    // ==========================================
    // Validate description
    // ==========================================

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // ==========================================
    // Get user ID from JWT
    // ==========================================

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User information not found. Please login again.",
      });
    }

    console.log("Complaint User ID:", userId);

    // ==========================================
    // Default photo data
    // ==========================================

    let photoData = {
      url: null,
      publicId: null,
    };

    // ==========================================
    // Check uploaded image
    // ==========================================

    if (req.file) {
      console.log("");
      console.log("========== FILE RECEIVED ==========");

      console.log(
        "Original name:",
        req.file.originalname
      );

      console.log(
        "MIME type:",
        req.file.mimetype
      );

      console.log(
        "File size:",
        req.file.size
      );

      console.log(
        "Saved filename:",
        req.file.filename
      );

      console.log(
        "Saved path:",
        req.file.path
      );

      console.log("===================================");
      console.log("");

      photoData = {
        url: `/uploads/complaints/${req.file.filename}`,
        publicId: null,
      };
    } else {
      console.log("No photo uploaded.");
    }

    // ==========================================
    // Convert latitude
    // ==========================================

    let latitudeValue = null;

    if (
      latitude !== undefined &&
      latitude !== null &&
      latitude !== ""
    ) {
      latitudeValue = Number(latitude);

      if (Number.isNaN(latitudeValue)) {
        latitudeValue = null;
      }
    }

    // ==========================================
    // Convert longitude
    // ==========================================

    let longitudeValue = null;

    if (
      longitude !== undefined &&
      longitude !== null &&
      longitude !== ""
    ) {
      longitudeValue = Number(longitude);

      if (Number.isNaN(longitudeValue)) {
        longitudeValue = null;
      }
    }

    // ==========================================
    // Create complaint
    // ==========================================

    const complaint = await Complaint.create({
      // Connect complaint with logged-in user
      user: userId,

      complaintType: complaintType.trim(),

      location: location.trim(),

      latitude: latitudeValue,

      longitude: longitudeValue,

      description: description.trim(),

      photo: photoData,

      status: "Pending",
    });

    // ==========================================
    // Success logs
    // ==========================================

    console.log("");
    console.log("==========================================");
    console.log("       COMPLAINT CREATED SUCCESSFULLY");
    console.log("==========================================");

    console.log(
      "Complaint ID:",
      complaint._id
    );

    console.log(
      "User ID:",
      complaint.user
    );

    console.log(
      "Photo URL:",
      photoData.url
    );

    console.log("==========================================");
    console.log("");

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,

      message:
        "Complaint submitted successfully",

      complaint,
    });
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("       CREATE COMPLAINT ERROR");
    console.error("==========================================");

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Full Error:",
      error
    );

    console.error("==========================================");
    console.error("");

    return res.status(500).json({
      success: false,

      message:
        "Failed to submit complaint",

      error:
        error?.message ||
        "Unknown server error",
    });
  }
};


// ==========================================
// GET MY COMPLAINTS
// ==========================================

export const getMyComplaints = async (
  req,
  res
) => {
  try {
    console.log("");
    console.log("==========================================");
    console.log("       GET MY COMPLAINTS");
    console.log("==========================================");

    // ==========================================
    // Get logged-in user's ID
    // ==========================================

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message:
          "User information not found. Please login again.",
      });
    }

    console.log("User ID:", userId);

    // ==========================================
    // Find complaints belonging to user
    // ==========================================

    const complaints =
      await Complaint.find({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    console.log(
      "Number of complaints:",
      complaints.length
    );

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,

      count: complaints.length,

      complaints,
    });
  } catch (error) {
    console.error(
      "Get My Complaints Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch complaints",

      error:
        error?.message ||
        "Unknown server error",
    });
  }
};


// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

export const getComplaintById = async (
  req,
  res
) => {
  try {
    console.log("");
    console.log("==========================================");
    console.log("       GET COMPLAINT DETAILS");
    console.log("==========================================");

    // ==========================================
    // Get logged-in user's ID
    // ==========================================

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message:
          "User information not found. Please login again.",
      });
    }

    console.log("User ID:", userId);

    console.log(
      "Complaint ID:",
      req.params.id
    );

    // ==========================================
    // Find complaint
    //
    // IMPORTANT:
    // user: userId ensures that a citizen
    // can only see their own complaint.
    //
    // populate("user") gets actual user
    // information from User collection.
    // ==========================================

    const complaint =
      await Complaint.findOne({
        _id: req.params.id,

        user: userId,
      }).populate(
        "user",
        "name email contact address profileImage"
      );

    // ==========================================
    // Complaint not found
    // ==========================================

    if (!complaint) {
      return res.status(404).json({
        success: false,

        message:
          "Complaint not found",
      });
    }

    console.log(
      "Complaint found:",
      complaint._id
    );

    console.log(
      "Complaint user:",
      complaint.user
    );

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,

      complaint,
    });
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("       GET COMPLAINT DETAILS ERROR");
    console.error("==========================================");

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Full Error:",
      error
    );

    console.error("==========================================");
    console.error("");

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch complaint",

      error:
        error?.message ||
        "Unknown server error",
    });
  }
};