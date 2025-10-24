import { Router } from "express";
import { UserAuthController } from "./user.controller";
import { authMiddleware } from "../../../common/middleware";

const router = Router();
const userAuthController = new UserAuthController();

// Public routes (no authentication required)
router.post("/register", userAuthController.register);
router.post("/login", userAuthController.login);

// Protected routes (authentication required)
router.use(authMiddleware); // Apply authentication middleware to all routes below

router.get("/profile", userAuthController.getProfile);
router.put("/profile", userAuthController.updateProfile);
router.put("/change-password", userAuthController.changePassword);
router.put("/verify-email", userAuthController.verifyEmail);
router.post("/logout", userAuthController.logout);

export default router;
