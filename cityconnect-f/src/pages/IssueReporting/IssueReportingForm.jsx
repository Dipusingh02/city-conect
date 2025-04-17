import React, { useState, useEffect } from "react";
import axios from "axios";

const Alert = ({ variant, title, description }) => (
  <div
    className={`p-3 sm:p-4 rounded-md ${
      variant === "error"
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    <h3 className="text-sm font-medium">{title}</h3>
    <div className="mt-2 text-sm">{description}</div>
  </div>
);

const IssueReportingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    status: "Pending",
    attachment: null,
    projectId: "none",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8081/projects/list");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "attachment" && val) {
        formDataToSend.append("attachment", val);
      } else {
        formDataToSend.append(key, val);
      }
    });

    try {
      await axios.post("http://localhost:8081/report/issues", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitStatus("success");
      setFormData({
        title: "",
        description: "",
        department: "",
        location: "",
        status: "Pending",
        attachment: null,
        projectId: "none",
      });
    } catch (error) {
      console.error("Error submitting issue:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-md sm:max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={input}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className={input}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className={input}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={input}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Related Project</label>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className={input}
          >
            <option value="none">None</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Attachment (optional)</label>
          <input
            type="file"
            name="attachment"
            onChange={handleChange}
            className={input}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-sm ${
            isSubmitting
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {submitStatus === "success" && (
        <Alert
          variant="success"
          title="Success"
          description="Your issue has been successfully submitted."
        />
      )}
      {submitStatus === "error" && (
        <Alert
          variant="error"
          title="Error"
          description="An error occurred while submitting your issue. Please try again."
        />
      )}
    </div>
  );
};

export default IssueReportingForm;

// Tailwind class for input reuse
const input = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
