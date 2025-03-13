import React from "react";
import { Disclosure } from "@headlessui/react";
import {
  X,
  Menu,
  Home,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  BarChart2,
  UserPlus,
  Clipboard,
  Wrench
} from "lucide-react";

const SidebarNavigation = ({ setActiveComponent }) => {
  const navItems = [
    { name: "City Data", component: "CityData", icon: BarChart2 },
    { name: "Projects Overview", component: "ProjectsOverview", icon: FileText },
    { name: "Resource Management", component: "ResourceManagement", icon: Wrench }, // Updated the icon here
    { name: "Create Project", component: "CreateProject", icon: Clipboard },
    { name: "Scheduling Tool", component: "SchedulingTool", icon: Calendar },
    { name: "Capacity Building", component: "CapacityBuilding", icon: Users },
    { name: "Discussion Forum", component: "DiscussionForum", icon: MessageSquare },
    { name: "User Management", component: "UserManagement", icon: UserPlus },
    { name: "Project Planning", component: "ProjectPlanning", icon: Home },
  ];

  return (
    <Disclosure as="nav" className="bg-blue-800 sm:w-64">
      {({ open }) => (
        <>
          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Disclosure.Button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {open ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden sm:block h-full">
            <div className="flex flex-col h-full py-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className="flex items-center text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-3 rounded-md text-lg font-semibold w-full text-left transition-all duration-200 ease-in-out"
                  onClick={() => setActiveComponent(item.component)}
                >
                  <item.icon className="mr-3 h-5 w-5 text-blue-200" aria-hidden="true" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Sidebar */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="button"
                  className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                  onClick={() => setActiveComponent(item.component)}
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default SidebarNavigation;
