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


      // ==========================================
      // Save local image path
      // ==========================================
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

      complaintType: complaintType.trim(),

      location: location.trim(),

      latitude: latitudeValue,

      longitude: longitudeValue,

      description: description.trim(),

      photo: photoData,

      status: "Pending",

    });


    // ==========================================
    // Success
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
      "Photo URL:",
      photoData.url
    );

    console.log("==========================================");
    console.log("");


    return res.status(201).json({

      success: true,

      message: "Complaint submitted successfully",

      complaint,

    });

  } catch (error) {

    // ==========================================
    // Error
    // ==========================================
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

      message: "Failed to submit complaint",

      error: error?.message || "Unknown server error",

    });

  }

};