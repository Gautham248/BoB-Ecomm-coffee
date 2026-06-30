import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

const ADMIN_KEY = 'bob-admin-auth';
const VALID_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || 'bob-admin-2026';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY);
    if (stored === VALID_TOKEN) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string): boolean => {
    if (token === VALID_TOKEN) {
      sessionStorage.setItem(ADMIN_KEY, token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// useAdminAuth depends on module-private AdminAuthContext; must live in same file
// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth(): AdminAuthContextType {
  return useContext(AdminAuthContext);
}

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to access the admin panel.</p>
          <a href="/admin/login" className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">
            Go to Login
          </a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
