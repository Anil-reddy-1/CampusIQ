import { StudentLayout } from '../../components/layout';
import { Card, Button, Badge } from '../../components/ui';
import { Calendar, Clock, CheckCircle, Plus } from 'lucide-react';

export function Planner() {
  const mockSessions = [
    {
      id: '1',
      date: '2024-09-18',
      subject: 'Database Systems',
      topic: 'SQL Queries',
      duration: 60,
      startTime: '14:00',
      completed: true,
    },
    {
      id: '2',
      date: '2024-09-18',
      subject: 'Operating Systems',
      topic: 'Process Scheduling',
      duration: 90,
      startTime: '16:00',
      completed: false,
    },
    {
      id: '3',
      date: '2024-09-19',
      subject: 'Database Systems',
      topic: 'Normalization',
      duration: 60,
      startTime: '14:00',
      completed: false,
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-headline-lg text-on-surface">Study Planner</h1>
            <p className="text-body-md text-on-surface-variant">
              AI-generated study plans based on your schedule and deadlines
            </p>
          </div>
          <Button>
            <Plus size={18} />
            Generate New Plan
          </Button>
        </div>

        {/* Current Plan */}
        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline-md text-on-surface">Midterm Preparation</h2>
              <p className="text-body-sm text-on-surface-variant">Oct 15 - Nov 15, 2024</p>
            </div>
            <Badge variant="info">Active</Badge>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-body-sm text-on-surface-variant mb-2">
              <span>Progress</span>
              <span>1 of 25 sessions (4%)</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: '4%' }} />
            </div>
          </div>

          {/* Sessions */}
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-xl transition-all ${
                  session.completed
                    ? 'bg-secondary-light'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={session.completed}
                    className="w-5 h-5 mt-1 rounded border-outline-variant text-primary focus:ring-primary"
                    readOnly
                  />
                  <div className="flex-1">
                    <h3 className="font-label-md font-bold text-on-surface">{session.topic}</h3>
                    <p className="text-body-sm text-on-surface-variant">{session.subject}</p>
                    <div className="flex items-center gap-4 mt-2 text-body-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {session.startTime} ({session.duration}min)
                      </span>
                    </div>
                  </div>
                  {session.completed && (
                    <CheckCircle className="text-secondary flex-shrink-0" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Info */}
        <Card variant="outlined" className="bg-surface-container-low">
          <p className="text-body-sm text-on-surface-variant">
            💡 <strong>Tip:</strong> Study plans are automatically generated based on your
            extracted exam dates, timetable, and weak topics from quiz results.
          </p>
        </Card>
      </div>
    </StudentLayout>
  );
}
