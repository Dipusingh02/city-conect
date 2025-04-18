import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Briefcase, 
  Filter,
  PlusCircle
} from "lucide-react";
import IssueDetailModal from "./IssueDetailModal";
import IssueFormModal from "./IssueFormModal";
import useAuth from "../../hooks/useAuth";

const IssueCard = ({ issue, onClick }) => {
  const { 
    title, 
    department, 
    location, 
    status, 
    description, 
    createdAt, 
    projectName 
  } = issue;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(issue)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      
      {projectName && (
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
          <Briefcase size={16} className="mr-1" />
          <span className="mr-4">Project: {projectName}</span>
        </div>
      )}
      
      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
        <Users size={16} className="mr-1" />
        <span className="mr-4">Department: {department}</span>
      </div>
      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
        <MapPin size={16} className="mr-1" />
        <span className="mr-4">Location: {location}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Calendar size={16} className="mr-1" />
        <span className="mr-4">Reported on: {new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const IssuesReport = () => {
  const { loggedInUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectFilter, setProjectFilter] = useState("all");
  
  // Modal states
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects for filter dropdown
      const projectsResponse = await axios.get("http://localhost:8081/projects/list");
      setProjects(projectsResponse.data);
      
      // Fetch issues
      const issuesResponse = await axios.get("http://localhost:8081/citizen/issues");
      setIssues(issuesResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  const handleProjectFilterChange = async (e) => {
    const selectedProjectId = e.target.value;
    setProjectFilter(selectedProjectId);
    
    try {
      setLoading(true);
      let response;
      
      if (selectedProjectId === "all") {
        response = await axios.get("http://localhost:8081/citizen/issues");
      } else {
        response = await axios.get(`http://localhost:8081/citizen/issues/by-project/${selectedProjectId}`);
      }
      
      setIssues(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error filtering issues by project:", err);
      setError("Failed to filter issues.");
      setLoading(false);
    }
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  const handleIssueUpdate = (updatedIssue) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue._id === updatedIssue._id ? updatedIssue : issue
      )
    );
    setSelectedIssue(updatedIssue);
  };

  const handleIssueCreated = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    // Refresh data to get the most up-to-date list
    fetchData();
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Reported Issues</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-600" />
            <select 
              className="bg-white border rounded px-3 py-2"
              value={projectFilter}
              onChange={handleProjectFilterChange}
            >
              <option value="all">All Issues</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusCircle size={16} className="mr-2" />
            Report Issue
          </button>
        </div>
      </div>
      
      {issues.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          <AlertCircle size={24} className="mx-auto mb-2" />
          <p>No issues reported yet.</p>
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mx-auto"
          >
            <PlusCircle size={16} className="mr-2" />
            Report First Issue
          </button>
        </div>
      ) : (
        issues.map((issue) => (
          <IssueCard
            key={issue._id}
            issue={issue}
            onClick={handleIssueClick}
          />
        ))
      )}
      
      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          issue={selectedIssue}
          onStatusUpdate={handleIssueUpdate}
        />
      )}
      
      {/* Issue Form Modal */}
      <IssueFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        projectId={projectFilter !== "all" ? projectFilter : ""}
        projectTitle={
          projectFilter !== "all" 
            ? projects.find(p => p._id === projectFilter)?.title 
            : ""
        }
        onIssueCreated={handleIssueCreated}
      />
    </div>
  );
};

export default IssuesReport;