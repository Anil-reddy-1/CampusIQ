import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentLayout } from '../../components/layout';
import { Card, Badge, Button, Spinner } from '../../components/ui';
import {
  Calendar,
  Clock,
  MapPin,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { analyticsApi } from '../../services/api';
import type { DashboardAnalytics } from '../../types';

export function Dashboard() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getDashboard();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Use mock data for development
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </StudentLayout>
    );
  }

  if (error && !analytics) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-on-surface-variant">Failed to load dashboard</p>
          <Button onClick={loadAnalytics} className="mt-4">
            Try Again
          </Button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Calendar Connection Banner */}
        <Card
          variant="glass"
          className="gradient-primary p-6 relative overflow-hidden border-0"
        >
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">calendar_today</span>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="font-headline-md font-semibold text-on-primary mb-1">
                Sync Your Academic Life
              </h2>
              <p className="text-body-md text-white opacity-90">
                Connect Google Calendar to automatically track extractions, deadlines, and study
                sessions.
              </p>
            </div>
            <Link to="/settings">
              <Button variant="secondary" size="lg">
                <Calendar size={18} />
                Connect Google Calendar
              </Button>
            </Link>
          </div>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upcoming Week & Deadlines */}
          <div className="lg:col-span-7 space-y-6">
            {/* Upcoming Week */}
            <Card variant="default" className="card-hover">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-on-surface font-semibold">
                  Upcoming Week
                </h3>
                <Link to="/planner" className="text-primary text-sm hover:opacity-80 smooth-transition font-medium">
                  View Timetable →
                </Link>
              </div>

              <div className="space-y-3">
                {getMockClasses().map((classItem, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container smooth-transition cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary flex-shrink-0">
                      <span className="font-label-md font-bold text-xs">{classItem.dayShort}</span>
                      <span className="font-headline-md text-lg">{classItem.date}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-label-md font-semibold text-on-surface">
                            {classItem.subject}
                          </h4>
                          <p className="font-body-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                            <Clock size={14} />
                            {classItem.time}
                          </p>
                        </div>
                        <Badge size="sm" variant="neutral">
                          {classItem.type}
                        </Badge>
                      </div>
                      <p className="font-body-sm text-on-surface-variant flex items-center gap-1.5">
                        <MapPin size={14} />
                        {classItem.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Urgent Deadline */}
            <Card className="bg-tertiary-light card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-tertiary/10">
                  <AlertTriangle className="text-tertiary" size={24} />
                </div>
                <h3 className="font-headline-md text-on-surface font-semibold">
                  Urgent Deadline
                </h3>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-label-md font-bold text-on-surface text-lg">
                    DBMS Assignment 2
                  </h4>
                  <p className="font-body-md text-on-surface-variant mt-1">
                    SQL Queries & Normalization
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-surface-container-low shadow-sm">
                    <span className="font-headline-md font-bold text-error text-xl">02</span>
                    <span className="font-label-sm text-outline text-[10px]">DAYS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-surface-container-low shadow-sm">
                    <span className="font-headline-md font-bold text-error text-xl">14</span>
                    <span className="font-label-sm text-outline text-[10px]">HOURS</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link to="/flashcards">
                  <Button variant="outline" size="md">
                    Start Flashcards
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column: Analytics & Extractions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Learning Analytics */}
            <Card variant="default" className="card-hover">
              <h3 className="font-headline-md text-on-surface mb-5 font-semibold">
                Learning Analytics
              </h3>

              {/* Study Streak */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                  <h4 className="font-label-sm text-outline tracking-wide">
                    STUDY STREAK
                  </h4>
                  <span className="font-headline-md font-bold text-secondary text-xl">
                    {analytics?.studyStreak.currentStreak || 5} Days
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {(analytics?.studyStreak.streakDays || [
                    true,
                    true,
                    true,
                    true,
                    true,
                    false,
                    false,
                  ]).map((active, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full smooth-transition ${
                        active ? 'bg-secondary shadow-sm' : 'bg-surface-variant'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Weak Topics */}
              <div>
                <h4 className="font-label-sm text-outline tracking-wide mb-4">
                  WEAK TOPICS TO REVIEW
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(analytics?.weakTopics || getMockWeakTopics()).map((topic, index) => (
                    <Badge
                      key={index}
                      variant={
                        topic.confidence < 0.5
                          ? 'error'
                          : topic.confidence < 0.7
                          ? 'warning'
                          : 'neutral'
                      }
                      className="flex items-center gap-1.5"
                    >
                      {topic.confidence < 0.5 ? (
                        <TrendingDown size={12} />
                      ) : topic.confidence < 0.7 ? (
                        <Minus size={12} />
                      ) : (
                        <TrendingUp size={12} />
                      )}
                      {topic.topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Extractions */}
            <Card variant="default" className="card-hover">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-headline-md text-on-surface font-semibold">
                  Recent Extractions
                </h3>
                <Link to="/extraction" className="text-primary text-sm hover:opacity-80 smooth-transition font-medium">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {(analytics?.recentExtractions || getMockExtractions()).map((extraction) => (
                  <div
                    key={extraction.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low smooth-transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary-light text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          {getExtractionIcon(extraction.documentType)}
                        </span>
                      </div>
                      <div>
                        <p className="font-label-md text-on-surface font-semibold">
                          {getExtractionTitle(extraction.documentType)}
                        </p>
                        <p className="font-body-sm text-on-surface-variant">
                          {formatTimeAgo(extraction.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        extraction.status === 'confirmed'
                          ? 'success'
                          : extraction.status === 'needs_review'
                          ? 'warning'
                          : 'neutral'
                      }
                      className="flex items-center gap-1"
                    >
                      {extraction.status === 'confirmed' ? (
                        <>
                          <CheckCircle size={12} />
                          Confirmed
                        </>
                      ) : extraction.status === 'needs_review' ? (
                        <>
                          <AlertCircle size={12} />
                          Review
                        </>
                      ) : (
                        'Processing'
                      )}
                    </Badge>
                  </div>
                ))}
              </div>

              <Link to="/extraction">
                <Button variant="outline" fullWidth className="mt-5" size="md">
                  <Upload size={18} />
                  Upload New Document
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

// Mock data helpers
function getMockAnalytics(): DashboardAnalytics {
  return {
    studyStreak: {
      currentStreak: 5,
      longestStreak: 12,
      streakDays: [true, true, true, true, true, false, false],
    },
    weeklyStudyHours: {
      thisWeek: 15,
      lastWeek: 12,
      data: [2, 3, 2, 4, 2, 1, 1],
    },
    weakTopics: getMockWeakTopics(),
    upcomingDeadlines: [],
    recentExtractions: getMockExtractions(),
    subjectPerformance: [],
  };
}

function getMockWeakTopics() {
  return [
    { topic: 'Operating Systems', confidence: 0.45, source: 'quiz_results' as const, recentScore: 40 },
    { topic: 'Data Structures', confidence: 0.62, source: 'extracted_results' as const, recentScore: 62 },
    { topic: 'Computer Networks', confidence: 0.75, source: 'quiz_results' as const },
  ];
}

function getMockExtractions() {
  return [
    {
      id: '1',
      documentType: 'timetable' as const,
      status: 'confirmed' as const,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      documentType: 'result' as const,
      status: 'needs_review' as const,
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      documentType: 'exam_schedule' as const,
      status: 'confirmed' as const,
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function getMockClasses() {
  return [
    {
      dayShort: 'MON',
      date: '12',
      subject: 'Database Management Systems',
      time: '10:00 AM - 11:30 AM',
      type: 'LECTURE',
      location: 'Room 402, CS Block',
    },
    {
      dayShort: 'MON',
      date: '12',
      subject: 'Operating Systems',
      time: '1:00 PM - 3:00 PM',
      type: 'LAB',
      location: 'Lab 3, IT Block',
    },
  ];
}

function getExtractionIcon(type: string) {
  switch (type) {
    case 'timetable':
      return 'table_chart';
    case 'result':
      return 'receipt_long';
    case 'exam_schedule':
      return 'event_note';
    case 'deadline':
      return 'assignment';
    default:
      return 'description';
  }
}

function getExtractionTitle(type: string) {
  switch (type) {
    case 'timetable':
      return 'Fall 2024 Timetable';
    case 'result':
      return 'Midterm Results';
    case 'exam_schedule':
      return 'Finals Date-sheet';
    case 'deadline':
      return 'Assignment Deadline';
    default:
      return 'Document';
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
