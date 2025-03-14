import React, { useState } from "react";
import ProjectsPage from "../ProjectsPage/ProjectsPage";
import IssueReportingPage from "../IssueReporting/IssueReportingPage";
import { Tab } from "@headlessui/react";
import Navbar from "../Home/Navbar";

const CitizenPortalPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-6 py-12 min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-lg p-10 text-white text-center">
          <h1 className="text-6xl font-extrabold mb-4">Citizen Portal</h1>
          <p className="text-xl font-medium">
            Explore city projects or report issues effortlessly.
          </p>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-xl shadow-xl p-8">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex justify-center space-x-8 mb-8">
              <Tab
                className={({ selected }) =>
                  `px-8 py-3 text-xl font-semibold rounded-full border-2 transition-all
                  ${
                    selected
                      ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                      : "bg-blue-100 text-blue-700 border-blue-400 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                View City Projects
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-8 py-3 text-xl font-semibold rounded-full border-2 transition-all
                  ${
                    selected
                      ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                      : "bg-blue-100 text-blue-700 border-blue-400 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                Report an Issue
              </Tab>
            </Tab.List>

            {/* Tab Panels */}
            <Tab.Panels>
              <Tab.Panel>
                <div className="bg-blue-50 p-8 rounded-xl shadow-md">
                  <ProjectsPage />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="bg-blue-100 p-8 rounded-xl shadow-md">
                  <IssueReportingPage />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default CitizenPortalPage;
