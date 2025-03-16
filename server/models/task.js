const mongoose = require("mongoose");

// Task Schema
const TaskSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required: true
    },
    title: {
        type: String,
        required: [true, "Please enter the task name"]
    },
    description: {
        type: String,
        required: [true, "Please enter the task description"]
    },
    department: {
        type: String,
        required: [true, "Please enter the department involved in the task"]
    },
    dependencies: {
        type: [String],
        required: [true, "Please enter dependencies involved in the task"]
    },
    status: {
        type: String,
        enum: ["In Progress", "Completed", "Planning", "Delayed"],
        default: "Planning"
    },
    dueDate: {
        type: Date,
        required: [true, "Please enter the task due date"]
    },
    createdDatetime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Task", TaskSchema);
