export const getDashboard = async (req, res) => {
  try {
    // User information comes from authMiddleware
    const userId = req.user.userId;
    const role = req.user.role;

    res.status(200).json({
      success: true,
      message: "Dashboard loaded successfully",
      userId,
      role,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};