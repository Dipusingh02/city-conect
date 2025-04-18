import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  Bookmark,
  DollarSign,
  Clock,
  CheckCircle,
  Flag,
  BarChart2,
  FileText,
  Camera,
  PlusCircle,
  MessageCircle,
  Share2,
  AlertTriangle,
  Filter,
  X
} from "lucide-react";
import IssueFormModal from "./IssueFormModal";
import IssueDetailModal from "./IssueDetailModal";
import { Upload } from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Modal states
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);
  const [isIssueDetailOpen, setIsIssueDetailOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredIssues, setFilteredIssues] = useState([]);

  // Media states
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8081/show/projects/${projectId}`);
        setProject(response.data);

        // Fetch related issues for this project
        const issuesResponse = await axios.get(`http://localhost:8081/citizen/issues/by-project/${projectId}`);
        setIssues(issuesResponse.data);
        setFilteredIssues(issuesResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to load project details");
        setLoading(false);
        console.error("Error fetching project details:", err);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  // Apply filters when issues or filter settings change
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue =>
        issue.status.toLowerCase() === statusFilter.toLowerCase()
      ));
    }
  }, [issues, statusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-yellow-100 text-yellow-800";
      case "planned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIssueStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleIssueCreated = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
  };

  const handleIssueUpdated = (updatedIssue) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue._id === updatedIssue._id ? updatedIssue : issue
      )
    );
    setSelectedIssue(updatedIssue);
  };

  const openIssueDetail = (issue) => {
    setSelectedIssue(issue);
    setIsIssueDetailOpen(true);
  };

  const renderProgressBar = (percentage) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const renderMilestones = (milestones) => {
    if (!milestones || milestones.length === 0) {
      return <p className="text-gray-500">No milestones defined</p>;
    }

    return (
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex items-start">
            <div className={`mt-1 mr-3 ${milestone.completed ? "text-green-500" : "text-gray-400"}`}>
              <CheckCircle size={20} />
            </div>
            <div>
              <h4 className="font-medium">{milestone.title}</h4>
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(milestone.date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };



  const renderIssues = () => {
    if (!filteredIssues || filteredIssues.length === 0) {
      return (
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No issues found with the selected filters</p>
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredIssues.map((issue, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 cursor-pointer transition-colors duration-200"
            onClick={() => openIssueDetail(issue)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <AlertTriangle size={18} className="text-yellow-500 mr-2" />
                <h4 className="font-medium">{issue.title}</h4>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getIssueStatusColor(issue.status)}`}>
                {issue.status}
              </span>
            </div>
            <p className="text-gray-700 mb-3 line-clamp-2">{issue.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(issue.createdAt)}
              </div>
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                {issue.department}
              </div>
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {issue.location}
              </div>
              {issue.publicFeedback && issue.publicFeedback.length > 0 && (
                <div className="flex items-center">
                  <MessageSquare size={14} className="mr-1" />
                  {issue.publicFeedback.length} {issue.publicFeedback.length === 1 ? 'Comment' : 'Comments'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const MediaUploadModal = ({ isOpen, onClose, projectId, onMediaUploaded }) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
      setSelectedFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
      if (selectedFiles.length === 0) return;

      setIsUploading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('media', file);
      });

      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(
          `http://localhost:8081/api/projects/${projectId}/media`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          }
        );

        onMediaUploaded(response.data.media);
        setSelectedFiles([]);
        setUploadProgress(0);
        onClose();
      } catch (error) {
        console.error("Error uploading media:", error);
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Upload Media</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Images/Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload size={36} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop files here or click to browse
                  </p>
                </div>
              </label>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
              <div className="max-h-36 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs">Uploading...</span>
                <span className="text-xs">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className={`px-4 py-2 text-sm text-white rounded ${
                selectedFiles.length === 0 || isUploading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleMediaUploaded = (newMedia) => {
    setProject(prev => ({
      ...prev,
      media: [...(prev.media || []), ...newMedia]
    }));
  };

  const renderMediaGallery = (media) => {
    if (!media || media.length === 0) {
      return <p className="text-gray-500">No media attachments</p>;
    }
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item, index) => {
          const fileType = item.split('.').pop().toLowerCase();
          const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileType);
          const isPdf = fileType === 'pdf';
          const isDoc = ['doc', 'docx'].includes(fileType);
  
          return (
            <div key={index} className="border rounded-lg overflow-hidden p-4 flex flex-col items-center">
              {isImage ? (
                <img
                  src={`http://localhost:8081${item}`}
                  alt={`Project media ${index + 1}`}
                  className="w-full h-48 object-cover mb-2"
                />
              ) : isPdf ? (
                <div className="flex items-center mb-2">
                  <FileText size={48} className="text-red-500" />
                </div>
              ) : isDoc ? (
                <div className="flex items-center mb-2">
                  <FileText size={48} className="text-blue-500" />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <FileText size={48} className="text-gray-500" />
                </div>
              )}
              <a
                href={`http://localhost:8081${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {item.split('/').pop()}
              </a>
            </div>
          );
        })}
      </div>
    );
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
        <div className="flex">
          <AlertCircle size={24} className="mr-2" />
          <div>
            <h3 className="font-medium">Error</h3>
            <p>{error || "Project not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-blue-100 to-purple-100">
      {/* Back button and top navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Projects
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{project.title}</h1>
            <p className="text-gray-500 mb-2">Project Code: {project.projectCode || 'N/A'}</p>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b mb-6">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "timeline"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("timeline")}
          >
            Timeline & Milestones
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "budget"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("budget")}
          >
            Budget
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "issues"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("issues")}
          >
            Issues {issues.length > 0 && `(${issues.length})`}
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "gallery"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery & Feedback
          </button>
        </div>
      </div>

      {/* Main Content Area with conditional rendering based on active tab */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Basic Info Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Description</h3>
                  <p className="text-gray-700 mb-4">{project.description}</p>

                  <h3 className="text-lg font-medium mb-3">Objective</h3>
                  <p className="text-gray-700 mb-4">{project.objective || "No objective specified"}</p>

                  {project.scopeOfWork && (
                    <>
                      <h3 className="text-lg font-medium mb-3">Scope of Work</h3>
                      <p className="text-gray-700 mb-4">{project.scopeOfWork}</p>
                    </>
                  )}
                </div>

                <div>
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <h3 className="text-lg font-medium mb-3">Progress</h3>
                    <div className="mb-2 flex justify-between">
                      <span className="text-gray-700">Overall Progress</span>
                      <span className="font-medium">{project.progressPercentage}%</span>
                    </div>
                    {renderProgressBar(project.progressPercentage)}
                    <p className="text-sm text-gray-500 mt-2">
                      Last updated: {formatDate(project.lastUpdated)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Users size={18} className="text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Departments Involved</p>
                        <p className="text-gray-700">{project.departments.join(", ")}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Flag size={18} className="text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Lead Department</p>
                        <p className="text-gray-700">{project.leadDepartment}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin size={18} className="text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-gray-700">{project.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock size={18} className="text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Timeline</p>
                        <p className="text-gray-700">
                          {formatDate(project.startDate)} - {formatDate(project.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges and Impact */}
            {(project.challenges || project.impact) && (
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.challenges && (
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <AlertCircle size={18} className="mr-2 text-yellow-500" />
                        Challenges & Solutions
                      </h3>
                      <p className="text-gray-700">{project.challenges}</p>
                    </div>
                  )}

                  {project.impact && (
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <BarChart2 size={18} className="mr-2 text-blue-500" />
                        Project Impact
                      </h3>
                      <p className="text-gray-700">{project.impact}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technologies Used */}
            {project.technologiesUsed && project.technologiesUsed.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologiesUsed.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Person */}
            {project.contactPerson && project.contactPerson.name && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-3">Contact Person</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{project.contactPerson.name}</p>
                  <p className="text-gray-600">{project.contactPerson.position}</p>
                  <div className="mt-2 space-y-1">
                    {project.contactPerson.email && (
                      <p className="text-sm">Email: {project.contactPerson.email}</p>
                    )}
                    {project.contactPerson.phone && (
                      <p className="text-sm">Phone: {project.contactPerson.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Issues Overview */}
            {issues.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <AlertTriangle size={18} className="mr-2 text-yellow-500" />
                    Recent Issues ({issues.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab("issues")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {issues.slice(0, 2).map((issue, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 p-3 rounded cursor-pointer hover:border-blue-300"
                      onClick={() => openIssueDetail(issue)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{issue.title}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getIssueStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{issue.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Timeline & Milestones</h2>

            {/* Timeline Overview */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                  <p className="font-medium">{formatDate(project.deadline)}</p>
                </div>
              </div>

              <div className="h-2 bg-gray-200 rounded-full relative mb-2">
                <div
                  className="absolute h-2 bg-blue-600 rounded-full"
                  style={{
                    width: `${project.progressPercentage}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Milestones</h3>
              {renderMilestones(project.milestones)}
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Budget Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Total Budget</h3>
                <div className="flex items-center">
                  <DollarSign size={24} className="text-green-600 mr-2" />
                  <span className="text-2xl font-bold">
                    {project.budget?.total ? project.budget.total.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }) : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Budget Utilized</h3>
                <div className="flex items-center">
                  <DollarSign size={24} className="text-blue-600 mr-2" />
                  <span className="text-2xl font-bold">
                    {project.budget?.utilized ? project.budget.utilized.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }) : '$0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Progress */}
            {project.budget && project.budget.total > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Budget Utilization</h3>
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-700">Budget Used</span>
                  <span className="font-medium">
                    {Math.round((project.budget.utilized / project.budget.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(project.budget.utilized / project.budget.total) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Remaining: {(project.budget.total - project.budget.utilized).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "issues" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Project Issues</h2>
              <button
                className="flex items-center text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                onClick={() => setIsIssueFormOpen(true)}
              >
                <PlusCircle size={16} className="mr-1" />
                Report New Issue
              </button>
            </div>

            {/* Filter controls */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Filter size={16} className="text-gray-500 mr-2" />
                <h3 className="text-sm font-medium">Filter Issues</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    statusFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  All Issues
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    statusFilter === "pending"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : "bg-gray-200 hover:bg-yellow-50 text-gray-700"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("in progress")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    statusFilter === "in progress"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-200 hover:bg-blue-50 text-gray-700"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setStatusFilter("resolved")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    statusFilter === "resolved"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-200 hover:bg-green-50 text-gray-700"
                  }`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    statusFilter === "rejected"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-gray-200 hover:bg-red-50 text-gray-700"
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>

            {renderIssues()}
          </div>
        )}

        {activeTab === "gallery" && (
          <div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Project Gallery</h2>
                <button
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setIsMediaUploadOpen(true)}
                >
                  <PlusCircle size={16} className="mr-1" />
                  Add Media
                </button>
              </div>
              {renderMediaGallery(project.media)}
            </div>
          </div>
        )}

        {isIssueFormOpen && (
          <IssueFormModal
            isOpen={isIssueFormOpen}
            onClose={() => setIsIssueFormOpen(false)}
            projectId={projectId}
            projectTitle={project?.title}
            onIssueCreated={handleIssueCreated}
          />
        )}

        {isIssueDetailOpen && selectedIssue && (
          <IssueDetailModal
            isOpen={isIssueDetailOpen}
            onClose={() => setIsIssueDetailOpen(false)}
            issue={selectedIssue}
            onStatusUpdate={handleIssueUpdated}
          />
        )}

        {isMediaUploadOpen && (
          <MediaUploadModal
            isOpen={isMediaUploadOpen}
            onClose={() => setIsMediaUploadOpen(false)}
            projectId={projectId}
            onMediaUploaded={handleMediaUploaded}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
