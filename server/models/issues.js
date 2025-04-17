const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Resolved", "Rejected"], 
    default: "Pending" 
  },
  attachment: { type: String }, // Will store file URL
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project",
    required: false // Optional, as some issues might not be related to specific projects
  },
  projectName: { type: String }, // Store the project name for easy display
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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", issueSchema);
