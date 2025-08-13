// src/component/nav-bar/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="from-blue-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">HealthCheckAI</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg items-center">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/doctor-profile" className="hover:text-blue-600 transition">
              Doctor Profile
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-blue-600 transition">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600 transition">
              About
            </Link>
          </li>

          {!isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/content" className="hover:text-blue-600 transition">
                Chat
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden from-blue-50 px-4 py-3 space-y-3 text-center border-t">
          <Link to="/" className="block hover:text-blue-600 py-1">
            Home
          </Link>
          <Link to="/about" className="block hover:text-blue-600 py-1">
            About
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link to="/content" className="block hover:text-blue-600 py-1">
              Chat
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
