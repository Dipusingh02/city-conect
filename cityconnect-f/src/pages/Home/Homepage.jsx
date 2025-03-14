import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import FeatureHighlights from "./FeatureHighlights";
import RecentProjects from "./RecentProjects";
import img from "../../assets/headerimg.jpg";

const HomePage = () => {
  return (
    <div className="w-full bg-gray-50">
      <Navbar />
      <header
        className="relative w-full min-h-[500px] md:h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center text-white px-6">
          <h1 className="text-6xl font-extrabold drop-shadow-lg">
            Welcome to CityConnect
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Streamline urban projects with ease and efficiency.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>
      <FeatureHighlights />
      <RecentProjects />
      <Footer />
    </div>
  );
};

export default HomePage;
