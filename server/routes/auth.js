const express = require("express");
const router = express.Router();
const Worker = require("../models/worker.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); 

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user; 
        next();
    });
};

// Signup route for Worker
router.post("/worker/signup", async (req, res) => {
    const { name, email, password, employeeId } = req.body;
    try {
        const existingWorker = await Worker.findOne({ email });
        if (existingWorker) {
            return res.status(400).send("Worker already exists");
        }

        const saltValue = 10;
        const hashedPassword = await bcrypt.hash(password, saltValue);
        const worker = new Worker({
            name,
            email,
            password: hashedPassword,
            employeeId
        });

        await worker.save();
        res.status(201).json({ message: "Worker created successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).send("Error, worker not created");
    }
});

// Login route
router.post("/worker/login", async (req, res) => {
    try {
        const { email, password, employeeId } = req.body;
        if (!email || !password || (req.body.userType === 'department' && !employeeId)) {
            return res.status(400).send("Please fill all the fields");
        }

        const existingWorker = await Worker.findOne({ email });
        if (!existingWorker) {
            return res.status(400).send("Worker not found");
        }

        if (req.body.userType === 'department' && existingWorker.employeeId !== employeeId) {
            return res.status(400).json({ message: "Invalid Employee ID" });
        }

        const matchPassword = await bcrypt.compare(password, existingWorker.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const userId = existingWorker._id;
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: "Worker logged in successfully",
            token: accessToken,
            userId,
            name: existingWorker.name,
            employeeId: existingWorker.employeeId
        });
    } catch (error) {
        res.status(403).json({ message: "Invalid email or password", error: error.message });
    }
});

// Get All Users
router.get("/users", authenticateToken, async (req, res) => {
    try {
        const users = await Worker.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Delete User
router.delete("/users/:id", authenticateToken, async (req, res) => {
    try {
        await Worker.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});
module.exports = router;