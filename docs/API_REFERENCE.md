# CampusIQ API Reference

**Base URL:** `/api/v1`

**Authentication:** All protected routes require `Authorization: Bearer <firebase_jwt>` header

**Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Extraction](#extraction)
3. [Google Calendar](#google-calendar)
4. [Timetable Management](#timetable-management)
5. [Results Management](#results-management)
6. [Deadlines Management](#deadlines-management)
7. [Documents (RAG)](#documents-rag)
8. [AI Chat](#ai-chat)
9. [Study Planner](#study-planner)
10. [Quizzes](#quizzes)
11. [Flashcards](#flashcards)
12. [Analytics](#analytics)
13. [Admin](#admin)

---

## Authentication

### Register User Profile

**Endpoint:** `POST /auth/register`

**Purpose:** Create user profile in backend after Firebase signup

**Authentication:** Required (Firebase JWT)

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "role": "student" | "admin"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firebaseUid": "string",
    "email": "string",
    "fullName": "string",
    "role": "student",
    "status": "active",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Errors:**
- `400` - Validation error (missing fields, invalid role)
- `409` - User already exists
- `401` - Unauthorized (invalid Firebase token)

---

### Create Session

**Endpoint:** `POST /auth/session`

**Purpose:** Exchange verified Firebase token for backend session, retrieve user profile

**Authentication:** Required (Firebase JWT)

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "fullName": "string",
      "role": "student",
      "status": "active"
    },
    "sessionToken": "string"
  }
}
```

**Errors:**
- `401` - Invalid or expired token
- `404` - User profile not found (need to register first)

---

## Extraction

### Upload Document for Extraction

**Endpoint:** `POST /extraction/upload`

**Purpose:** Upload image/PDF for structured data extraction (timetable, result, exam schedule, deadline)

**Authentication:** Required

**Request:** `multipart/form-data`
```
file: File (image/jpeg, image/png, application/pdf)
documentType?: "timetable" | "result" | "exam_schedule" | "deadline" (optional, auto-detected if omitted)
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "extractionJobId": "uuid",
    "status": "pending",
    "documentType": "timetable",
    "sourceFilePath": "string",
    "createdAt": "timestamp"
  }
}
```

**Errors:**
- `400` - Invalid file format or missing file
- `413` - File too large (max 10MB)
- `401` - Unauthorized

---

### Get Extraction Job Status

**Endpoint:** `GET /extraction/:jobId`

**Purpose:** Poll extraction job status and retrieve extracted data for review

**Authentication:** Required

**Response:** `200 OK`

**Status: pending/processing**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "processing",
    "documentType": "timetable",
    "sourceFilePath": "string",
    "createdAt": "timestamp"
  }
}
```

**Status: needs_review**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "needs_review",
    "documentType": "timetable",
    "sourceFilePath": "string",
    "confidence": "high" | "medium" | "low",
    "rawExtraction": {
      "entries": [
        {
          "day_of_week": "Monday",
          "start_time": "09:00",
          "end_time": "10:00",
          "subject_name": "Data Structures",
          "location": "Room 204"
        }
      ],
      "confidence": "high"
    },
    "createdAt": "timestamp"
  }
}
```

**Status: failed**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "failed",
    "documentType": "timetable",
    "error": "string",
    "createdAt": "timestamp"
  }
}
```

**Errors:**
- `404` - Job not found
- `401` - Unauthorized or not job owner

---

### Confirm Extraction

**Endpoint:** `POST /extraction/:jobId/confirm`

**Purpose:** Confirm (optionally corrected) extracted data, persist to database, trigger Calendar sync if applicable

**Authentication:** Required

**Request Body:**

*For Timetable:*
```json
{
  "entries": [
    {
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "10:00",
      "subject_name": "Data Structures",
      "location": "Room 204"
    }
  ],
  "semester_start_date": "2024-09-01",
  "semester_end_date": "2024-12-31"
}
```

*For Result:*
```json
{
  "exam_label": "Semester 3 Internal 1",
  "subjects": [
    {
      "subject_name": "Operating Systems",
      "marks_obtained": 42,
      "max_marks": 50
    }
  ]
}
```

*For Exam Schedule:*
```json
{
  "exams": [
    {
      "subject_name": "Database Systems",
      "exam_date": "2024-11-14",
      "start_time": "10:00",
      "location": "Hall A"
    }
  ]
}
```

*For Deadline:*
```json
{
  "deadlines": [
    {
      "title": "DBMS Assignment 2",
      "due_date": "2024-09-20T23:59:00Z",
      "subject_name": "Database Systems",
      "description": "SQL queries and normalization"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Extraction confirmed and synced to calendar",
    "extractionJobId": "uuid",
    "createdRecords": 5,
    "calendarSyncTriggered": true
  }
}
```

**Errors:**
- `400` - Invalid data format or validation error
- `404` - Job not found
- `409` - Job already confirmed
- `401` - Unauthorized

---

### Reject Extraction

**Endpoint:** `POST /extraction/:jobId/reject`

**Purpose:** Discard extraction job without persisting data

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Extraction rejected"
}
```

**Errors:**
- `404` - Job not found
- `401` - Unauthorized

---

## Google Calendar

### Connect Google Calendar

**Endpoint:** `GET /calendar/connect`

**Purpose:** Start OAuth flow for Google Calendar connection

**Authentication:** Required

**Response:** `302 Redirect` to Google OAuth consent screen

**Query Parameters:**
- `redirect_uri`: Frontend callback URL (optional)

---

### OAuth Callback

**Endpoint:** `GET /calendar/callback`

**Purpose:** Handle OAuth callback, exchange code for tokens, create CampusIQ calendar

**Authentication:** Required

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: CSRF token

**Response:** `302 Redirect` to frontend settings page with success/error

---

### Disconnect Google Calendar

**Endpoint:** `DELETE /calendar/disconnect`

**Purpose:** Revoke Google Calendar connection (does not delete existing events)

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Calendar disconnected successfully"
}
```

**Errors:**
- `404` - No calendar connection found
- `401` - Unauthorized

---

### Resync Calendar

**Endpoint:** `POST /calendar/resync`

**Purpose:** Manually trigger full resync of all confirmed timetable entries and deadlines to Calendar

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "eventsCreated": 15,
    "eventsUpdated": 3,
    "eventsFailed": 0
  }
}
```

**Errors:**
- `404` - No calendar connection found
- `401` - Unauthorized

---

## Timetable Management

### List Timetable Entries

**Endpoint:** `GET /timetable`

**Purpose:** Retrieve user's confirmed timetable entries

**Authentication:** Required

**Query Parameters:**
- `semester_start_date` (optional): Filter by semester
- `day_of_week` (optional): Filter by specific day

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "dayOfWeek": "Monday",
      "startTime": "09:00",
      "endTime": "10:00",
      "subjectName": "Data Structures",
      "location": "Room 204",
      "semesterStartDate": "2024-09-01",
      "semesterEndDate": "2024-12-31",
      "calendarEventId": "google_event_id",
      "createdAt": "timestamp"
    }
  ]
}
```

---

### Update Timetable Entry

**Endpoint:** `PATCH /timetable/:id`

**Purpose:** Update a timetable entry (triggers Calendar sync update)

**Authentication:** Required

**Request Body:**
```json
{
  "startTime": "09:30",
  "location": "Room 305"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "calendarSyncTriggered": true
  }
}
```

**Errors:**
- `404` - Entry not found
- `401` - Unauthorized

---

### Delete Timetable Entry

**Endpoint:** `DELETE /timetable/:id`

**Purpose:** Delete a timetable entry (triggers Calendar event deletion)

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Timetable entry deleted"
}
```

**Errors:**
- `404` - Entry not found
- `401` - Unauthorized

---

## Results Management

### List Results

**Endpoint:** `GET /results`

**Purpose:** Retrieve user's extracted results/marksheets

**Authentication:** Required

**Query Parameters:**
- `subject_name` (optional): Filter by subject

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "examLabel": "Semester 3 Internal 1",
      "subjectName": "Operating Systems",
      "marksObtained": 42,
      "maxMarks": 50,
      "percentage": 84,
      "createdAt": "timestamp"
    }
  ]
}
```

---

### Update Result

**Endpoint:** `PATCH /results/:id`

**Purpose:** Update a result entry (manual correction)

**Authentication:** Required

**Request Body:**
```json
{
  "marksObtained": 45
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

---

### Delete Result

**Endpoint:** `DELETE /results/:id`

**Purpose:** Delete a result entry

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Result deleted"
}
```

---

## Deadlines Management

### List Deadlines

**Endpoint:** `GET /deadlines`

**Purpose:** Retrieve user's deadlines (exams, assignments)

**Authentication:** Required

**Query Parameters:**
- `type` (optional): Filter by type (exam, assignment)
- `from_date` (optional): Filter from date
- `to_date` (optional): Filter to date

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "assignment",
      "title": "DBMS Assignment 2",
      "subjectName": "Database Systems",
      "dueDate": "2024-09-20T23:59:00Z",
      "description": "SQL queries and normalization",
      "calendarEventId": "google_event_id",
      "createdAt": "timestamp"
    }
  ]
}
```

---

### Update Deadline

**Endpoint:** `PATCH /deadlines/:id`

**Purpose:** Update a deadline (triggers Calendar sync update)

**Authentication:** Required

**Request Body:**
```json
{
  "dueDate": "2024-09-25T23:59:00Z",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "calendarSyncTriggered": true
  }
}
```

---

### Delete Deadline

**Endpoint:** `DELETE /deadlines/:id`

**Purpose:** Delete a deadline (triggers Calendar event deletion)

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Deadline deleted"
}
```

---

## Documents (RAG)

### Upload Document

**Endpoint:** `POST /documents/upload`

**Purpose:** Upload document for RAG ingestion (notes, slides, syllabus) - separate from extraction

**Authentication:** Required

**Request:** `multipart/form-data`
```
file: File (pdf, pptx, docx, txt)
title?: string (optional, derived from filename if omitted)
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Operating Systems Notes",
    "fileType": "pdf",
    "status": "processing",
    "uploadedAt": "timestamp"
  }
}
```

**Errors:**
- `400` - Invalid file format
- `413` - File too large (max 25MB)
- `401` - Unauthorized

---

### Get Document Status

**Endpoint:** `GET /documents/:id/status`

**Purpose:** Check document processing status

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Operating Systems Notes",
    "status": "ready" | "processing" | "failed",
    "chunkCount": 45,
    "errorMessage": null
  }
}
```

---

### List Documents

**Endpoint:** `GET /documents`

**Purpose:** Retrieve user's uploaded documents

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status
- `file_type` (optional): Filter by file type

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Operating Systems Notes",
      "fileType": "pdf",
      "status": "ready",
      "uploadedAt": "timestamp",
      "chunkCount": 45
    }
  ]
}
```

---

### Delete Document

**Endpoint:** `DELETE /documents/:id`

**Purpose:** Delete document and its embeddings

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Document deleted"
}
```

---

### Semantic Search

**Endpoint:** `POST /search/semantic`

**Purpose:** Perform semantic search across user's documents

**Authentication:** Required

**Request Body:**
```json
{
  "query": "string",
  "topK": 5,
  "documentIds": ["uuid"] // optional, search specific documents
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "documentId": "uuid",
        "documentTitle": "Operating Systems Notes",
        "chunkContent": "string",
        "pageReference": 12,
        "similarity": 0.92
      }
    ]
  }
}
```

---

## AI Chat

### Send Chat Message

**Endpoint:** `POST /chat/message`

**Purpose:** Send message to AI assistant, receive RAG-grounded response with tool calls

**Authentication:** Required

**Request Body:**
```json
{
  "message": "string",
  "conversationId": "uuid" // optional, for multi-turn conversation
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "response": "string (markdown formatted)",
    "citations": [
      {
        "documentId": "uuid",
        "documentTitle": "Operating Systems Notes",
        "pageReference": 12,
        "snippet": "string"
      }
    ],
    "toolsUsed": ["vector_search", "extracted_timetable"],
    "suggestedActions": [
      {
        "label": "Generate quiz on this topic",
        "action": "generate_quiz",
        "params": { "topic": "Process Scheduling" }
      }
    ]
  }
}
```

**Errors:**
- `400` - Invalid request
- `429` - Rate limit exceeded
- `401` - Unauthorized

---

### Get Chat History

**Endpoint:** `GET /chat/history`

**Purpose:** Retrieve conversation history

**Authentication:** Required

**Query Parameters:**
- `conversationId` (optional): Get specific conversation
- `limit` (optional): Number of messages (default 50)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "conversationId": "uuid",
        "role": "user" | "assistant",
        "content": "string",
        "citations": [],
        "timestamp": "timestamp"
      }
    ]
  }
}
```

---

## Study Planner

### Generate Study Plan

**Endpoint:** `POST /plans/generate`

**Purpose:** Generate AI study plan grounded in extracted exam dates and timetable

**Authentication:** Required

**Request Body:**
```json
{
  "subjects": ["Database Systems", "Operating Systems"],
  "targetExamDate": "2024-11-15",
  "hoursPerDay": 3,
  "priorityTopics": ["SQL", "Process Scheduling"],
  "weakTopics": ["Normalization", "Deadlock"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Midterm Preparation Plan",
    "startDate": "2024-10-15",
    "endDate": "2024-11-15",
    "sessions": [
      {
        "id": "uuid",
        "date": "2024-10-15",
        "subject": "Database Systems",
        "topic": "SQL Queries",
        "duration": 60,
        "startTime": "14:00",
        "completed": false
      }
    ],
    "createdAt": "timestamp"
  }
}
```

**Errors:**
- `400` - Invalid input (target date in past, etc.)
- `401` - Unauthorized

---

### List Study Plans

**Endpoint:** `GET /plans`

**Purpose:** Retrieve user's study plans

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Midterm Preparation Plan",
      "startDate": "2024-10-15",
      "endDate": "2024-11-15",
      "totalSessions": 25,
      "completedSessions": 10,
      "progressPercentage": 40,
      "createdAt": "timestamp"
    }
  ]
}
```

---

### Update Study Session

**Endpoint:** `PATCH /plans/:id/sessions/:sessionId`

**Purpose:** Mark study session as complete or update session details

**Authentication:** Required

**Request Body:**
```json
{
  "completed": true,
  "actualDuration": 75,
  "notes": "Completed SQL joins practice"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "completed": true
  }
}
```

---

### Delete Study Plan

**Endpoint:** `DELETE /plans/:id`

**Purpose:** Delete study plan and associated sessions

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Study plan deleted"
}
```

---

## Quizzes

### Generate Quiz

**Endpoint:** `POST /quizzes/generate`

**Purpose:** Generate AI quiz from uploaded documents or specific topic

**Authentication:** Required

**Request Body:**
```json
{
  "documentId": "uuid", // optional if topic provided
  "topic": "Process Scheduling", // optional if documentId provided
  "difficulty": "easy" | "medium" | "hard",
  "questionCount": 10
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Process Scheduling Quiz",
    "difficulty": "medium",
    "questions": [
      {
        "id": "uuid",
        "questionText": "What is the purpose of a process scheduler?",
        "options": [
          "To allocate CPU time to processes",
          "To manage memory allocation",
          "To handle I/O operations",
          "To compile programs"
        ],
        "correctAnswer": 0 // hidden from response until submission
      }
    ],
    "createdAt": "timestamp"
  }
}
```

**Errors:**
- `400` - Invalid input (need either documentId or topic)
- `404` - Document not found
- `401` - Unauthorized

---

### Submit Quiz

**Endpoint:** `POST /quizzes/:id/submit`

**Purpose:** Submit quiz answers, receive score and explanations

**Authentication:** Required

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "uuid",
      "selectedAnswer": 0
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "quizId": "uuid",
    "score": 8,
    "totalQuestions": 10,
    "percentage": 80,
    "results": [
      {
        "questionId": "uuid",
        "questionText": "What is the purpose of a process scheduler?",
        "selectedAnswer": 0,
        "correctAnswer": 0,
        "isCorrect": true,
        "explanation": "Process schedulers allocate CPU time to processes based on scheduling algorithms."
      }
    ],
    "weakTopics": ["Deadlock Prevention"],
    "submittedAt": "timestamp"
  }
}
```

---

### List Quizzes

**Endpoint:** `GET /quizzes`

**Purpose:** Retrieve user's quiz history

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status (pending, completed)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Process Scheduling Quiz",
      "difficulty": "medium",
      "questionCount": 10,
      "status": "completed",
      "score": 8,
      "percentage": 80,
      "createdAt": "timestamp",
      "submittedAt": "timestamp"
    }
  ]
}
```

---

### Get Quiz Details

**Endpoint:** `GET /quizzes/:id`

**Purpose:** Retrieve specific quiz with questions (and answers if completed)

**Authentication:** Required

**Response:** `200 OK` - Same structure as generate quiz response, includes answers/explanations if quiz is completed

---

## Flashcards

### Generate Flashcards

**Endpoint:** `POST /flashcards/generate`

**Purpose:** Generate spaced-repetition flashcards from document or topic

**Authentication:** Required

**Request Body:**
```json
{
  "documentId": "uuid", // optional if topic provided
  "topic": "Database Normalization", // optional if documentId provided
  "cardCount": 15
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "deckId": "uuid",
    "title": "Database Normalization Flashcards",
    "cards": [
      {
        "id": "uuid",
        "front": "What is First Normal Form (1NF)?",
        "back": "A relation is in 1NF if all attributes contain only atomic values.",
        "masteryLevel": 0,
        "nextReviewDate": "2024-09-15T10:00:00Z"
      }
    ],
    "createdAt": "timestamp"
  }
}
```

---

### List Flashcard Decks

**Endpoint:** `GET /flashcards`

**Purpose:** Retrieve user's flashcard decks

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Database Normalization Flashcards",
      "cardCount": 15,
      "cardsToReview": 8,
      "masteredCards": 3,
      "createdAt": "timestamp",
      "lastReviewedAt": "timestamp"
    }
  ]
}
```

---

### Review Flashcard

**Endpoint:** `POST /flashcards/:deckId/cards/:cardId/review`

**Purpose:** Record flashcard review with self-assessment (spaced repetition)

**Authentication:** Required

**Request Body:**
```json
{
  "rating": "again" | "hard" | "good" | "easy"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "cardId": "uuid",
    "masteryLevel": 2,
    "nextReviewDate": "2024-09-18T10:00:00Z"
  }
}
```

---

### Delete Flashcard Deck

**Endpoint:** `DELETE /flashcards/:deckId`

**Purpose:** Delete flashcard deck and all cards

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Flashcard deck deleted"
}
```

---

## Analytics

### Get Dashboard Analytics

**Endpoint:** `GET /analytics/dashboard`

**Purpose:** Retrieve comprehensive analytics for student dashboard

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "studyStreak": {
      "currentStreak": 5,
      "longestStreak": 12,
      "streakDays": [true, true, true, true, true, false, false]
    },
    "weeklyStudyHours": {
      "thisWeek": 15,
      "lastWeek": 12,
      "data": [2, 3, 2, 4, 2, 1, 1]
    },
    "weakTopics": [
      {
        "topic": "Operating Systems",
        "confidence": 0.45,
        "source": "quiz_results",
        "recentScore": 40
      },
      {
        "topic": "Database Normalization",
        "confidence": 0.62,
        "source": "extracted_results",
        "recentScore": 35
      }
    ],
    "upcomingDeadlines": [
      {
        "id": "uuid",
        "title": "DBMS Assignment 2",
        "dueDate": "2024-09-20T23:59:00Z",
        "daysRemaining": 2,
        "hoursRemaining": 38
      }
    ],
    "recentExtractions": [
      {
        "id": "uuid",
        "documentType": "timetable",
        "status": "confirmed",
        "uploadedAt": "2024-09-18T10:30:00Z"
      }
    ],
    "subjectPerformance": [
      {
        "subject": "Database Systems",
        "avgQuizScore": 85,
        "extractedMarks": 42,
        "extractedMaxMarks": 50,
        "trend": "up"
      }
    ]
  }
}
```

---

## Admin

### List Users

**Endpoint:** `GET /admin/users`

**Purpose:** Retrieve all users with search and filter capabilities (admin only)

**Authentication:** Required (admin role)

**Query Parameters:**
- `search` (optional): Search by name or email
- `status` (optional): Filter by status (active, suspended)
- `role` (optional): Filter by role
- `page` (optional): Page number (default 1)
- `limit` (optional): Results per page (default 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "student@example.com",
        "fullName": "John Doe",
        "role": "student",
        "status": "active",
        "createdAt": "timestamp",
        "lastLoginAt": "timestamp"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 100,
      "perPage": 20
    }
  }
}
```

**Errors:**
- `403` - Forbidden (not admin)
- `401` - Unauthorized

---

### Update User Status

**Endpoint:** `PATCH /admin/users/:id/status`

**Purpose:** Suspend or reinstate a user account (admin only)

**Authentication:** Required (admin role)

**Request Body:**
```json
{
  "status": "active" | "suspended"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "status": "suspended",
    "updatedAt": "timestamp"
  }
}
```

**Errors:**
- `403` - Forbidden (not admin)
- `404` - User not found
- `401` - Unauthorized

---

### Get Extraction Metrics

**Endpoint:** `GET /admin/extraction-metrics`

**Purpose:** Retrieve aggregate extraction quality metrics (admin only, anonymized)

**Authentication:** Required (admin role)

**Query Parameters:**
- `from_date` (optional): Start date for metrics
- `to_date` (optional): End date for metrics

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalExtractions": 1250,
      "successfulExtractions": 1125,
      "failedExtractions": 125,
      "successRate": 90
    },
    "byDocumentType": [
      {
        "documentType": "timetable",
        "totalCount": 450,
        "successCount": 425,
        "successRate": 94.4,
        "avgConfidence": 0.88
      },
      {
        "documentType": "result",
        "totalCount": 380,
        "successCount": 340,
        "successRate": 89.5,
        "avgConfidence": 0.82
      }
    ],
    "dailyTrend": [
      {
        "date": "2024-09-15",
        "totalExtractions": 45,
        "successRate": 91
      }
    ]
  }
}
```

**Errors:**
- `403` - Forbidden (not admin)
- `401` - Unauthorized

---

### Get System Health

**Endpoint:** `GET /admin/system-health`

**Purpose:** Retrieve system health indicators (admin only)

**Authentication:** Required (admin role)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "extractionQueue": {
      "pending": 12,
      "processing": 5,
      "avgProcessingTime": 8.5
    },
    "calendarSync": {
      "failureRate": 2.1,
      "lastSyncErrors": [
        {
          "errorType": "token_refresh_failed",
          "count": 3,
          "lastOccurrence": "timestamp"
        }
      ]
    },
    "apiPerformance": {
      "avgResponseTime": 245,
      "p95ResponseTime": 890,
      "errorRate": 0.8
    },
    "database": {
      "connectionPoolUtilization": 45,
      "activeConnections": 18,
      "slowQueries": 2
    },
    "cache": {
      "hitRate": 87.5,
      "memoryUsage": 68
    }
  }
}
```

**Errors:**
- `403` - Forbidden (not admin)
- `401` - Unauthorized

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // optional, additional error context
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `VALIDATION_ERROR` - 400
- `CONFLICT` - 409
- `INTERNAL_SERVER_ERROR` - 500
- `RATE_LIMIT_EXCEEDED` - 429

---

## Rate Limiting

- **Auth endpoints:** 5 requests per minute per IP
- **Extraction upload:** 10 requests per hour per user
- **Chat message:** 30 requests per minute per user
- **General API:** 100 requests per minute per user

**Rate limit headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1631234567
```

---

## Pagination

Endpoints that return lists support pagination with these query parameters:
- `page`: Page number (default 1)
- `limit`: Items per page (default 20, max 100)

**Response includes pagination metadata:**
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "perPage": 20
  }
}
```

---

## Changelog

### v1.0.0 (2024-09-18)
- Initial API specification
- All core endpoints defined
- Authentication via Firebase JWT
- Google Calendar OAuth integration
- Extraction pipeline endpoints
- RAG document management
- AI chat with tool calling
- Study tools (planner, quiz, flashcards)
- Analytics dashboard
- Admin console endpoints

---

**End of API Reference**
