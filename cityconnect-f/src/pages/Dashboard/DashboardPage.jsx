import React, { useState } from "react";
import SidebarNavigation from "./SidebarNavigation";
import DashboardHeader from "./DashboardHeader";
import CityData from "./CityData";
import ProjectsOverview from "./ProjectsOverview";
import ResourceManagement from "./ResourceManagement";
import SchedulingTool from "./SchedulingTool";
import CapacityBuilding from "./CapacityBuilding";
import DiscussionForum from "./DiscussionForum";
import UserManagement from "./UserManagement";
import ProjectPlanning from "./ProjectPlanning";
import CreateProject from "./CreateProject";
import "../../App.css";
import IssuesReport from "./IssuesReport";

const DashboardPage = () => {
  const [activeComponent, setActiveComponent] = useState('CityData');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Add sidebar state for mobile toggle

  const renderComponent = () => {
    switch (activeComponent) {
      case 'CreateProject':
        return <CreateProject />;
      case 'CityData':
        return <CityData />;
      case 'ProjectsOverview':
        return <ProjectsOverview />;
      case 'ResourceManagement':
        return <ResourceManagement />;
      case 'SchedulingTool':
        return <SchedulingTool />;
      case 'CapacityBuilding':
        return <CapacityBuilding />;
      case 'DiscussionForum':
        return <DiscussionForum />;
      case 'UserManagement':
        return <UserManagement />;
      case 'ProjectPlanning':
        return <ProjectPlanning />;
      case 'IssuesReport':
        return <IssuesReport />;
      default:
        return <CityData />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Dashboard Header */}
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Scrollable) */}
        <SidebarNavigation
          setActiveComponent={setActiveComponent}
          setSidebarOpen={setSidebarOpen} // Pass down state
          sidebarOpen={sidebarOpen} // Pass down the state
        />

        {/* Main Content (Scrollable) */}
        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-r from-blue-100 to-purple-100 overflow-y-auto h-full custom-scrollbar">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};


export default DashboardPage;
