import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import DiscussionForum from "./DiscussionForum"; // Import the DiscussionForum component

const ProjectCard = ({ title, departments, location, status, deadline, description }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
        <Users size={16} className="mr-1" />
        <span className="mr-4">Departments: {departments.join(", ")}</span>
      </div>
      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
        <MapPin size={16} className="mr-1" />
        <span className="mr-4">Location: {location}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Calendar size={16} className="mr-1" />
        <span className="mr-4">Deadline: {deadline}</span>
        {status.toLowerCase() === "delayed" && (
          <span className="flex items-center text-yellow-600">
            <AlertCircle size={16} className="mr-1" />
            Delayed
          </span>
        )}
      </div>
    </div>
  );
};

const ProjectsOverview = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showDiscussionForum, setShowDiscussionForum] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/show/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.status.toLowerCase() === filter);

  return (
    <div className="mt-8">
      {showDiscussionForum ? (
        <DiscussionForum /> // Render DiscussionForum component
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar size={24} className="mr-2" />
              Inter-departmental Projects Overview
            </h2>
            <div>
              <select
                className="bg-white border rounded px-2 py-1"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Projects</option>
                <option value="in progress">In Progress</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => <ProjectCard key={index} {...project} />)
            ) : (
              <p className="text-gray-500 text-center col-span-2">No projects found.</p>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition-colors"
              onClick={() => setShowDiscussionForum(true)}
            >
              <MessageSquare size={16} className="mr-2" />
              Open Discussion Forum
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsOverview;