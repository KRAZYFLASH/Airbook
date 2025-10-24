import { Router } from "express";
import { adminAuthRoutes } from "./admin";
import { userAuthRoutes } from "./user";

const router = Router();

// Admin authentication routes
router.use("/admin", adminAuthRoutes);

// User authentication routes
router.use("/user", userAuthRoutes);

export default router;
