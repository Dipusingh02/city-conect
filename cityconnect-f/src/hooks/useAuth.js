import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("name");
    if (userName) {
      setLoggedInUser(userName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clears all auth-related data
    setLoggedInUser(null);
    navigate("/login");
  };

  return { loggedInUser, handleLogout };
};

export default useAuth;
