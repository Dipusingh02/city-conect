import React, { useState } from "react";
import axios from "axios";
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Users, 
  MessageCircle, 
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Loader
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const IssueDetailModal = ({ isOpen, onClose, issue, onStatusUpdate }) => {
  const { loggedInUser } = useAuth();
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(issue?.status || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen || !issue) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setSubmittingComment(true);
    setError("");
    
    try {
      const response = await axios.post(`http://localhost:8081/issues/${issue._id}/comments`, {
        user: loggedInUser || "Anonymous", // Use the actual logged-in user name
        comment: comment
      });
      
      setSuccess("Comment added successfully!");
      setComment("");
      
      // Update the issue in the parent component
      if (onStatusUpdate) {
        onStatusUpdate(response.data);
      }
      
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(err.response?.data?.error || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleStatusChange = async (status) => {
    setUpdatingStatus(true);
    setError("");
    
    try {
      const response = await axios.put(`http://localhost:8081/issues/${issue._id}/status`, {
        status
      });
      
      setSelectedStatus(status);
      setSuccess(`Status updated to ${status} successfully!`);
      
      // Update the issue in the parent component
      if (onStatusUpdate) {
        onStatusUpdate(response.data);
      }
      
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <AlertTriangle size={18} className="mr-2 text-yellow-500" />
            Issue Details
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          {/* Issue Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-medium">{issue.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
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
            </div>
            
            <p className="text-gray-700">{issue.description}</p>
            
            {/* Project info if available */}
            {issue.projectName && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <span className="text-sm font-medium">Related to Project: </span>
                <span className="text-blue-700">{issue.projectName}</span>
              </div>
            )}
            
            {/* Attachment if available */}
            {issue.attachment && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Attachment</h4>
                <a 
                  href={issue.attachment} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <span className="mr-1">View Attachment</span>
                </a>
              </div>
            )}
          </div>
          
          {/* Status Management Section (for admins) */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange("Pending")}
                disabled={updatingStatus || issue.status === "Pending"}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center ${
                  issue.status === "Pending" 
                    ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300" 
                    : "bg-gray-100 text-gray-800 hover:bg-yellow-50"
                }`}
              >
                <Clock size={14} className="mr-1" />
                Pending
              </button>
              <button
                onClick={() => handleStatusChange("In Progress")}
                disabled={updatingStatus || issue.status === "In Progress"}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center ${
                  issue.status === "In Progress" 
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-300" 
                    : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                }`}
              >
                <Loader size={14} className="mr-1" />
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange("Resolved")}
                disabled={updatingStatus || issue.status === "Resolved"}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center ${
                  issue.status === "Resolved" 
                    ? "bg-green-100 text-green-800 border-2 border-green-300" 
                    : "bg-gray-100 text-gray-800 hover:bg-green-50"
                }`}
              >
                <CheckCircle size={14} className="mr-1" />
                Resolved
              </button>
              <button
                onClick={() => handleStatusChange("Rejected")}
                disabled={updatingStatus || issue.status === "Rejected"}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center ${
                  issue.status === "Rejected" 
                    ? "bg-red-100 text-red-800 border-2 border-red-300" 
                    : "bg-gray-100 text-gray-800 hover:bg-red-50"
                }`}
              >
                <XCircle size={14} className="mr-1" />
                Rejected
              </button>
            </div>
            {updatingStatus && (
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <div className="h-3 w-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating status...
              </div>
            )}
          </div>
          
          {/* Comments Section */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <MessageCircle size={16} className="mr-1" />
              Comments {issue.publicFeedback && `(${issue.publicFeedback.length})`}
            </h4>
            
            {/* Display existing comments */}
            <div className="space-y-3 mb-4">
              {issue.publicFeedback && issue.publicFeedback.length > 0 ? (
                issue.publicFeedback.map((feedback, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <div className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2 text-xs font-medium">
                        {feedback.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{feedback.user}</p>
                        <p className="text-xs text-gray-500">{formatDate(feedback.date)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet</p>
              )}
            </div>
            
            {/* Add comment form */}
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Add a Comment
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block flex-1 rounded-l-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add your comment here..."
                />
                <button
                  type="submit"
                  disabled={submittingComment || !comment.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
                >
                  {submittingComment ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;