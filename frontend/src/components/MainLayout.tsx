// src/layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout(): React.ReactElement {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
