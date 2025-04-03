// components/Header.tsx
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white">
      <button onClick={toggleSidebar} className="text-gray-700 block md:hidden">
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 hidden md:block">
            Welcome Hussain 👋
          </h2>
        </div>
        <div>
          <Link to="/login" className="border border-gray-800 px-2 py-2 rounded-lg font-semibold text-lg leading-6">
            Logout
          </Link>
        </div>
      </div>
      <div className="w-6" />
    </header>
  );
};

export default Header;
