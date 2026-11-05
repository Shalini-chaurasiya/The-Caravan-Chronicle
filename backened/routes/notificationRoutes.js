import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", adminMiddleware, getNotifications);
router.patch("/read", adminMiddleware, markAllNotificationsAsRead);
router.patch("/:id/read", adminMiddleware, markNotificationAsRead);

export default router;
