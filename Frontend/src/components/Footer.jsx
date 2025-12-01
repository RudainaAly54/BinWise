import React from "react";
import { assets } from "../assets/assets";
const Footer = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full bg-green-800 text-white ">
      <img src={assets.WhiteLogo} alt="logo" className="m-4" />
      <div className="w-6xl border-1  m-1"></div>
      <p className="p-2 mb-3">©2025 BinWise</p>
    </div>
  );
};

export default Footer;
