import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopAppBar } from './TopAppBar';

interface StudentLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  children,
  title,
  subtitle,
  showSearch = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top app bar */}
        <TopAppBar
          onMenuClick={() => setSidebarOpen(true)}
          showSearch={showSearch}
          title={title}
          subtitle={subtitle}
        />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};
