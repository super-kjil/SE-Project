import React from "react";
import { Outlet } from "react-router-dom";

function MainLayoutKitchen() {
  return (
    <div>
      <div className="bg-red-800 h-10"></div>
      <Outlet />
    </div>
  );
}

export default MainLayoutKitchen;
