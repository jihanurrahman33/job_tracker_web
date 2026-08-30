# Job Tracker Client - Next.js Full-Stack Web Application

A modern, responsive, high-performance web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS** for tracking job applications, interview pipelines, follow-up reminders, and career search metrics.

---

## 🌟 Key Features

- 🔐 **Authentication & Session Management**:
  - Secure registration (`POST /api/v1/auth/register`) & login (`POST /api/v1/auth/login`)
  - Automatic `Authorization: Bearer <token>` & `X-Auth-Token` injection
  - User profile sync (`GET /api/v1/me`) and clean logout (`POST /api/v1/auth/logout`)
- 📋 **Applications Pipeline**:
  - **Kanban Board View**: Drag & drop or 1-click status transitions across `APPLIED`, `SCREENING`, `INTERVIEW`, `TECHNICAL_INTERVIEW`, `OFFER`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.
  - **Table View**: Sortable columns, salary formatting, search queries, location filters, date ranges, and pagination.
  - **Status Audit Timeline**: Visual log of state transitions and notes (`GET /api/v1/applications/{id}/events`).
- 📅 **Interview Scheduling**:
  - Track rounds (`PHONE_SCREEN`, `HR`, `TECHNICAL`, `BEHAVIORAL`, `SYSTEM_DESIGN`, `FINAL`, `OTHER`).
  - Meeting launcher with direct links to Zoom / Google Meet.
  - Filter upcoming vs completed rounds with duration and notes.
- ⏰ **Follow-up Reminders & Tasks**:
  - Keep track of recruiter messages, portfolio reviews, and deadlines.
  - 1-click completion toggle (`PATCH /api/v1/reminders/{id}`).
  - Overdue warning alerts and linked application badges.
- 📊 **Analytics & Conversion Funnel**:
  - Response Rate %, Interview Rate %, Offer Rate % metrics (`GET /api/v1/statistics`).
  - Multi-stage conversion funnel visualizer.
  - Interactive status distribution breakdown.
- ⚙️ **Dynamic Server Switcher & Diagnostics**:
  - Switch between live **Render**, **Vercel**, or **Localhost** deployments.
  - Built-in server health check tester (`/health`, `/ready`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
The app defaults to the live Render deployment (`https://job-tracker-server-9drb.onrender.com`). You can customize this in `.env.local`:
```env
NEXT_PUBLIC_DEFAULT_API_URL=https://job-tracker-server-9drb.onrender.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 Integrated API Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :---: | :--- |
| **Health** | `/health`, `/ready` | `GET` | Server liveness & readiness check |
| **Auth** | `/api/v1/auth/register` | `POST` | Register a new user |
| **Auth** | `/api/v1/auth/login` | `POST` | Log in & obtain bearer session token |
| **Auth** | `/api/v1/auth/logout` | `POST` | Invalidate session |
| **User** | `/api/v1/me` | `GET` | Current user profile |
| **Applications** | `/api/v1/applications` | `POST` | Create application |
| **Applications** | `/api/v1/applications` | `GET` | List & filter applications |
| **Applications** | `/api/v1/applications/{id}` | `GET` | Get single application |
| **Applications** | `/api/v1/applications/{id}` | `PATCH` | Update application details/status |
| **Applications** | `/api/v1/applications/{id}` | `DELETE` | Delete application |
| **Timeline** | `/api/v1/applications/{id}/events` | `GET` | Application history timeline |
| **Interviews** | `/api/v1/applications/{id}/interviews` | `POST` | Schedule interview |
| **Interviews** | `/api/v1/applications/{id}/interviews` | `GET` | List interviews for application |
| **Interviews** | `/api/v1/interviews/{id}` | `PATCH` | Update interview details |
| **Interviews** | `/api/v1/interviews/{id}` | `DELETE` | Remove interview |
| **Reminders** | `/api/v1/reminders` | `POST` | Create follow-up reminder |
| **Reminders** | `/api/v1/reminders` | `GET` | List user reminders |
| **Reminders** | `/api/v1/reminders/{id}` | `PATCH` | Update reminder / mark complete |
| **Reminders** | `/api/v1/reminders/{id}` | `DELETE` | Delete reminder |
| **Statistics** | `/api/v1/statistics` | `GET` | Aggregate conversion metrics |

