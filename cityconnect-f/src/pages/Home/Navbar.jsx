import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("name");
    if (userName) {
      setLoggedInUser(userName);
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleLoginClick = () => navigate("/login");
  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-900 shadow-lg text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CityConnect</h1>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-300 transition">Home</Link>
          <Link to="/citizen-portal" className="hover:text-blue-300 transition">Citizen Portal</Link>
        </div>

        <div className="flex items-center space-x-6">
          {loggedInUser ? (
            <div className="relative z-50">
              <button onClick={toggleDropdown} className="bg-blue-700 px-4 py-2 rounded-lg flex items-center hover:bg-blue-600">
                {loggedInUser} <ChevronDown className="ml-2 h-5 w-5" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleLoginClick} className="bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
              <LogIn className="h-5 w-5 mr-2" /> Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
