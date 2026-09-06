import { DashboardLayout } from "../../components/DashboardLayout";
import "./AdminDashboard.css";

/**
 * Admin Dashboard — matches the admin console stitch design.
 * Shows: Overview stats, extraction quality trends chart,
 * system health metrics, and user management table.
 */
export function AdminDashboard() {
  return (
    <DashboardLayout activeNav="dashboard">
      <div className="admin-dashboard">
        <h1 className="admin-dashboard-title">Overview</h1>

        {/* Stats Row */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Active Students</span>
              <span className="admin-stat-trend positive">
                <span className="material-symbols-outlined">trending_up</span>
                +5%
              </span>
            </div>
            <p className="admin-stat-value">12,450</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Avg. Extraction Accuracy</span>
              <span className="admin-stat-trend positive">
                <span className="material-symbols-outlined">trending_up</span>
                +2%
              </span>
            </div>
            <p className="admin-stat-value">88%</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">System Uptime</span>
              <span className="admin-stat-trend neutral">
                <span className="material-symbols-outlined">schedule</span>
                <span className="admin-stat-subtitle">Last 90 Days</span>
              </span>
            </div>
            <p className="admin-stat-value">99.9%</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Active Extraction Jobs</span>
            </div>
            <p className="admin-stat-value">342</p>
            <span className="admin-stat-subtitle">Processing</span>
          </div>
        </div>

        {/* Chart + System Health Row */}
        <div className="admin-grid">
          {/* Extraction Quality Trends */}
          <div className="admin-chart-card">
            <div className="admin-chart-header">
              <h3>Extraction Quality Trends</h3>
              <select className="admin-chart-filter">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="admin-chart-placeholder">
              <div className="chart-bars">
                <div className="chart-bar-group">
                  <div className="chart-bar primary" style={{ height: "45%" }} />
                  <div className="chart-bar secondary" style={{ height: "35%" }} />
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar primary" style={{ height: "55%" }} />
                  <div className="chart-bar secondary" style={{ height: "40%" }} />
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar primary" style={{ height: "65%" }} />
                  <div className="chart-bar secondary" style={{ height: "50%" }} />
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar primary" style={{ height: "60%" }} />
                  <div className="chart-bar secondary" style={{ height: "55%" }} />
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar primary" style={{ height: "75%" }} />
                  <div className="chart-bar secondary" style={{ height: "60%" }} />
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar primary" style={{ height: "85%" }} />
                  <div className="chart-bar secondary" style={{ height: "70%" }} />
                </div>
              </div>
            </div>
            <div className="chart-legend">
              <div className="chart-legend-item">
                <span className="chart-legend-dot primary" />
                Timetables
              </div>
              <div className="chart-legend-item">
                <span className="chart-legend-dot secondary" />
                Marks/Transcripts
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="system-health-card">
            <h3>System Health</h3>

            <div className="health-metric">
              <span className="health-metric-label">Queue Depth</span>
              <span className="health-metric-value normal">Normal</span>
            </div>

            <div className="health-metric">
              <div className="health-metric-row">
                <span className="health-metric-label">GCal Sync Success</span>
                <div className="health-progress-bar">
                  <div className="health-progress-fill" style={{ width: "94%" }} />
                </div>
              </div>
              <span className="health-metric-value">94%</span>
            </div>

            <div className="server-latency-section">
              <div className="server-latency-label">Server Latency</div>
              <div className="latency-row">
                <span className="latency-name">API Gateway</span>
                <span className="latency-value">42ms</span>
              </div>
              <div className="latency-row">
                <span className="latency-name">Extraction Engine</span>
                <span className="latency-value">850ms</span>
              </div>
              <div className="latency-row">
                <span className="latency-name">Database</span>
                <span className="latency-value">12ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="admin-users-card">
          <div className="admin-users-header">
            <h3>User Management</h3>
            <div className="admin-search-wrapper">
              <span className="material-symbols-outlined">search</span>
              <input
                className="admin-search-input"
                type="text"
                placeholder="Search students..."
              />
            </div>
          </div>

          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Eleanor Vance</td>
                  <td>e.vance@university.edu</td>
                  <td>
                    <span className="user-status active">Active</span>
                  </td>
                  <td>
                    <button className="user-action-link" type="button">
                      Metrics
                    </button>
                    <button className="user-action-link danger" type="button">
                      Suspend
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Luke Crain</td>
                  <td>l.crain@university.edu</td>
                  <td>
                    <span className="user-status suspended">Suspended</span>
                  </td>
                  <td>
                    <button className="user-action-link" type="button">
                      Metrics
                    </button>
                    <button className="user-action-link" type="button">
                      Reinstate
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Theodora Dudley</td>
                  <td>t.dudley@university.edu</td>
                  <td>
                    <span className="user-status active">Active</span>
                  </td>
                  <td>
                    <button className="user-action-link" type="button">
                      Metrics
                    </button>
                    <button className="user-action-link danger" type="button">
                      Suspend
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
