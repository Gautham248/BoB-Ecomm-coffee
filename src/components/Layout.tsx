import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen w-full bg-white ${className}`}>
      <div className="max-w-full mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;