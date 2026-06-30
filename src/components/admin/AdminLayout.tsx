import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LayoutDashboard, Image, Layers, Package, Star, Bike, LogOut, Coffee } from 'lucide-react';
import './admin.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero', icon: Image },
  { to: '/admin/collections', label: 'Collections', icon: Layers },
  { to: '/admin/products', label: 'Products', icon: Package },
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
    <div className="min-h-screen bg-roast-base flex admin-grain">
      <aside className="w-64 bg-roast-surface border-r border-roast-border flex flex-col shrink-0">
        <div className="p-5 border-b border-roast-border">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-copper-surface flex items-center justify-center">
              <Coffee className="w-4 h-4 text-copper" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-roast-cream tracking-wide font-pangaia">
                Beans of Bodhi
              </h1>
              <p className="text-[10px] text-roast-muted tracking-widest uppercase">Admin</p>
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
                    ? 'bg-copper-surface text-copper font-medium border border-copper/20'
                    : 'text-roast-muted hover:text-roast-cream hover:bg-roast-hover'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-roast-border">
          <div className="px-3 py-2 mb-2 rounded-lg bg-roast-card border border-roast-border/50">
            <p className="text-[10px] text-roast-muted uppercase tracking-wider">Quick Stats</p>
            <p className="text-xs text-copper mt-1 font-mono">v3 · Firestore</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-roast-muted hover:text-rust-DEFAULT hover:bg-rust-muted/10 transition-all duration-200 w-full"
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
