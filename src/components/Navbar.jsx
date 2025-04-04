import React from "react";
import { FaSpotify } from "react-icons/fa";
import { NavLink } from "react-router"; // Make sure to import from 'react-router-dom' for React Router v6
import imgSpotify from "./spotify.png";
const Navbar = ({ closeNavbar }) => {
  return (
    <nav className="w-60 flex-col p-4 text-white">
      {/* Logo Section */}
      <div className="flex items-center mb-6 mt-2">
        <FaSpotify className="text-2xl lg:text-3xl mr-2" />
        <img src={imgSpotify} className="w-25" alt="" />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-left px-4 py-2  rounded-sm transition-all duration-300 
            ${isActive ? "text-white " : "text-[#ffffff90]"}`}
          end
          onClick={closeNavbar}  // Close navbar on click
        >
          For You
        </NavLink>
        <NavLink 
          to="/top-tracks" 
          className={({ isActive }) => 
            `text-left px-4 py-2 rounded-sm transition-all duration-300 
            ${isActive ? "text-white " : "text-[#ffffff70]"}`}
          onClick={closeNavbar}  // Close navbar on click
        >
          Top Tracks
        </NavLink>
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => 
            `text-left px-4 py-2 rounded-sm transition-all duration-300 
              ${isActive ? "text-white  " : "text-[#ffffff70]"}`}
          onClick={closeNavbar}  // Close navbar on click
        >
          Favorites
        </NavLink>
        <NavLink 
          to="/recently-played" 
          className={({ isActive }) => 
            `text-left px-4 py-2 rounded-sm transition-all duration-300 
             ${isActive ? "text-white  " : "text-[#ffffff70]"}`}
          onClick={closeNavbar}  // Close navbar on click
        >
          Recently Played
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
