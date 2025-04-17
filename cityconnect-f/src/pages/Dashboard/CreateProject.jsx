import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [departments, setDepartments] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [leadDepartment, setLeadDepartment] = useState('');
  const [projects, setProjects] = useState([]); // Added missing state for projects

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newProject = {
      title: projectName,
      description: projectDescription,
      departments: departments.split(',').map((d) => d.trim()),
      location,
      status,
      startDate,
      deadline,
      budget: Number(budget),
      leadDepartment,
    };
  
    try {
      const token = localStorage.getItem("token"); // Ensure the token is stored and retrieved correctly
  
      const response = await axios.post("http://localhost:8081/add/projects", newProject, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });
  
      setProjects([...projects, response.data.project]);
      console.log('Project created:', response.data.project);
  
      // Reset form after successful submission
      setProjectName('');
      setProjectDescription('');
      setDepartments('');
      setLocation('');
      setStatus('');
      setStartDate('');
      setDeadline('');
      setBudget('');
      setLeadDepartment('');
    } catch (error) {
      console.error("Error creating project:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block mb-2 font-medium text-gray-700">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="projectDescription" className="block mb-2 font-medium text-gray-700">
            Project Description
          </label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="departments" className="block mb-2 font-medium text-gray-700">
            Departments (comma-separated)
          </label>
          <input
            id="departments"
            type="text"
            value={departments}
            onChange={(e) => setDepartments(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block mb-2 font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
            Status
          </label>
          <input
            id="status"
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block mb-2 font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block mb-2 font-medium text-gray-700">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block mb-2 font-medium text-gray-700">
            Budget (in ₹)
          </label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="leadDepartment" className="block mb-2 font-medium text-gray-700">
            Lead Department
          </label>
          <input
            id="leadDepartment"
            type="text"
            value={leadDepartment}
            onChange={(e) => setLeadDepartment(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
