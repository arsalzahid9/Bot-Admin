// components/Header.tsx
import { LogOut } from "lucide-react";
import { Menu } from "lucide-react";
import toast from "react-hot-toast";
import { logout } from "../api/Auth/logout";
import { useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const name = localStorage.getItem("name");

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await logout();
      console.log(response);

      localStorage.removeItem("token");
      localStorage.removeItem("name");

      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white">
      <button onClick={toggleSidebar} className="text-gray-700 block md:hidden">
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 hidden md:block">
            {name ? `Welcome ${name} 👋` : "Welcome User 👋"}
          </h2>
        </div>
        <div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border border-gray-800 px-4 py-2 rounded-lg font-semibold text-lg leading-6 hover:bg-red-600 hover:text-white transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="w-6" />
    </header>
  );
};

export default Header;
