import SLASettings from "../models/SLASettings.js";

// ======================================================
// GET ALL SLA SETTINGS
// GET /api/sla
// ======================================================

export const getSLASettings = async (
  req,
  res
) => {
  try {
    const settings =
      await SLASettings.find().sort({
        department: 1,
      });

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Get SLA settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch SLA settings",
      error: error.message,
    });
  }
};

// ======================================================
// GET SLA SETTINGS BY DEPARTMENT
// GET /api/sla/:department
// ======================================================

export const getSLAByDepartment =
  async (req, res) => {
    try {
      const department =
        decodeURIComponent(
          req.params.department
        );

      const settings =
        await SLASettings.findOne({
          department: {
            $regex: `^${department}$`,
            $options: "i",
          },
        });

      if (!settings) {
        return res.status(404).json({
          success: false,
          message:
            "SLA settings not found for this department",
        });
      }

      res.status(200).json({
        success: true,
        settings,
      });
    } catch (error) {
      console.error(
        "Get department SLA error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch department SLA",
        error: error.message,
      });
    }
  };

// ======================================================
// CREATE SLA SETTINGS
// POST /api/sla
// ======================================================

export const createSLASettings =
  async (req, res) => {
    try {
      const {
        department,
        defaultSLAHours,
        warningBeforeHours,
        autoEscalation,
        escalationLevels,
        emailNotifications,
        systemNotifications,
        status,
      } = req.body;

      // ----------------------------------------------
      // VALIDATION
      // ----------------------------------------------

      if (!department) {
        return res.status(400).json({
          success: false,
          message:
            "Department is required",
        });
      }

      if (
        defaultSLAHours === undefined ||
        Number(defaultSLAHours) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Default SLA hours must be greater than 0",
        });
      }

      // ----------------------------------------------
      // CHECK DUPLICATE
      // ----------------------------------------------

      const existing =
        await SLASettings.findOne({
          department: {
            $regex: `^${department.trim()}$`,
            $options: "i",
          },
        });

      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "SLA settings already exist for this department",
        });
      }

      // ----------------------------------------------
      // CREATE
      // ----------------------------------------------

      const settings =
        await SLASettings.create({
          department:
            department.trim(),

          defaultSLAHours:
            Number(defaultSLAHours),

          warningBeforeHours:
            Number(
              warningBeforeHours ?? 2
            ),

          autoEscalation:
            autoEscalation ?? true,

          escalationLevels:
            escalationLevels || [],

          emailNotifications:
            emailNotifications ??
            true,

          systemNotifications:
            systemNotifications ??
            true,

          status:
            status || "Active",
        });

      res.status(201).json({
        success: true,
        message:
          "SLA settings created successfully",
        settings,
      });
    } catch (error) {
      console.error(
        "Create SLA settings error:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "SLA settings already exist for this department",
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to create SLA settings",
        error: error.message,
      });
    }
  };

// ======================================================
// UPDATE SLA SETTINGS
// PUT /api/sla/:id
// ======================================================

export const updateSLASettings =
  async (req, res) => {
    try {
      const {
        department,
        defaultSLAHours,
        warningBeforeHours,
        autoEscalation,
        escalationLevels,
        emailNotifications,
        systemNotifications,
        status,
      } = req.body;

      const settings =
        await SLASettings.findById(
          req.params.id
        );

      if (!settings) {
        return res.status(404).json({
          success: false,
          message:
            "SLA settings not found",
        });
      }

      // ----------------------------------------------
      // VALIDATION
      // ----------------------------------------------

      if (!department) {
        return res.status(400).json({
          success: false,
          message:
            "Department is required",
        });
      }

      if (
        defaultSLAHours === undefined ||
        Number(defaultSLAHours) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Default SLA hours must be greater than 0",
        });
      }

      // ----------------------------------------------
      // CHECK DUPLICATE DEPARTMENT
      // ----------------------------------------------

      const duplicate =
        await SLASettings.findOne({
          department: {
            $regex: `^${department.trim()}$`,
            $options: "i",
          },

          _id: {
            $ne: req.params.id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another SLA setting already exists for this department",
        });
      }

      // ----------------------------------------------
      // UPDATE
      // ----------------------------------------------

      settings.department =
        department.trim();

      settings.defaultSLAHours =
        Number(defaultSLAHours);

      settings.warningBeforeHours =
        Number(
          warningBeforeHours ?? 2
        );

      settings.autoEscalation =
        autoEscalation ?? true;

      settings.escalationLevels =
        escalationLevels || [];

      settings.emailNotifications =
        emailNotifications ?? true;

      settings.systemNotifications =
        systemNotifications ?? true;

      settings.status =
        status || "Active";

      await settings.save();

      res.status(200).json({
        success: true,
        message:
          "SLA settings updated successfully",
        settings,
      });
    } catch (error) {
      console.error(
        "Update SLA settings error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update SLA settings",
        error: error.message,
      });
    }
  };

// ======================================================
// DELETE SLA SETTINGS
// DELETE /api/sla/:id
// ======================================================

export const deleteSLASettings =
  async (req, res) => {
    try {
      const settings =
        await SLASettings.findByIdAndDelete(
          req.params.id
        );

      if (!settings) {
        return res.status(404).json({
          success: false,
          message:
            "SLA settings not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "SLA settings deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete SLA settings error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete SLA settings",
        error: error.message,
      });
    }
  };