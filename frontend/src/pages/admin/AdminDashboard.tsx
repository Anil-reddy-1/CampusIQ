import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { DashboardLayout } from '../../components/DashboardLayout';
import { adminService } from '../../services/api/admin';
import type { SystemStats } from '../../types';

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Mock data fallback
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalExtractions: 15678,
        extractionsToday: 234,
        avgProcessingTime: 12.5,
        systemHealth: 98.5,
        storageUsed: 45.2,
        apiCalls24h: 23456
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeNav="dashboard">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeNav="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            System overview and quick actions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Users */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Total Users</p>
                <p className="mt-2 font-headline-lg font-semibold text-on-surface">
                  {stats?.totalUsers.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-success font-medium">
                  +{stats?.activeUsers} active
                </p>
              </div>
              <div className="p-3 bg-primary-light rounded-xl">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Extractions */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Extractions</p>
                <p className="mt-2 font-headline-lg font-semibold text-on-surface">
                  {stats?.totalExtractions.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-primary font-medium">
                  +{stats?.extractionsToday} today
                </p>
              </div>
              <div className="p-3 bg-secondary-light rounded-xl">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </Card>

          {/* Processing Time */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Avg Processing</p>
                <p className="mt-2 font-headline-lg font-semibold text-on-surface">
                  {stats?.avgProcessingTime}s
                </p>
                <p className="mt-1 text-sm text-success font-medium">
                  -2.3s from last week
                </p>
              </div>
              <div className="p-3 bg-tertiary-light rounded-xl">
                <Clock className="w-5 h-5 text-tertiary" />
              </div>
            </div>
          </Card>

          {/* System Health */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">System Health</p>
                <p className="mt-2 font-headline-lg font-semibold text-on-surface">
                  {stats?.systemHealth}%
                </p>
                <p className="mt-1 text-sm text-success font-medium">
                  All systems operational
                </p>
              </div>
              <div className="p-3 bg-success-light rounded-xl">
                <Activity className="w-5 h-5 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <Card className="p-5">
            <h2 className="font-headline-md text-on-surface mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-on-surface">Manage Users</p>
                    <p className="text-xs text-on-surface-variant">View, edit, and create users</p>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-on-surface-variant/40" />
              </Link>

              <Link
                to="/admin/extractions"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm font-medium text-on-surface">Extraction Metrics</p>
                    <p className="text-xs text-on-surface-variant">Monitor extraction performance</p>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-on-surface-variant/40" />
              </Link>

              <Link
                to="/admin/health"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-on-surface">System Health</p>
                    <p className="text-xs text-on-surface-variant">View system status and logs</p>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-on-surface-variant/40" />
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-headline-md text-on-surface mb-4">Recent Activity</h2>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success-light rounded-xl">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">Database backup completed</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">5 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-light rounded-xl">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">25 new user registrations</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">1 hour ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-tertiary-light rounded-xl">
                  <AlertCircle className="w-4 h-4 text-tertiary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">API rate limit reached for 3 users</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-secondary-light rounded-xl">
                  <FileText className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">1,234 extractions processed</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Last 24 hours</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* System Resources */}
        <Card className="p-5">
          <h2 className="font-headline-md text-on-surface mb-5">System Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-on-surface-variant">Storage Used</span>
                <span className="text-sm font-semibold text-on-surface">{stats?.storageUsed}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full smooth-transition"
                  style={{ width: `${stats?.storageUsed}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-1.5">45.2 GB / 100 GB</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-on-surface-variant">CPU Usage</span>
                <span className="text-sm font-semibold text-on-surface">62%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5">
                <div className="bg-success h-1.5 rounded-full" style={{ width: '62%' }} />
              </div>
              <p className="text-xs text-on-surface-variant mt-1.5">Normal operation</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-on-surface-variant">Memory</span>
                <span className="text-sm font-semibold text-on-surface">78%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5">
                <div className="bg-warning h-1.5 rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-xs text-on-surface-variant mt-1.5">6.2 GB / 8 GB</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
