import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DashboardLayout.css";

interface NavItem {
  icon: string;
  label: string;
  id: string;
  path: string;
}

const studentNavItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", id: "dashboard", path: "/" },
  { icon: "auto_fix", label: "Extraction", id: "extraction", path: "/extraction" },
  { icon: "forum", label: "Chat", id: "chat", path: "/chat" },
  { icon: "description", label: "Documents", id: "documents", path: "/documents" },
  { icon: "calendar_month", label: "Planner", id: "planner", path: "/planner" },
  { icon: "quiz", label: "Quizzes", id: "quizzes", path: "/quizzes" },
  { icon: "style", label: "Flashcards", id: "flashcards", path: "/flashcards" },
  { icon: "settings", label: "Settings", id: "settings", path: "/settings" },
];

const adminNavItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", id: "dashboard", path: "/admin" },
  { icon: "group", label: "Users", id: "users", path: "/admin/users" },
  { icon: "auto_fix", label: "Extraction", id: "extraction", path: "/admin/extractions" },
  { icon: "monitor_heart", label: "System Health", id: "system-health", path: "/admin/health" },
  { icon: "settings", label: "Settings", id: "settings", path: "/settings" },
];

const mobileNavItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", id: "dashboard", path: "/" },
  { icon: "auto_fix", label: "Extraction", id: "extraction", path: "/extraction" },
  { icon: "forum", label: "Chat", id: "chat", path: "/chat" },
  { icon: "calendar_month", label: "Planner", id: "planner", path: "/planner" },
];

interface DashboardLayoutProps {
  children: ReactNode;
  activeNav?: string;
}

export function DashboardLayout({ children, activeNav = "dashboard" }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const isAdmin = profile?.role === "admin";
  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <div className="dashboard-layout">
      {/* Sidebar (Desktop) */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div className="sidebar-brand-text">
            <h1>CampusIQ</h1>
            <p>{isAdmin ? "Admin Console" : "Academic Copilot"}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item${activeNav === item.id ? " active" : ""}`}
              type="button"
              onClick={() => navigate(item.path)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {!isAdmin && (
          <div className="sidebar-footer">
            <button className="sidebar-upload-btn" type="button">
              <span className="material-symbols-outlined">upload</span>
              Upload Document
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="sidebar-footer">
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
              <div className="top-bar-avatar">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--on-surface)" }}>
                  {profile?.name || "Admin User"}
                </div>
                <div style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>
                  System Operator
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top App Bar */}
        <header className="top-bar">
          <div className="top-bar-mobile-brand">
            <h1>CampusIQ</h1>
          </div>

          <div className="top-bar-search">
            <div className="top-bar-search-wrapper">
              <span className="material-symbols-outlined">search</span>
              <input
                className="top-bar-search-input"
                type="text"
                placeholder="Search resources, documents..."
              />
            </div>
          </div>

          <div className="top-bar-actions">
            <button className="top-bar-icon-btn" type="button" title="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="top-bar-icon-btn" type="button" title="Help">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button
              className="top-bar-avatar"
              type="button"
              title={profile?.name || "Profile"}
              onClick={logout}
            >
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="dashboard-scroll-area">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      {!isAdmin && (
        <nav className="bottom-nav">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              className={`bottom-nav-item${activeNav === item.id ? " active" : ""}`}
              type="button"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
