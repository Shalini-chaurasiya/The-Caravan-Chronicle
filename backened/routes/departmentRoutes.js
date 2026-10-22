import express from "express";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStaff,
} from "../controllers/departmentController.js";

const router = express.Router();

router.get("/", getDepartments);
router.get("/:id/staff", getDepartmentStaff);
router.get("/:id", getDepartmentById);

router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;