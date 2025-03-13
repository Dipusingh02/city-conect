const express = require("express");
const Project = require("../models/project"); 
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
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

module.exports = router;
