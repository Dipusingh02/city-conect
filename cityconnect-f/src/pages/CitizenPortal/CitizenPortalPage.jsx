import React, { useState } from "react";
import ProjectsPage from "../ProjectsPage/ProjectsPage";
import IssueReportingPage from "../IssueReporting/IssueReportingPage";
import { Tab } from "@headlessui/react";
import Navbar from "../Home/Navbar";

const CitizenPortalPage = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Change initial state to 1

  return (
    <div><Navbar/>
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-5xl font-bold mb-4 text-gray-800 text-center">
          Citizen Portal
        </h1>
        <p className="mb-8 text-gray-500 text-lg text-center">
          Welcome to the Citizen Portal. Here you can view city projects and report issues.
        </p>
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex justify-center space-x-4 mb-8">
            <Tab
              className={({ selected }) =>
                `px-6 py-2 text-lg leading-5 font-semibold rounded-full border-2 transition
                ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              View City Projects
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-6 py-2 text-lg leading-5 font-semibold rounded-full border-2 transition
                ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              Report an Issue
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <ProjectsPage />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <IssueReportingPage />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div></div>
  );
};

export default CitizenPortalPage;