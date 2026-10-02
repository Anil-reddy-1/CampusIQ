import { useAuth } from "../context/AuthContext";
import { Dashboard } from "../pages/student/Dashboard";
import { AdminDashboard } from "../pages/admin/Dashboard";

/**
 * Renders the appropriate home page based on the user's role from the backend.
 * CampusIQ supports two roles only: student and admin.
 */
export function RoleBasedHome() {
  const { profile } = useAuth();

  switch (profile?.role) {
    case "admin":
      return <AdminDashboard />;
    case "student":
    default:
      return <Dashboard />;
  }
}
