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

module.exports = router;