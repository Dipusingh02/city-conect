import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useNavigate } from "react-router-dom";
import FeatureHighlights from './FeatureHighlights';
import RecentProjects from './RecentProjects';

const HomePage = () => {
  return (
    <div className="w-full">
      <Navbar />
      <header className="bg-gray-100 py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to CityConnect
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Streamline urban projects with ease and efficiency.
          </p>
          <button className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
         <Link to={"/login"}> Get Started</Link>
          </button>
        </div>
      </header>
      <FeatureHighlights />
      <RecentProjects />
      <Footer />
    </div>
  );
};

export default HomePage;