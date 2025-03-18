// IssueReportList.js

import React, { useEffect, useState } from "react";
import axios from "axios";

import { Users, MapPin, Calendar, AlertCircle } from "lucide-react"; // Import icons as needed

const IssueCard = ({ title, department, location, status, description, createdAt }) => {
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
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("https://city-conect.onrender.com/citizen/issues");
        setIssues(response.data);
      } catch (err) {
        console.error("Error fetching issues:", err);
        setError("Failed to load issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reported Issues</h2>
      {issues.length === 0 ? (
        <div>No issues reported yet.</div>
      ) : (
        issues.map((issue) => (
          <IssueCard
            key={issue._id}
            title={issue.title}
            departments={[issue.department]} // Assuming department is a string
            location={issue.location}
            status={issue.status}
            deadline={issue.createdAt} // Assuming createdAt is the deadline
            description={issue.description}
          />
        ))
      )}
    </div>
  );
};

export default IssuesReport
