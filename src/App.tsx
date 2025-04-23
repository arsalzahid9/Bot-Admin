// App.tsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Marketplaces from "./pages/Marketplaces";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set a timer to remove the token and notify the user after 1 hour
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const timer = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        toast.error("Your session has expired, please log in again.");
        window.location.href = "/login"; // Redirect to login screen
      }, 3600000); // 1 hour = 3600000 milliseconds

      // Clean up the timer when the component is unmounted
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Check if user has token in localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="flex h-screen bg-gray-100 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <div className="flex-1 flex flex-col overflow-auto">
                  <Header toggleSidebar={toggleSidebar} />
                  <div className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/posts" element={<Posts />} />
                      <Route path="/marketplaces" element={<Marketplaces />} />
                      <Route path="/profile" element={<Profile />}/>
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
