// Shared auth components
export { AuthRepository } from "./auth.repo";

// Admin auth components
export * from "./admin";

// User auth components
export * from "./user";

// Main auth routes (combines admin and user routes)
export { default as authRoutes } from "./auth.routes";
