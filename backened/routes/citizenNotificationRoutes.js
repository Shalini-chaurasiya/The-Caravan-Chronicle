import express from "express";
import {
  getCitizenNotifications,
  markAllCitizenNotificationsAsRead,
  markCitizenNotificationAsRead,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getCitizenNotifications);
router.patch("/read", markAllCitizenNotificationsAsRead);
router.patch("/:id/read", markCitizenNotificationAsRead);

export default router;
