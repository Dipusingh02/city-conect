const express = require("express");
const Project = require("../models/project");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Set up file filter to only accept images and documents
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

// Add media to project endpoint
router.post('/api/projects/:id/media', authenticateToken, upload.array('media', 5), async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      // Delete uploaded files if project not found
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(404).json({ message: "Project not found" });
    }

    // Create file paths to store in database
    const mediaFiles = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    console.log("Media files to be added:", mediaFiles);

    // Update project with new media
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { media: { $each: mediaFiles } } },
      { new: true }
    );

    console.log("Updated project media:", updatedProject.media);

    res.status(200).json({
      message: "Media uploaded successfully",
      media: mediaFiles
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ message: "Error uploading media", error: error.message });
  }
});

// Serve static files from uploads directory

// Other routes
router.post("/add/projects", authenticateToken, async (req, res) => {
  try {
    let {
      title,
      description,
      departments,
      location,
      status,
      startDate,
      deadline,
      budget,
      leadDepartment
    } = req.body;

    if (typeof departments === 'string') {
      departments = departments.split(',').map(dept => dept.trim());
    }
    if (!title) return res.status(400).json({ message: "Project name is required." });
    if (!description) return res.status(400).json({ message: "Project description is required." });
    if (!location) return res.status(400).json({ message: "Project location is required." });
    if (!budget) return res.status(400).json({ message: "Project budget is required." });
    if (!leadDepartment) return res.status(400).json({ message: "Lead department is required." });

    const parsedStartDate = new Date(startDate);
    const parsedDeadline = new Date(deadline);

    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ message: "Invalid start date format. Please provide a valid date." });
    }
    if (isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({ message: "Invalid deadline format. Please provide a valid date." });
    }

    const newProject = new Project({
      workerId: req.user.userId,
      title,
      description,
      departments,
      location,
      status,
      startDate: parsedStartDate,
      deadline: parsedDeadline,
      budget,
      leadDepartment
    });

    await newProject.save();
    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    res.status(400).json({ message: "Error creating project", error: error.message });
  }
});

router.get("/show/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate('workerId', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving projects", error: error.message });
  }
});

router.get("/show/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('workerId', 'name email');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving project", error: error.message });
  }
});

module.exports = router;
