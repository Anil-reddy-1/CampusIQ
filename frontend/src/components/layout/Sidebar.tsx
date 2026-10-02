import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  MessageSquare,
  FileText,
  Calendar,
  ClipboardList,
  Layers,
  Settings,
  Upload,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Extraction', path: '/extraction', icon: <Scan size={20} /> },
  { label: 'Chat', path: '/chat', icon: <MessageSquare size={20} /> },
  { label: 'Documents', path: '/documents', icon: <FileText size={20} /> },
  { label: 'Planner', path: '/planner', icon: <Calendar size={20} /> },
  { label: 'Quizzes', path: '/quizzes', icon: <ClipboardList size={20} /> },
  { label: 'Flashcards', path: '/flashcards', icon: <Layers size={20} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = React.useMemo(() => {
    if (profile?.role === 'admin') {
      return [
        { label: 'Admin Console', path: '/admin', icon: <Shield size={20} /> },
        ...studentNavItems,
      ];
    }
    return studentNavItems;
  }, [profile?.role]);

  const isActive = (path: string) => {
    if (path === '/' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen
          bg-surface
          shadow-[4px_0_24px_rgba(0,0,0,0.08),2px_0_6px_rgba(0,0,0,0.04)]
          w-64 z-50
          flex flex-col
          smooth-transition
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-lg font-bold">school</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-primary leading-tight">
              CampusIQ
            </h1>
            <p className="text-[11px] font-medium text-on-surface-variant tracking-wide">
              Academic Copilot
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="px-4 pb-4">
          <Link
            to="/extraction"
            className="w-full gradient-primary text-on-primary py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 smooth-transition shadow-sm hover:shadow-md"
          >
            <Upload size={16} />
            Upload Document
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-6 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                text-sm font-medium
                smooth-transition
                ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-light'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container smooth-transition"
          >
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-on-primary text-sm font-semibold shadow-sm">
              {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-on-background truncate font-medium">
                {profile?.name || 'User'}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate">
                {profile?.role === 'admin' ? 'Administrator' : (profile?.department || 'Student')}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};
