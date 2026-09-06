# CampusIQ — Development Progress Memory

> **Purpose:** Track all progress, decisions, and milestones across development sessions.  
> **Last Updated:** 2026-09-05

---

## Project Overview

| Field | Value |
|---|---|
| **Product** | CampusIQ — Student-Focused Academic Copilot |
| **Roles** | Student, Admin (NO faculty role) |
| **Frontend** | React 19 + Vite + TypeScript + Vanilla CSS |
| **Backend** | Node.js + Express |
| **Auth** | Firebase Auth |
| **Database** | PostgreSQL + pgvector |
| **Cache** | Redis |
| **AI** | Gemini Vision (extraction) + Gemini LLM (chat/planning/quiz) |
| **Calendar** | Google Calendar API (OAuth) |
| **Deployment** | Docker Compose |

---

## Design System

- **Design Source:** Stitch assets (HTML + PNG) at `stitch_assets/`
- **Color Palette:** Material 3 tokens — primary `#003fb1`, secondary `#006c4a`, surface `#f9f9ff`, error `#ba1a1a`
- **Font:** Inter (headings + body), JetBrains Mono (code)
- **Icons:** Material Symbols Outlined
- **Layout:** Sidebar nav (desktop) + bottom nav (mobile), 12-col grid dashboard

---

## Completed Milestones

### Phase 1 — Auth & App Shell ✅
- [x] Firebase Auth integration (email/password + Google)
- [x] Login, Signup, Forgot Password pages
- [x] Backend user sync (`POST /api/users/sync`)
- [x] Protected routes with role-based gating
- [x] Basic Navbar + role badges
- [x] Docker Compose setup (frontend, backend, postgres, redis)

### Phase (current) — Faculty Removal + Dashboard Build
- [x] Removed faculty role from all frontend code
- [x] Removed faculty role from all backend code
- [x] Created DashboardLayout (sidebar + bottom nav + top bar)
- [x] Built Student Dashboard matching stitch design
- [x] Built Admin Dashboard matching stitch design
- [x] Added design token system (CSS variables)
- [x] Locked admin role — only assignable via `scripts/seed-admin.js`
- [x] Created admin seed script (`npm run seed:admin`)

---

## Key Design Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | No faculty role at all | PRD v3.0 specifies only Student + Admin. Faculty was out of scope. |
| D2 | Vanilla CSS, not Tailwind | Project was initialized without Tailwind; stitch assets converted to vanilla CSS. |
| D3 | Material Symbols Outlined (CDN) | Matches stitch designs; loaded via Google Fonts CDN link in index.html. |
| D4 | Sidebar layout for dashboard pages | Matches stitch desktop design; hides on mobile with bottom nav instead. |
| D5 | Mock/static data in dashboards | Dashboards show hardcoded demo data; will connect to APIs in later phases. |
| D6 | Admin only via seed script | Admin role cannot be assigned through signup, login, or any API. Only `node scripts/seed-admin.js <firebase_uid> <email> <name>` works. This prevents privilege escalation. |

---

## Current Status

- **Active Phase:** Phase 2 — Extraction Pipeline (upcoming)
- **Blockers:** None
- **Next Steps:**
  1. Build Extraction Upload & Review page (the most critical screen per PRD)
  2. Google Calendar OAuth + sync
  3. Extend extraction to results/marksheets
  4. RAG ingestion + Agentic chat

---

## Pages Inventory

| Page | Status | Desktop | Mobile |
|---|---|---|---|
| Login | ✅ Done | ✅ | ✅ |
| Signup | ✅ Done | ✅ | ✅ |
| Forgot Password | ✅ Done | ✅ | ✅ |
| Student Dashboard | ✅ Done | ✅ | ✅ |
| Admin Dashboard | ✅ Done | ✅ | ✅ |
| Extraction Upload & Review | 🔲 Pending | — | — |
| AI Chat | 🔲 Pending | — | — |
| Documents / Knowledge Base | 🔲 Pending | — | — |
| Study Planner | 🔲 Pending | — | — |
| Quiz Center | 🔲 Pending | — | — |
| Flashcards | 🔲 Pending | — | — |
| Settings | 🔲 Pending | — | — |

---

## Open Items / Questions

1. Retention policy for raw uploaded images/PDFs after extraction confirmed
2. Whether handwritten timetables are in scope for v1
3. Whether Admin support-access exception is needed
4. Handling multiple timetables per student
5. Semester-end behavior for Calendar events
6. Non-Calendar fallback for students who decline OAuth
