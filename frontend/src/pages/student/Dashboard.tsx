import { DashboardLayout } from "../../components/DashboardLayout";
import "./StudentDashboard.css";

/**
 * Student Dashboard — matches the stitch design asset exactly.
 * Shows: Calendar banner, upcoming week classes, urgent deadline,
 * learning analytics (streak + weak topics), and recent extractions.
 */
export function StudentDashboard() {
  return (
    <DashboardLayout activeNav="dashboard">
      <div className="student-dashboard">
        {/* Calendar Connection Banner */}
        <div className="calendar-banner">
          <div className="calendar-banner-bg-icon">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
          <div className="calendar-banner-text">
            <h2>Sync Your Academic Life</h2>
            <p>
              Connect Google Calendar to automatically track extractions,
              deadlines, and study sessions.
            </p>
          </div>
          <button className="calendar-banner-btn" type="button">
            <span className="material-symbols-outlined">sync</span>
            Connect Google Calendar
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-col">
            {/* Upcoming Week */}
            <div className="section-card">
              <div className="section-header">
                <h3>Upcoming Week</h3>
                <button className="section-header-link" type="button">
                  View Timetable
                </button>
              </div>
              <div className="class-list">
                {/* Class 1 */}
                <div className="class-item">
                  <div className="class-item-date">
                    <span className="class-item-date-day">MON</span>
                    <span className="class-item-date-num">12</span>
                  </div>
                  <div className="class-item-info">
                    <div className="class-item-top">
                      <div>
                        <h4 className="class-item-name">
                          Database Management Systems
                        </h4>
                        <p className="class-item-detail">
                          <span className="material-symbols-outlined">
                            schedule
                          </span>
                          10:00 AM - 11:30 AM
                        </p>
                      </div>
                      <span className="class-item-type">LECTURE</span>
                    </div>
                    <p className="class-item-detail">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      Room 402, CS Block
                    </p>
                  </div>
                </div>

                {/* Class 2 */}
                <div className="class-item">
                  <div className="class-item-date">
                    <span className="class-item-date-day">MON</span>
                    <span className="class-item-date-num">12</span>
                  </div>
                  <div className="class-item-info">
                    <div className="class-item-top">
                      <div>
                        <h4 className="class-item-name">Operating Systems</h4>
                        <p className="class-item-detail">
                          <span className="material-symbols-outlined">
                            schedule
                          </span>
                          1:00 PM - 3:00 PM
                        </p>
                      </div>
                      <span className="class-item-type">LAB</span>
                    </div>
                    <p className="class-item-detail">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      Lab 3, IT Block
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgent Deadline */}
            <div className="urgent-deadline-card">
              <div className="urgent-deadline-header">
                <span className="material-symbols-outlined">warning</span>
                <h3>Urgent Deadline</h3>
              </div>
              <div className="urgent-deadline-body">
                <div className="urgent-deadline-info">
                  <h4>DBMS Assignment 2</h4>
                  <p>SQL Queries &amp; Normalization</p>
                </div>
                <div className="urgent-deadline-countdown">
                  <div className="countdown-box">
                    <span className="countdown-box-value">02</span>
                    <span className="countdown-box-label">DAYS</span>
                  </div>
                  <div className="countdown-box">
                    <span className="countdown-box-value">14</span>
                    <span className="countdown-box-label">HOURS</span>
                  </div>
                </div>
              </div>
              <div className="urgent-deadline-footer">
                <button type="button">Start Flashcards</button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-col">
            {/* Learning Analytics */}
            <div className="section-card">
              <div className="section-header">
                <h3>Learning Analytics</h3>
              </div>

              {/* Study Streak */}
              <div className="analytics-streak">
                <div className="analytics-streak-header">
                  <span className="analytics-streak-label">Study Streak</span>
                  <span className="analytics-streak-value">5 Days</span>
                </div>
                <div className="analytics-streak-bars">
                  <div className="streak-bar active" />
                  <div className="streak-bar active" />
                  <div className="streak-bar active" />
                  <div className="streak-bar active" />
                  <div className="streak-bar active" />
                  <div className="streak-bar" />
                  <div className="streak-bar" />
                </div>
              </div>

              {/* Weak Topics */}
              <div>
                <div className="weak-topics-label">Weak Topics to Review</div>
                <div className="weak-topics-chips">
                  <span className="weak-topic-chip critical">
                    <span className="material-symbols-outlined">
                      trending_down
                    </span>
                    Operating Systems
                  </span>
                  <span className="weak-topic-chip warning">
                    <span className="material-symbols-outlined">
                      trending_flat
                    </span>
                    Data Structures
                  </span>
                  <span className="weak-topic-chip neutral">
                    Computer Networks
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Extractions */}
            <div className="section-card">
              <div className="section-header">
                <h3>Recent Extractions</h3>
                <button className="section-header-link" type="button">
                  View All
                </button>
              </div>
              <div className="extraction-list">
                {/* Extraction 1 */}
                <div className="extraction-item">
                  <div className="extraction-item-left">
                    <div className="extraction-item-icon">
                      <span className="material-symbols-outlined">
                        table_chart
                      </span>
                    </div>
                    <div>
                      <p className="extraction-item-name">
                        Fall 2024 Timetable
                      </p>
                      <p className="extraction-item-time">Uploaded 2h ago</p>
                    </div>
                  </div>
                  <span className="status-badge confirmed">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    Confirmed
                  </span>
                </div>

                {/* Extraction 2 */}
                <div className="extraction-item needs-review">
                  <div className="extraction-item-left">
                    <div className="extraction-item-icon">
                      <span className="material-symbols-outlined">
                        receipt_long
                      </span>
                    </div>
                    <div>
                      <p className="extraction-item-name">Midterm Results</p>
                      <p className="extraction-item-time">Uploaded 1d ago</p>
                    </div>
                  </div>
                  <span className="status-badge needs-review">
                    <span className="material-symbols-outlined">error</span>
                    Needs Review
                  </span>
                </div>

                {/* Extraction 3 */}
                <div className="extraction-item">
                  <div className="extraction-item-left">
                    <div className="extraction-item-icon">
                      <span className="material-symbols-outlined">
                        event_note
                      </span>
                    </div>
                    <div>
                      <p className="extraction-item-name">Finals Date-sheet</p>
                      <p className="extraction-item-time">Uploaded 3d ago</p>
                    </div>
                  </div>
                  <span className="status-badge confirmed">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
