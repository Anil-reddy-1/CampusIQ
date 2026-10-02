import { StudentLayout } from '../../components/layout';
import { Card, Button, Badge } from '../../components/ui';
import { Plus, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export function Quizzes() {
  const mockQuizzes = [
    {
      id: '1',
      title: 'Process Scheduling Quiz',
      difficulty: 'medium',
      questionCount: 10,
      status: 'completed',
      score: 8,
      percentage: 80,
      createdAt: '2024-09-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Database Normalization',
      difficulty: 'hard',
      questionCount: 15,
      status: 'completed',
      score: 9,
      percentage: 60,
      createdAt: '2024-09-14T14:00:00Z',
    },
    {
      id: '3',
      title: 'Data Structures Basics',
      difficulty: 'easy',
      questionCount: 10,
      status: 'pending',
      createdAt: '2024-09-18T09:00:00Z',
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-headline-lg text-on-surface">Quiz Center</h1>
            <p className="text-body-md text-on-surface-variant">
              AI-generated quizzes from your study materials
            </p>
          </div>
          <Button>
            <Plus size={18} />
            Generate Quiz
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">
              Total Quizzes
            </p>
            <p className="text-headline-lg font-bold text-on-surface">12</p>
          </Card>
          <Card>
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">
              Average Score
            </p>
            <p className="text-headline-lg font-bold text-primary">75%</p>
          </Card>
          <Card>
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">
              This Week
            </p>
            <p className="text-headline-lg font-bold text-secondary">3 quizzes</p>
          </Card>
        </div>

        {/* Quizzes List */}
        <Card>
          <h2 className="font-headline-md text-on-surface mb-4">Your Quizzes</h2>
          <div className="space-y-3">
            {mockQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-label-md font-bold text-on-surface">{quiz.title}</h3>
                      <Badge
                        variant={
                          quiz.difficulty === 'easy'
                            ? 'success'
                            : quiz.difficulty === 'medium'
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-body-sm text-on-surface-variant">
                      <span>{quiz.questionCount} questions</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTimeAgo(quiz.createdAt)}
                      </span>
                    </div>
                  </div>

                  {quiz.status === 'completed' ? (
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {(quiz.percentage || 0) >= 70 ? (
                          <TrendingUp className="text-secondary" size={18} />
                        ) : (
                          <TrendingDown className="text-error" size={18} />
                        )}
                        <span className="font-headline-md font-bold text-primary">
                          {quiz.percentage}%
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant">
                        {quiz.score}/{quiz.questionCount} correct
                      </p>
                    </div>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Generate Quiz Card */}
        <Card variant="outlined" className="bg-gradient-to-br from-primary-container/10 to-secondary-container/10 border-primary-container/30">
          <div className="text-center py-6">
            <h3 className="font-headline-md text-on-surface mb-2">Ready to test yourself?</h3>
            <p className="text-body-md text-on-surface-variant mb-4">
              Generate a quiz from your uploaded documents or choose a specific topic
            </p>
            <Button>
              <Plus size={18} />
              Generate New Quiz
            </Button>
          </div>
        </Card>
      </div>
    </StudentLayout>
  );
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
