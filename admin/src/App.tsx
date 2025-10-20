import { RouterProvider } from "react-router-dom";
import { router } from "./router";

// =============================================================
// AirBook Admin — V3  (React + TypeScript + Tailwind)
// Enhanced UI/UX with routing support
// =============================================================

export default function AirBookAdmin() {
  return <RouterProvider router={router} />;
}