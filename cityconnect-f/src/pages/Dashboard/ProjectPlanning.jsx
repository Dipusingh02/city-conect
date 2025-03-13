import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Briefcase,
  Search,
  Filter,
  PlusCircle,
  Calendar,
  Users,
  MapPin,
  XCircle,
} from "lucide-react";

const ProjectCard = ({ title, description, startDate, deadline, departments, location, status }) => {
  
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
        <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
          status
        )}`}
      >
        {status}
      </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar size={16} className="mr-1" />
        <span className="mr-4">
          {startDate} - {deadline}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Users size={16} className="mr-1" />
        <span className="mr-4">Departments: {departments.join(", ")}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <MapPin size={16} className="mr-1" />
        <span>{location}</span>
      </div>
    </div>
  );
};

const ProjectPlanning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    startDate: "",
    deadline: "",
    departments: "",
    location: "",
    status: "Planning",
    budget: "",
    leadDepartment: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8081/show/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const formattedProject = {
      ...newProject,
      departments: newProject.departments.split(",").map((d) => d.trim()),
      budget: Number(newProject.budget),
    };

    console.log("Submitting Project:", formattedProject);

    try {
      const response = await axios.post(
        "http://localhost:8081/add/projects",
        formattedProject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProjects([...projects, response.data.project]);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating project:", error.response?.data || error.message);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      (filter === "All" || project.status === filter) &&
      (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.departments.join(" ").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Briefcase size={24} className="mr-2" />
        Project Planning
      </h2>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border p-2 rounded-lg w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded-lg w-full max-w-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Planning</option>
          <option>In Progress</option>
          <option>Delayed</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition">
          <PlusCircle size={16} className="mr-2" />
          Create New Project
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg my-10">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Create New Project</h3>
              <XCircle size={24} className="cursor-pointer" onClick={() => setShowForm(false)} />
            </div>
            <form onSubmit={handleCreateProject} className="grid gap-4">
              <input type="text" placeholder="Title" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required />
              <textarea placeholder="Description" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} required />
              <input type="date" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} required />
              <input type="date" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} required />
              <input type="text" placeholder="Departments (comma separated)" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, departments: e.target.value })} required />
              <input type="text" placeholder="Lead Department" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, leadDepartment: e.target.value })} required />
              <input type="text" placeholder="Location" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, location: e.target.value })} required />
              <select className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, status: e.target.value })} required>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
              <input type="number" placeholder="Budget" className="border p-2 rounded" onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })} required />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPlanning;
