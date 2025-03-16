const express = require("express");
const Post = require("../models/post");
const router = express.Router();

// Create a new post
router.post("/create", async (req, res) => {
  try {
    const { title, author, department, content, accessLevel } = req.body;
    if (!author) {
      return res.status(400).json({ message: "Author is required" });
    }
    const newPost = new Post({ title, author, department, content, accessLevel, replies: [] });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});

// Get all posts
router.get("/get/post", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Add a reply
// Add a reply
router.post("/:postId/reply", async (req, res) => {
    try {
      const { workerName, content } = req.body;
  
      // Validate input
      if ( !workerName || !content) {
        return res.status(400).json({ message: "Worker Name, and Content are required" });
      }
  
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Add the reply
      post.replies.push({workerName, content });
      await post.save();
  
      res.json(post);
    } catch (error) {
      console.error("Error adding reply:", error); // Log the error for debugging
      res.status(500).json({ message: "Error adding reply", error: error.message });
    }
  });

// Delete a reply
router.delete("/:postId/reply/:replyId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.replies = post.replies.filter(reply => reply._id.toString() !== req.params.replyId);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error deleting reply", error });
  }
});

module.exports = router;
