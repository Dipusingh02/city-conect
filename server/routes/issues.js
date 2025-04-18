const express = require("express");
const multer = require("multer");
const Issue = require("../models/issues");
const Project = require("../models/project"); // Import Project model
const path = require("path");

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// GET: Retrieve all projects for the dropdown
router.get("/projects/list", async (req, res) => {
  try {
    const projects = await Project.find({}, { _id: 1, title: 1 }); // Only get id and title
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Create a new issue
router.post("/report/issues", upload.single("attachment"), async (req, res) => {
  try {
    const { title, description, department, location, status, projectId } = req.body;
    const attachment = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Create the issue object
    const issueData = { 
      title, 
      description, 
      department, 
      location, 
      status, 
      attachment 
    };

    // If projectId is provided, add it to the issue and fetch the project name
    if (projectId && projectId !== "none") {
      issueData.project = projectId;
      
      // Get project name
      const project = await Project.findById(projectId);
      if (project) {
        issueData.projectName = project.title;
      }
    }

    const issue = new Issue(issueData);
    await issue.save();

    res.status(201).json({ message: "Issue reported successfully!", issue });
  } catch (error) {
    console.error("Error reporting issue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: Retrieve all issues
router.get("/citizen/issues", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: Retrieve issues filtered by project
router.get("/citizen/issues/by-project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const issues = await Issue.find({ project: projectId }).sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues by project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// PUT: Update issue status
router.put("/issues/:issueId/status", async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status } = req.body;
    
    if (!["Pending", "In Progress", "Resolved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId, 
      { status }, 
      { new: true }
    );
    
    if (!updatedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    res.status(200).json(updatedIssue);
  } catch (error) {
    console.error("Error updating issue status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Add comment to an issue
router.post("/issues/:issueId/comments", async (req, res) => {
  try {
    const { issueId } = req.params;
    const { user, comment } = req.body;
    
    if (!user || !comment) {
      return res.status(400).json({ error: "User and comment are required" });
    }
    
    const issue = await Issue.findById(issueId);
    
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    issue.publicFeedback.push({
      user,
      comment,
      date: new Date()
    });
    
    const updatedIssue = await issue.save();
    
    res.status(201).json(updatedIssue);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;