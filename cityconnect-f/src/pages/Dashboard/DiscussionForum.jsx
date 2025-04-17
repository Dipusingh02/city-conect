import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as necessary


const ForumPost = ({ post, onReply, onDeleteReply, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(post._id, replyText);
      setReplyText("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            post.accessLevel === "Public"
              ? "bg-green-100 text-green-800"
              : post.accessLevel === "Inter Department"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {post.accessLevel}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Users size={16} className="mr-1" />
        <span className="mr-4">
          {post.author} ({post.department})
        </span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        {isExpanded ? post.content : `${post.content.substring(0, 100)}...`}
      </p>
      <button
        className="text-blue-500 text-sm flex items-center mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show Less" : "Read More"}
        {isExpanded ? (
          <ChevronUp size={16} className="ml-1" />
        ) : (
          <ChevronDown size={16} className="ml-1" />
        )}
      </button>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Write a reply..."
          className="w-full p-2 border rounded"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleReply}
        >
          Reply
        </button>
      </div>
      <div className="space-y-2">
        {post.replies.map((reply) => (
          <div
            key={reply._id}
            className={`p-2 rounded flex justify-between items-center ${
              reply.workerId === currentUser ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <span className={reply.workerId === currentUser ? "text-blue-800" : "text-gray-800"}>
              {reply.workerName}: {reply.content}
            </span>
            <button
              className="text-red-500 text-sm"
              onClick={() => onDeleteReply(post._id, reply._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    fetch("http://localhost:8081/get/post")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handleReply = (postId, replyText) => {
    fetch(`http://localhost:8081/${postId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: replyText,
        workerName: loggedInUser // Ensure this is the correct name
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((updatedPost) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
      });
  };
  
  

  const handleDeleteReply = (postId, replyId) => {
    fetch(`http://localhost:8081/${postId}/reply/${replyId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
      });
  };

  const handleCreatePost = () => {
    fetch("http://localhost:8081/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newPost, author: loggedInUser }),
    })
      .then((res) => res.json())
      .then((newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setNewPost({ title: "", content: "" });
        setShowCreatePost(false);
      });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MessageSquare size={24} className="mr-2" /> Discussion Forum
      </h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          className="p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setShowCreatePost(!showCreatePost)}
      >
        {showCreatePost ? "Cancel" : "Create New Post"}
      </button>
      {showCreatePost && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Post Title"
            className="p-2 border rounded w-full mb-2"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Post Content"
            className="p-2 border rounded w-full"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleCreatePost}
          >
            Submit Post
          </button>
        </div>
      )}
      <div className="space-y-4">
        {posts.map((post) => (
          <ForumPost
            key={post._id}
            post={post}
            onReply={handleReply}
            onDeleteReply={handleDeleteReply}
            currentUser={loggedInUser}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum;
