# Team & Project Management System

Production-ready internal SaaS for team leaders to manage projects, attendance, leave, daily updates, and KPIs—replacing spreadsheets.

## Stack

- **Backend:** NestJS, MongoDB (Mongoose), JWT (access + refresh), bcrypt, RBAC
- **Frontend:** React 18, TypeScript, Vite, MUI (Material UI)

## Features

- **Auth:** Login, admin-created accounts, self-registration with admin approval
- **Profile:** Name, position, seniority, assigned projects (read-only for users)
- **Attendance:** Check-in / check-out, auto status (Present / Late / Half-day / Leave), admin override
- **Daily updates:** Per-project submission (completed, in progress, blockers); admin view of who submitted and blockers
- **Leave:** Request (Casual, Sick, Emergency, WFH), admin approve/reject, sync with attendance
- **Projects (Admin):** CRUD, client, type (Web/App/Both), priority, status, deadlines, documents, Figma links; assign members per role (UI/UX, Frontend, Backend, AI)
- **KPIs (Admin):** Define per role + seniority, weight %, auto/manual; auto-calculation for attendance and daily update compliance; users see only their own KPIs
- **Analytics (Admin):** Dashboard (attendance overview, project health, blockers, KPI summary), role-wise workload, filters by date/role/seniority

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # set MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm install
npm run start:dev
```

Runs at `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` with API proxy to `http://localhost:3000`.

### First admin user

From `backend/`:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=YourSecurePass ADMIN_NAME="Admin" npx ts-node scripts/create-admin.ts
```

Or use MongoDB Compass/shell to insert a user with `role: 'admin'`, `isActive: true`, and a bcrypt-hashed password.

## Environment

**Backend (`.env`):**

- `MONGODB_URI` — MongoDB connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES`
- `BCRYPT_ROUNDS`
- `PORT`, `NODE_ENV`
- `CORS_ORIGIN` (optional, default `http://localhost:5173`)

**Frontend:**

- `VITE_API_URL` — optional; default `/api` (use in dev with Vite proxy; in production set to your API base URL)

## API overview

- `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/create-user` (admin)
- `GET/PUT /users/me`, `GET /users`, `GET/PUT /users/:id`, `PUT /users/:id/approve` (admin)
- `GET/POST /projects`, `GET/PUT/DELETE /projects/:id`, `PUT /projects/:id/assignments` (admin for write)
- `POST /attendance/check-in`, `POST /attendance/check-out`, `GET /attendance/me`, `GET /attendance/admin`, `PUT /attendance/admin/:id/override` (admin)
- `POST /leave`, `GET /leave/me`, `GET /leave/admin`, `PUT /leave/admin/:id/review` (admin)
- `POST /daily-updates`, `GET /daily-updates/me`, `GET /daily-updates/admin`, `GET /daily-updates/admin/blockers`, `GET /daily-updates/admin/submission-status` (admin)
- `GET /kpi/me`, `GET/POST/PUT/DELETE /kpi`, `POST /kpi/result`, `POST /kpi/recalculate` (admin for write)
- `GET /analytics/dashboard`, `GET /analytics/workload` (admin)

All routes except login, register, refresh require `Authorization: Bearer <accessToken>`.

## Security

- Passwords hashed with bcrypt
- JWT access (short-lived) + refresh tokens
- Role-based guards (admin vs user)
- Input validation (class-validator) and DTOs
- No GPS tracking; office-based attendance only

## Project structure

```
backend/
  src/
    auth/           # JWT, login, register, create-user
    users/          # Profile, admin user list, approve
    projects/       # Projects + project assignments
    attendance/      # Check-in/out, status, admin override
    leave/          # Leave requests, admin review
    daily-updates/  # Daily updates, admin list, blockers
    kpi/            # KPI definitions, results, auto-calculation
    analytics/      # Dashboard, workload
    common/         # Enums, guards, decorators, audit schema
frontend/
  src/
    api/            # Axios client, interceptors
    contexts/       # AuthContext
    components/     # Layout (sidebar, nav)
    pages/          # Login, Register, Profile, Attendance, DailyUpdate, Leave, MyKpis
    pages/admin/    # Dashboard, Projects, Users, Attendance, DailyUpdates, Leave, Kpis
```
# team_management_system
