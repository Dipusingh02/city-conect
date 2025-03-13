import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { loggedInUser, handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-blue-700 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white hover:text-sky-300">
          <Link to="/">CityConnect</Link>
        </h1>

        <div className="flex-none flex items-center space-x-6">
          <Link to="/citizen-portal" className="text-white hover:text-green-500">
            Citizen Portal
          </Link>

          <button className="lg:hidden text-gray-600 hover:text-blue-500" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {loggedInUser ? (
            <div className="relative">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {loggedInUser} <ChevronDown className="ml-2 h-5 w-5" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2">
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
              <LogIn className="h-5 w-5 mr-2" /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
