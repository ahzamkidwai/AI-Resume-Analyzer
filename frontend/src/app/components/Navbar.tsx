"use client";
import { useState } from "react";
import { Colors } from "../styles/colors";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav
        className="fixed w-full top-0 z-50 shadow-md transition-all duration-300"
        style={{ backgroundColor: Colors.background.white }}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          {/* Logo */}
          <h1
            className="text-xl sm:text-2xl font-bold cursor-pointer transition-transform hover:scale-105"
            style={{ color: Colors.primary.DEFAULT }}
          >
            FitCheck AI
          </h1>

          {/* Desktop Menu */}
          <ul
            className="hidden md:flex space-x-6 lg:space-x-8 font-medium"
            style={{ color: Colors.text.medium }}
          >
            <li>
              <a
                href="#features"
                className="hover:underline transition"
                style={{ color: Colors.text.medium }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how"
                className="hover:underline transition"
                style={{ color: Colors.text.medium }}
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:underline transition"
                style={{ color: Colors.text.medium }}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            style={{ color: Colors.primary.DEFAULT }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden fixed top-16 left-0 w-full bg-white shadow-lg transform transition-transform duration-300 ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
          style={{ backgroundColor: Colors.background.white }}
        >
          <ul
            className="flex flex-col items-center space-y-6 py-6 font-medium"
            style={{ color: Colors.text.medium }}
          >
            <li>
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="hover:underline transition text-lg"
                style={{ color: Colors.text.medium }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how"
                onClick={() => setMenuOpen(false)}
                className="hover:underline transition text-lg"
                style={{ color: Colors.text.medium }}
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="hover:underline transition text-lg"
                style={{ color: Colors.text.medium }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
