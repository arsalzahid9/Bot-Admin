// components/Header.tsx
import { Menu } from "lucide-react";
import toast from "react-hot-toast";
import { logout } from "../api/Auth/logout";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  // Get user name from localStorage
  const name = localStorage.getItem("name"); // Assuming 'userName' is the key where the user's name is stored

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response);

      // Clear token from localStorage on logout
      localStorage.removeItem("token");
      localStorage.removeItem("name");

      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
            {/* Display user's name in the header */}
            {name ? `Welcome ${name} 👋` : "Welcome User 👋"}
          </h2>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="border border-gray-800 px-2 py-2 rounded-lg font-semibold text-lg leading-6 hover:bg-red-600 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-6" />
    </header>
  );
};

export default Header;
