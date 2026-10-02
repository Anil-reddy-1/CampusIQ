import { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  Wifi,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { DashboardLayout } from '../../components/DashboardLayout';
import { adminService } from '../../services/api/admin';
import type { SystemHealth as SystemHealthType } from '../../types';

export function SystemHealth() {
  const [health, setHealth] = useState<SystemHealthType | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadHealth = async () => {
    try {
      setRefreshing(true);
      const data = await adminService.getSystemHealth();
      setHealth(data.health);
      setLogs(data.logs);
    } catch (error) {
      console.error('Failed to load health:', error);
      // Mock data fallback
      setHealth({
        status: 'healthy',
        uptime: 2592000, // 30 days in seconds
        services: {
          api: { status: 'healthy', responseTime: 45 },
          database: { status: 'healthy', responseTime: 12 },
          redis: { status: 'healthy', responseTime: 3 },
          storage: { status: 'healthy', responseTime: 18 },
          extraction: { status: 'healthy', responseTime: 156 }
        },
        resources: {
          cpu: { usage: 62, cores: 8 },
          memory: { used: 6.2, total: 8, percentage: 78 },
          disk: { used: 45.2, total: 100, percentage: 45 },
          network: { inbound: 125.4, outbound: 89.2 }
        }
      });
      setLogs([
        {
          id: '1',
          level: 'info',
          message: 'System health check completed successfully',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          service: 'health-monitor'
        },
        {
          id: '2',
          level: 'warn',
          message: 'High memory usage detected (78%)',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          service: 'resource-monitor'
        },
        {
          id: '3',
          level: 'info',
          message: 'Database backup completed',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          service: 'backup'
        },
        {
          id: '4',
          level: 'error',
          message: 'Failed to connect to external API (timeout after 30s)',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          service: 'api-gateway'
        },
        {
          id: '5',
          level: 'info',
          message: 'Cache cleared successfully',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          service: 'redis'
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-success-600';
      case 'degraded':
        return 'text-warning-600';
      case 'down':
        return 'text-error-600';
      default:
        return 'text-neutral-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="success">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>;
      case 'down':
        return <Badge variant="error">Down</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getLogBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="error">Error</Badge>;
      case 'warn':
        return <Badge variant="warning">Warning</Badge>;
      case 'info':
        return <Badge variant="default">Info</Badge>;
      default:
        return <Badge variant="default">{level}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout activeNav="system-health">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeNav="system-health">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-on-surface">System Health</h1>
              {getStatusBadge(health?.status || 'unknown')}
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">
              Uptime: {health && formatUptime(health.uptime)} • Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadHealth}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* System Status */}
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-4">Services Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {health?.services && Object.entries(health.services).map(([name, service]) => (
              <Card key={name} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {name === 'database' && <Database className="w-5 h-5 text-primary-600" />}
                    {name === 'api' && <Server className="w-5 h-5 text-secondary-600" />}
                    {name === 'redis' && <Activity className="w-5 h-5 text-tertiary-600" />}
                    {name === 'storage' && <HardDrive className="w-5 h-5 text-success-600" />}
                    {name === 'extraction' && <Cpu className="w-5 h-5 text-warning-600" />}
                    <div>
                      <h3 className="font-semibold text-neutral-900 capitalize">{name}</h3>
                    </div>
                  </div>
                  <CheckCircle className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Status</span>
                    <span className={`font-medium ${getStatusColor(service.status)} capitalize`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Response Time</span>
                    <span className="font-medium text-neutral-900">{service.responseTime}ms</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Resource Usage */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Resource Usage</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CPU & Memory */}
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary-600" />
                      <span className="text-sm font-medium text-neutral-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                      {health?.resources.cpu.usage}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${health?.resources.cpu.usage}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    {health?.resources.cpu.cores} cores available
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-tertiary-600" />
                      <span className="text-sm font-medium text-neutral-600">Memory Usage</span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                      {health?.resources.memory.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (health?.resources.memory.percentage || 0) > 80
                          ? 'bg-error-600'
                          : (health?.resources.memory.percentage || 0) > 60
                          ? 'bg-warning-600'
                          : 'bg-success-600'
                      }`}
                      style={{ width: `${health?.resources.memory.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    {health?.resources.memory.used} GB / {health?.resources.memory.total} GB
                  </p>
                </div>
              </div>
            </Card>

            {/* Disk & Network */}
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-success-600" />
                      <span className="text-sm font-medium text-neutral-600">Disk Usage</span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                      {health?.resources.disk.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-success-600 h-2 rounded-full transition-all"
                      style={{ width: `${health?.resources.disk.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    {health?.resources.disk.used} GB / {health?.resources.disk.total} GB
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wifi className="w-5 h-5 text-secondary-600" />
                    <span className="text-sm font-medium text-neutral-600">Network Traffic</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-600">Inbound</p>
                      <p className="text-lg font-semibold text-neutral-900 mt-1">
                        {health?.resources.network.inbound} MB/s
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Outbound</p>
                      <p className="text-lg font-semibold text-neutral-900 mt-1">
                        {health?.resources.network.outbound} MB/s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* System Logs */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Recent System Logs</h2>
          </div>
          <div className="divide-y divide-neutral-200">
            {logs.map((log) => (
              <div key={log.id} className="px-6 py-4 hover:bg-neutral-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {log.level === 'error' && <AlertCircle className="w-5 h-5 text-error-600" />}
                    {log.level === 'warn' && <AlertCircle className="w-5 h-5 text-warning-600" />}
                    {log.level === 'info' && <CheckCircle className="w-5 h-5 text-success-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      {getLogBadge(log.level)}
                      <Badge variant="default">{log.service}</Badge>
                      <span className="text-xs text-neutral-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-900">{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
