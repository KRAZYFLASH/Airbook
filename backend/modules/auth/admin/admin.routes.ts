import { Router } from "express";
import { AdminAuthController } from "./admin.controller";
import {
  authMiddleware,
  adminOnlyMiddleware,
} from "../../../common/middleware";

const router = Router();
const adminAuthController = new AdminAuthController();

// Public admin routes
router.post("/login", adminAuthController.login);

// Protected admin routes (require authentication + admin role)
router.get(
  "/profile",
  authMiddleware,
  adminOnlyMiddleware,
  adminAuthController.getProfile
);
router.post(
  "/create",
  authMiddleware,
  adminOnlyMiddleware,
  adminAuthController.createAdmin
);
router.put(
  "/status/:adminId",
  authMiddleware,
  adminOnlyMiddleware,
  adminAuthController.updateAdminStatus
);
router.post(
  "/logout",
  authMiddleware,
  adminOnlyMiddleware,
  adminAuthController.logout
);

export default router;
