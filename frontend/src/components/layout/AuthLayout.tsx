import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 border-b border-outline-variant/20">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-lg font-bold">school</span>
          </div>
          <span className="text-base font-semibold text-primary">
            CampusIQ
          </span>
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center text-xs text-on-surface-variant">
        <p>© 2024 CampusIQ. Your AI-powered academic copilot.</p>
      </footer>
    </div>
  );
};
