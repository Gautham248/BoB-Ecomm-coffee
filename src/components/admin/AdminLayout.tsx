import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LayoutDashboard, Image, Layers, Package, Star, Bike, LogOut, Coffee, BookOpen } from 'lucide-react';
import './admin.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero', icon: Image },
  { to: '/admin/collections', label: 'Collections', icon: Layers },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/registry', label: 'Catalog Registry', icon: BookOpen },
  { to: '/admin/featured', label: 'Featured', icon: Star },
  { to: '/admin/movement', label: 'Movement', icon: Bike },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-white flex admin-grain">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 tracking-wide font-pangaia">
                Beans of Bodhi
              </h1>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto admin-scrollbar">
          {NAV_ITEMS.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={{ animationDelay: `${0.04 * (i + 1)}s` }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 animate-fade-in-up ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-medium border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="px-3 py-2 mb-2 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Quick Stats</p>
            <p className="text-xs text-gray-600 mt-1 font-mono">v3 · Firestore</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto admin-scrollbar">
        <div className="p-6 max-w-5xl mx-auto animate-fade-in-up">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
