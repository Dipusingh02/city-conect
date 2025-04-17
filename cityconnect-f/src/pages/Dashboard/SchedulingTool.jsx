import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Calendar,
  Users,
  AlertCircle,
  CheckSquare,
  Clock,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Briefcase,
  Activity,
  Home,
  Globe,
  Truck,
  Database,
  XCircle,
  Building,
  Trash2,
  BookOpen,
  Leaf,
  Code
} from "lucide-react";

const getTaskIcon = (title, department) => {
  const lowerTitle = title.toLowerCase();
  const lowerDept = department.toLowerCase();

  if (lowerTitle.includes("traffic") || lowerDept.includes("transport")) {
    return <Truck size={24} className="mr-2 text-blue-500" />;
  }
  if (lowerTitle.includes("water") || lowerDept.includes("water supply")) {
    return <AlertCircle size={24} className="mr-2 text-blue-500" />;
  }
  if (lowerTitle.includes("fire") || lowerDept.includes("emergency")) {
    return <CheckSquare size={24} className="mr-2 text-red-500" />;
  }
  if (lowerTitle.includes("energy") || lowerTitle.includes("solar") || lowerDept.includes("energy")) {
    return <Clock size={24} className="mr-2 text-yellow-500" />;
  }
  if (lowerTitle.includes("security") || lowerDept.includes("police")) {
    return <Shield size={24} className="mr-2 text-gray-500" />;
  }
  if (lowerTitle.includes("education") || lowerDept.includes("education")) {
    return <BookOpen size={24} className="mr-2 text-green-500" />;
  }
  if (lowerTitle.includes("health") || lowerDept.includes("hospital")) {
    return <Activity size={24} className="mr-2 text-red-500" />;
  }
  if (lowerTitle.includes("housing") || lowerDept.includes("urban development")) {
    return <Home size={24} className="mr-2 text-purple-500" />;
  }
  if (lowerTitle.includes("environment") || lowerDept.includes("environment")) {
    return <Globe size={24} className="mr-2 text-green-500" />;
  }
  if (lowerTitle.includes("data") || lowerDept.includes("technology")) {
    return <Database size={24} className="mr-2 text-blue-500" />;
  }
  if (lowerDept.includes("public work")) {
    return <Building size={24} className="mr-2 text-gray-500" />;
  }
  if (lowerDept.includes("sanitation")) {
    return <Trash2 size={24} className="mr-2 text-yellow-500" />;
  }
  if (lowerDept.includes("it")) {
    return <Code size={24} className="mr-2 text-indigo-500" />;
  }

  return <ChevronDown size={24} className="mr-2 text-gray-500" />;
};

const TaskCard = ({ task, toggleTaskCompletion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const taskIcon = getTaskIcon(task.title, task.department);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {taskIcon}
          <h3 className="text-lg font-semibold ml-2">{task.title}</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            task.status === "Completed"
              ? "bg-green-100 text-green-800"
              : task.status === "In Progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {task.status}
        </span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar size={18} className="mr-2" />
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <Users size={18} className="mr-2" />
        <span>Department: {task.department}</span>
      </div>
      <div className="flex items-center mb-4">
        <button
          className="text-blue-500 text-sm flex items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide Details" : "Show Details"}
          {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>
        <button
          className={`ml-auto px-4 py-2 rounded text-sm ${task.status === "Completed" ? "bg-gray-200 text-gray-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={() => toggleTaskCompletion(task._id)}
          disabled={task.status === "Completed"}
        >
          {task.status === "Completed" ? "Completed" : "Mark as Complete"}
        </button>
      </div>
      {isExpanded && (
        <div className="text-gray-700 mb-2">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Dependencies:</strong> {task.dependencies.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

const SchedulingTool = () => {
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    department: "",
    status: "In Progress",
    dependencies: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8081/show/tasks");
      setTasks(response.data);
    } catch (error) {
      setError("Error fetching tasks");
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8081/add/tasks",
        {
          ...newTask,
          dependencies: newTask.dependencies.split(",").map(dep => dep.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTasks([...tasks, response.data.task]);
      setShowForm(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        department: "",
        status: "In Progress",
        dependencies: "",
      });
    } catch (error) {
      setError("Error creating task");
      console.error("Error creating task", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = tasks.find(task => task._id === id);
      updatedTask.status = updatedTask.status === "Completed" ? "In Progress" : "Completed";

      await axios.put(`http://localhost:8081/update/task/${id}`, { status: updatedTask.status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      setError("Error updating task");
      console.error("Error updating task", error);
    } finally {
      setLoading(false);
    }
  }, [tasks, fetchTasks, token]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Clock size={24} className="mr-2" aria-label="Clock icon" />
        Scheduling Tool
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} toggleTaskCompletion={toggleTaskCompletion} />
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition" aria-label="Create new task">
          <PlusCircle size={16} className="mr-2" />
          Create New Task
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Create New Task</h3>
              <XCircle size={24} className="cursor-pointer" onClick={() => setShowForm(false)} aria-label="Close form" />
            </div>
            <form onSubmit={handleCreateTask} className="grid gap-4">
              <input type="text" placeholder="Title" className="border p-2 rounded" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required aria-label="Task title" />
              <textarea placeholder="Description" className="border p-2 rounded" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} required aria-label="Task description" />
              <input type="date" className="border p-2 rounded" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} required aria-label="Due date" />
              <input type="text" placeholder="Department" className="border p-2 rounded" value={newTask.department} onChange={(e) => setNewTask({ ...newTask, department: e.target.value })} required aria-label="Department" />
              <input type="text" placeholder="Dependencies (comma separated)" className="border p-2 rounded" value={newTask.dependencies} onChange={(e) => setNewTask({ ...newTask, dependencies: e.target.value })} required aria-label="Dependencies" />
              <select className="border p-2 rounded" value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} aria-label="Task status">
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" aria-label="Submit task">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingTool;
