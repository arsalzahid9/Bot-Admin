// components/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Store, Settings as SettingsIcon, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/posts', icon: ShoppingBag, label: 'Posts' },
    { to: '/marketplaces', icon: Store, label: 'Marketplaces' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform transform md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="py-5 px-6 flex justify-between items-center md:block">
        <NavLink to="/" className="block">
          <h1 className="text-2xl font-bold text-gray-800">BOT Admin</h1>
        </NavLink>
        <button className="text-gray-600 md:hidden" onClick={onClose}>
          ✕
        </button>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
