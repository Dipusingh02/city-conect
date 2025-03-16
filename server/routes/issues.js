const express = require("express");
const multer = require("multer");
const Issue = require("../models/issues");
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

// POST: Create a new issue
router.post("/report/issues", upload.single("attachment"), async (req, res) => {
  try {
    const { title, description, department, location, status } = req.body;
    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    const issue = new Issue({ title, description, department, location, status, attachment });
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

module.exports = router;
