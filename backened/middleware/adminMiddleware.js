import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Expected:
    // Authorization: Bearer TOKEN

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Check admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Store admin information in request
    req.admin = decoded;

    next();

  } catch (error) {
    console.error("Admin Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

export default adminMiddleware;