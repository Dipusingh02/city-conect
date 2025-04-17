const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectCode: {
        type: String,
        required: true,
        unique: true // Example: "TRF-001", "WST-002"
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required: true
    },
    title: {
        type: String,
        required: [true, "Please enter the project name"]
    },
    objective: {
        type: String,
        required: [true, "Please enter the project objective"]
    },
    description: {
        type: String,
        required: [true, "Please enter the project description"]
    },
    scopeOfWork: {
        type: String
    },
    technologiesUsed: {
        type: [String],
        default: []
    },
    departments: {
        type: [String],
        required: true
    },
    leadDepartment: {
        type: String,
        required: [true, "Please enter the lead department"]
    },
    status: {
        type: String,
        enum: ["Planned", "In Progress", "Completed", "Delayed"],
        default: "Planned"
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    milestones: [
        {
            title: String,
            completed: {
                type: Boolean,
                default: false
            },
            date: Date
        }
    ],
    progressPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    budget: {
        total: {
            type: Number,
            required: true
        },
        utilized: {
            type: Number,
            default: 0
        }
    },
    challenges: {
        type: String
    },
    impact: {
        type: String
    },
    contactPerson: {
        name: String,
        position: String,
        phone: String,
        email: String
    },
    media: {
        type: [String], // URLs or filenames
        default: []
    },
    publicFeedback: [
        {
            user: String,
            comment: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdDatetime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Project", projectSchema);
