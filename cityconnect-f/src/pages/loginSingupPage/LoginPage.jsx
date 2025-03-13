import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Building2, Lock, Mail, IdCard } from "lucide-react";
import axios from "axios";

const LoginPage = () => {
  const [userType, setUserType] = useState("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = { email, password, userType };
    if (userType === "department") values.employeeId = employeeId;

    try {
      const response = await axios.post("http://localhost:8081/worker/login", values);
      console.log("Server response", response.data);
      if (response.data.token) {
        // ✅ Store token persistently
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("name", response.data.name);
        navigate("/");
      } else {
        console.error("Token is missing in the response");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">City Connect Login</h2>
          <p className="text-sm text-gray-600 mt-2">Access your account based on your role</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setUserType("citizen")}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg border ${
                userType === "citizen" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border-gray-300"
              } shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <User className="inline-block mr-2 h-5 w-5" /> Citizen
            </button>
            <button
              type="button"
              onClick={() => setUserType("department")}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg border ${
                userType === "department" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border-gray-300"
              } shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <Building2 className="inline-block mr-2 h-5 w-5" /> Department Worker
            </button>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                className="block w-full pl-10 pr-4 py-2 text-gray-700 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type="password"
                required
                className="block w-full pl-10 pr-4 py-2 text-gray-700 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {userType === "department" && (
            <div className="space-y-1">
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID</label>
              <div className="relative">
                <IdCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="employeeId"
                  type="text"
                  required
                  className="block w-full pl-10 pr-4 py-2 text-gray-700 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your Employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
