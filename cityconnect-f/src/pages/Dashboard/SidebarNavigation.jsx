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
    { name: "Resource Management", component: "ResourceManagement", icon: Wrench },
    { name: "Create Project", component: "CreateProject", icon: Clipboard },
    { name: "Scheduling Tool", component: "SchedulingTool", icon: Calendar },
    { name: "Capacity Building", component: "CapacityBuilding", icon: Users },
    { name: "Discussion Forum", component: "DiscussionForum", icon: MessageSquare },
    { name: "User Management", component: "UserManagement", icon: UserPlus },
    { name: "Project Planning", component: "ProjectPlanning", icon: Home },
  ];

  return (
    <Disclosure as="nav" className="bg-blue-800 sm:w-64 h-screen">
      {({ open }) => (
        <>
          {/* Mobile Menu Button */}
          <div className="sm:hidden p-4">
            <Disclosure.Button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-700 transition">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Disclosure.Button>
          </div>

          {/* Desktop Sidebar (Scrollable) */}
          <div className="hidden sm:flex flex-col h-screen overflow-y-auto">
            <div className="py-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className="flex items-center text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-3 rounded-md text-lg font-semibold w-full text-left transition"
                  onClick={() => setActiveComponent(item.component)}
                >
                  <item.icon className="mr-3 h-5 w-5 text-blue-200" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Sidebar (Scrollable) */}
          <Disclosure.Panel className="sm:hidden max-h-[80vh] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="button"
                  className="flex items-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition"
                  onClick={() => setActiveComponent(item.component)}
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400" />
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
