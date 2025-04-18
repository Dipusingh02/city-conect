import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  AlertCircle, 
  X, 
  Paperclip, 
  Send,
  ChevronDown,
  FileText,
  Clock,
  MapPin,
  Users
} from "lucide-react";

const IssueFormModal = ({ isOpen, onClose, projectId, projectTitle, onIssueCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    status: "Pending",
    projectId: projectId || "",
  });
  
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        title: "",
        description: "",
        department: "",
        location: "",
        status: "Pending",
        projectId: projectId || "",
      });
      setAttachment(null);
      setError("");
      setSuccess("");
      
      // Fetch projects if not already provided
      if (!projectId) {
        fetchProjects();
      }
    }
  }, [isOpen, projectId]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8081/projects/list");
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects list");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const formPayload = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });
      
      // Append file if exists
      if (attachment) {
        formPayload.append("attachment", attachment);
      }
      
      const response = await axios.post(
        "http://localhost:8081/report/issues",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setSuccess("Issue reported successfully!");
      
      // Call the callback with the new issue
      if (onIssueCreated) {
        onIssueCreated(response.data.issue);
      }
      
      // Close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error("Error submitting issue:", err);
      setError(err.response?.data?.error || "Failed to submit issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <AlertCircle size={18} className="mr-2 text-yellow-500" />
            Report New Issue
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          {/* Project Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            {projectId ? (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                {projectTitle}
              </div>
            ) : (
              <div className="relative">
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  required
                >
                  <option value="">Select a project</option>
                  <option value="none">Not related to a specific project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            )}
          </div>
          
          {/* Issue Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter a clear title for the issue"
              required
            />
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Please describe the issue in detail"
              required
            />
          </div>
          
          {/* Department */}
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Responsible department"
              required
            />
          </div>
          
          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Specific location of the issue"
              required
            />
          </div>
          
          {/* Attachment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment (Optional)
            </label>
            <div className="flex items-center">
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50">
                <Paperclip size={16} className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Select File</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {attachment && (
                <span className="ml-3 text-sm text-gray-600">
                  {attachment.name}
                </span>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Submit Issue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueFormModal;