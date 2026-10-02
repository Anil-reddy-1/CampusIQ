// ==================== User & Auth Types ====================

export type UserRole = 'student' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  firebaseUid?: string;
  email: string;
  name?: string;
  fullName?: string;
  role: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  sessionToken: string;
}

// ==================== Extraction Types ====================

export type DocumentType = 'timetable' | 'result' | 'exam_schedule' | 'deadline' | 'notes';
export type ExtractionStatus = 'pending' | 'processing' | 'needs_review' | 'confirmed' | 'failed';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ExtractionJob {
  id: string;
  userId: string;
  status: ExtractionStatus;
  documentType: DocumentType;
  sourceFilePath: string;
  confidence?: ConfidenceLevel;
  rawExtraction?: any;
  error?: string;
  createdAt: string;
  confirmedAt?: string;
}

// Extraction Schemas
export interface TimetableEntry {
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  location?: string;
}

export interface TimetableExtraction {
  entries: TimetableEntry[];
  confidence: ConfidenceLevel;
}

export interface ResultSubject {
  subject_name: string;
  marks_obtained: number;
  max_marks: number;
}

export interface ResultExtraction {
  exam_label: string;
  subjects: ResultSubject[];
  confidence: ConfidenceLevel;
}

export interface ExamScheduleItem {
  subject_name: string;
  exam_date: string;
  start_time: string;
  location?: string;
}

export interface ExamScheduleExtraction {
  exams: ExamScheduleItem[];
  confidence: ConfidenceLevel;
}

export interface DeadlineItem {
  title: string;
  due_date: string;
  subject_name?: string;
  description?: string;
}

export interface DeadlineExtraction {
  deadlines: DeadlineItem[];
  confidence: ConfidenceLevel;
}

// Confirmed/Persisted Records
export interface TimetableRecord {
  id: string;
  userId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  location?: string;
  semesterStartDate: string;
  semesterEndDate: string;
  calendarEventId?: string;
  createdAt: string;
}

export interface ResultRecord {
  id: string;
  userId: string;
  examLabel: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  createdAt: string;
}

export interface DeadlineRecord {
  id: string;
  userId: string;
  type: 'exam' | 'assignment';
  title: string;
  subjectName?: string;
  dueDate: string;
  description?: string;
  calendarEventId?: string;
  createdAt: string;
}

// ==================== Calendar Types ====================

export interface CalendarConnection {
  id: string;
  userId: string;
  calendarId: string;
  status: 'active' | 'revoked';
  connectedAt: string;
}

export interface CalendarSyncResult {
  eventsCreated: number;
  eventsUpdated: number;
  eventsFailed: number;
}

// ==================== Document (RAG) Types ====================

export type DocumentFileType = 'pdf' | 'pptx' | 'docx' | 'txt';
export type DocumentStatus = 'processing' | 'ready' | 'failed';

export interface Document {
  id: string;
  userId: string;
  title: string;
  fileType: DocumentFileType;
  status: DocumentStatus;
  uploadedAt: string;
  chunkCount?: number;
  errorMessage?: string;
}

export interface SearchResult {
  documentId: string;
  documentTitle: string;
  chunkContent: string;
  pageReference?: number;
  similarity: number;
}

// ==================== Chat Types ====================

export type MessageRole = 'user' | 'assistant';

export interface Citation {
  documentId: string;
  documentTitle: string;
  pageReference?: number;
  snippet: string;
}

export interface SuggestedAction {
  label: string;
  action: string;
  params?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  timestamp: string;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  citations?: Citation[];
  toolsUsed?: string[];
  suggestedActions?: SuggestedAction[];
}

// ==================== Study Planner Types ====================

export interface StudySession {
  id: string;
  date: string;
  subject: string;
  topic: string;
  duration: number;
  startTime: string;
  completed: boolean;
  actualDuration?: number;
  notes?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  sessions: StudySession[];
  totalSessions?: number;
  completedSessions?: number;
  progressPercentage?: number;
  createdAt: string;
}

// ==================== Quiz Types ====================

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type QuizStatus = 'pending' | 'completed';

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer?: number; // Hidden until submission
  explanation?: string; // Shown after submission
}

export interface Quiz {
  id: string;
  userId: string;
  title: string;
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  status: QuizStatus;
  score?: number;
  percentage?: number;
  createdAt: string;
  submittedAt?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
}

export interface QuizResult {
  questionId: string;
  questionText: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmission {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  results: QuizResult[];
  weakTopics: string[];
  submittedAt: string;
}

// ==================== Flashcard Types ====================

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  masteryLevel: number;
  nextReviewDate: string;
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  title: string;
  cards: Flashcard[];
  cardCount?: number;
  cardsToReview?: number;
  masteredCards?: number;
  createdAt: string;
  lastReviewedAt?: string;
}

// ==================== Analytics Types ====================

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  streakDays: boolean[];
}

export interface WeeklyStudyHours {
  thisWeek: number;
  lastWeek: number;
  data: number[];
}

export interface WeakTopic {
  topic: string;
  confidence: number;
  source: 'quiz_results' | 'extracted_results';
  recentScore?: number;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  dueDate: string;
  daysRemaining: number;
  hoursRemaining: number;
}

export interface RecentExtraction {
  id: string;
  documentType: DocumentType;
  status: ExtractionStatus;
  uploadedAt: string;
}

export interface SubjectPerformance {
  subject: string;
  avgQuizScore?: number;
  extractedMarks?: number;
  extractedMaxMarks?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface DashboardAnalytics {
  studyStreak: StudyStreak;
  weeklyStudyHours: WeeklyStudyHours;
  weakTopics: WeakTopic[];
  upcomingDeadlines: UpcomingDeadline[];
  recentExtractions: RecentExtraction[];
  subjectPerformance: SubjectPerformance[];
}

// ==================== Admin Types ====================

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

export interface ExtractionMetrics {
  summary: {
    totalExtractions: number;
    successfulExtractions: number;
    failedExtractions: number;
    successRate: number;
  };
  byDocumentType: Array<{
    documentType: DocumentType;
    totalCount: number;
    successCount: number;
    successRate: number;
    avgConfidence: number;
  }>;
  dailyTrend: Array<{
    date: string;
    totalExtractions: number;
    successRate: number;
  }>;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  services: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'down';
      responseTime: number;
    };
  };
  resources: {
    cpu: {
      usage: number;
      cores: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    disk: {
      used: number;
      total: number;
      percentage: number;
    };
    network: {
      inbound: number;
      outbound: number;
    };
  };
  extractionQueue?: {
    pending: number;
    processing: number;
    avgProcessingTime: number;
  };
  calendarSync?: {
    failureRate: number;
    lastSyncErrors: Array<{
      errorType: string;
      count: number;
      lastOccurrence: string;
    }>;
  };
  apiPerformance?: {
    avgResponseTime: number;
    p95ResponseTime: number;
    errorRate: number;
  };
  database?: {
    connectionPoolUtilization: number;
    activeConnections: number;
    slowQueries: number;
  };
  cache?: {
    hitRate: number;
    memoryUsage: number;
  };
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalExtractions: number;
  extractionsToday: number;
  avgProcessingTime: number;
  systemHealth: number;
  storageUsed: number;
  apiCalls24h: number;
}

export interface ExtractionMetrics {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  avgProcessingTime: number;
  avgConfidenceScore: number;
  totalPages: number;
  totalDocuments: number;
}

// ==================== API Response Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: Pagination;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
