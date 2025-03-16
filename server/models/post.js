const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  workerId: mongoose.Schema.Types.ObjectId,
  workerName: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  title: String,
  author: String,
  department: String,
  content: String,
  accessLevel: String, // Public, Inter Department, Intra Department
  replies: [ReplySchema], // Array of replies
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
