import { Button } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import logo from "../../assets/cafelogo.png";
// import "./MainLayoutAuth.css"

function MainLayoutAuth() {
  return (
    <div>
      <div className="pt-20	"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayoutAuth;
