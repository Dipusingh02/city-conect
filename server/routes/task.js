const express = require("express");
const Task = require("../models/task");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// Create a new task
router.post("/add/tasks", authenticateToken, async (req, res) => {
    try {
        let {
            title,
            description,
            dueDate,
            department,
            status,
            dependencies
        } = req.body;

        if (!title) return res.status(400).json({ message: "Task title is required." });
        if (!description) return res.status(400).json({ message: "Task description is required." });
        if (!department) return res.status(400).json({ message: "Department is required." });

        if (typeof dependencies === 'string') {
            dependencies = dependencies.split(',').map(dep => dep.trim());
        }

        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ message: "Invalid due date format. Please provide a valid date." });
        }

        const newTask = new Task({
            workerId: req.user.userId,
            title,
            description,
            dueDate: parsedDueDate,
            department,
            status: status || "In Progress",
            dependencies
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(400).json({ message: "Error creating task", error: error.message });
    }
});

// Fetch all tasks
router.get("/show/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().populate('workerId', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tasks", error: error.message });
    }
});

// Update task status
router.put("/update/task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: "Task status is required." });

        const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedTask) return res.status(404).json({ message: "Task not found." });

        res.json({ message: "Task status updated successfully", task: updatedTask });
    } catch (error) {
        res.status(400).json({ message: "Error updating task", error: error.message });
    }
});

module.exports = router;
