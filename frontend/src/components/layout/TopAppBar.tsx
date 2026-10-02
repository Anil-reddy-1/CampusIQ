import React, { useState } from 'react';
import { Menu, Search, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopAppBarProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onMenuClick,
  showSearch = true,
  title,
  subtitle,
}) => {
  const { profile, firebaseUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Get display name from profile or Firebase user
  const displayName = profile?.name || firebaseUser?.displayName || firebaseUser?.email || 'User';

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(148,163,184,0.07)]">
      <div className="flex items-center justify-between h-14 px-4 md:px-8">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl smooth-transition"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

          {/* Title (mobile) or Search (desktop) */}
          {title ? (
            <div className="flex flex-col">
              {subtitle && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-on-surface-variant tracking-wide uppercase">
                    {subtitle}
                  </span>
                </div>
              )}
              <h2 className="text-base font-semibold text-on-background">{title}</h2>
            </div>
          ) : showSearch ? (
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={16} />
                <input
                  type="text"
                  placeholder="Search resources, documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-container border-none rounded-full text-sm focus:ring-2 focus:ring-primary/15 focus:outline-none smooth-transition placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button className="p-2 text-on-surface-variant hover:text-primary smooth-transition rounded-xl hover:bg-surface-container relative" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>

          {/* Help */}
          <button className="p-2 text-on-surface-variant hover:text-primary smooth-transition rounded-xl hover:bg-surface-container" aria-label="Help">
            <HelpCircle size={18} />
          </button>

          {/* User avatar */}
          <button className="ml-1 w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 hover:border-primary/30 smooth-transition">
            <div className="w-full h-full gradient-primary flex items-center justify-center text-on-primary font-medium text-xs">
              {displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
