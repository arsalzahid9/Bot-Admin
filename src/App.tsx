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
import Dashboard from "./pages/Dashboard/Dashboard";
import Posts from "./pages/Post/Posts";
import Marketplaces from "./pages/Marketplace/Marketplaces";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import OtpVerification from "./pages/Auth/OtpVerification";
import ChangePassword from "./pages/Auth/ChangePassword";
import Profile from "./pages/Profile/Profile";
import { Channel } from "./pages/Channel/Channel";
import { Bot } from "./pages/Bot/Bot";
import Coupon from "./pages/Coupon/Coupon";
import FavoritePost from "./pages/FavoritePost/FavoritePost";

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
      <div className="absolute right-3 top-2">
      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
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
                      <Route path="/favorite-posts" element={<FavoritePost />} />
                      <Route path="/marketplaces" element={<Marketplaces />} />
                      <Route path="/channel" element={<Channel />} />
                      <Route path="/bot" element={<Bot />} />
                      <Route path="/coupon" element={<Coupon />} />
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
