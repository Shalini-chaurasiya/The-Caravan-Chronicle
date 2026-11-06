import jwt from "jsonwebtoken";

const staffMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const [scheme, token, ...extraParts] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token || extraParts.length > 0) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format.",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "JWT configuration is missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "staff" || !decoded.staffId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Staff only.",
      });
    }

    req.staff = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Staff session has expired. Please login again.",
      });
    }

    console.error("Staff middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid staff token. Please login again.",
    });
  }
};

export default staffMiddleware;
