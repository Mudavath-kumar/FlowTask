# FlowTask — Full-Stack SaaS Task Management & Analytics Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)

**FlowTask** is a production-grade full-stack SaaS task management and productivity analytics application. Built with **React 18 (Vite)**, **Node.js/Express**, and **MongoDB Atlas**, it delivers a minimal, responsive experience with instant Dark/Light theme switching, real-time filtering, multi-field sorting, pagination, visual Recharts analytics, and an **automated Keep-Alive health system** to prevent Render free instances from sleeping.

---

## 🌟 Major Features

* 🔐 **Secure Authentication**:
  * JWT (JSON Web Token) authentication with 30-day persistence.
  * `bcryptjs` password hashing with salted rounds.
  * Protected routes, input validation, and sanitized JSON responses (`password` never exposed).
* 🎨 **Minimal SaaS Design System**:
  * Native CSS Variables with instant Light and Dark mode switching.
  * Clean typography (Inter font), card elevation, compact status & priority badges.
  * Fully responsive mobile drawer and desktop sidebar navigation.
* 📋 **Task Management (Full CRUD)**:
  * Create, view, edit, and delete tasks.
  * Instant status toggle (`Todo` ➔ `In Progress` ➔ `Done`).
  * Priority indicators (`Low`, `Medium`, `High`) with visual badges.
  * Due date tracking with formatted calendar badges.
* 🔍 **Real-Time Search & Multi-Filter**:
  * Case-insensitive regex title search.
  * Filter simultaneously by Status and Priority.
  * Multi-field sorting (by Due Date, Priority, or Creation Date in ascending/descending order).
  * Server-side pagination with dynamic page controls.
* 📊 **Productivity Analytics & Visual Charts**:
  * Live KPI metric cards (Total Tasks, Completed, Pending, and Completion Rate %).
  * **Recharts Status Distribution** bar chart.
  * **Recharts Priority Breakdown** pie/donut chart.
* 🛡️ **Anti-Sleep / Keep-Alive System**:
  * Built-in automated self-pinging background cron targeting `/api/health` every 14 minutes to prevent Render free-tier sleep mode.
* ⚡ **Unified Full-Stack Deployment**:
  * Can be deployed as a **single unified service** (Frontend + Backend bundled) on Render with 1 click!

---

## 📐 Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│             React + Vite Frontend (SPA)                │
│       Pages: Login, Signup, Dashboard, Tasks, Analytics │
│          Contexts: AuthContext, ThemeContext            │
│          Axios Client with Token Interceptor            │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP / REST (Bearer JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express.js REST API (Render)             │
│        Routes: /api/auth/*, /api/tasks/*               │
│        Health & Anti-Sleep Cron: /api/health           │
│        Controllers: authController, taskController     │
│        Static React Build Delivery (in Production)     │
└───────────────────────────┬────────────────────────────┘
                            │  Mongoose ODM (Compound Indexes)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  MongoDB Atlas Cluster                 │
│              Collections: users, tasks                 │
└────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

```text
FlowTask/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # Signup, Login, Me handlers
│   │   └── taskController.js     # Task CRUD, filters, pagination, analytics
│   ├── middleware/
│   │   ├── authMiddleware.js     # Bearer token verification
│   │   └── errorMiddleware.js    # Global error & 404 handlers
│   ├── models/
│   │   ├── User.js               # User schema & password hashing hook
│   │   └── Task.js               # Task schema with compound indexes
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   └── taskRoutes.js         # /api/tasks endpoints
│   ├── utils/
│   │   ├── generateToken.js      # JWT signing utility
│   │   └── keepAlive.js          # Automated 14-min self-ping to prevent Render sleep
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point & static file server
├── frontend/
│   ├── public/
│   │   ├── _redirects            # SPA 200 rewrite rule
│   │   └── _headers              # Security headers
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Centralized Axios instance & interceptors
│   │   ├── components/           # Navbar, Sidebar, TaskCard, Modals, Toast, StatCard
│   │   ├── context/              # AuthContext, ThemeContext
│   │   ├── pages/                # Login, Signup, Dashboard, Tasks, Analytics
│   │   ├── services/             # authService, taskService
│   │   ├── styles/
│   │   │   └── index.css         # Complete SaaS design system & CSS tokens
│   │   ├── App.jsx               # Protected routes & Layout wrapper
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── package.json                  # Root monorepo orchestration script for Render
├── PRD.txt
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Mudavath-kumar/FlowTask.git
cd FlowTask
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers
* In terminal 1 (Backend): `npm run dev:backend`
* In terminal 2 (Frontend): `npm run dev:frontend`

---

## 📖 API Documentation

### Base URL: `/api`

### Health & Monitoring

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Returns server uptime & prevents Render sleep mode |

### Authentication Endpoints

| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Public | Register new account | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/auth/login` | Public | Authenticate user & receive JWT | `{ "email": "...", "password": "..." }` |
| `GET` | `/auth/me` | Private | Retrieve current user profile | Header: `Authorization: Bearer <token>` |

### Task Endpoints

| Method | Endpoint | Access | Description | Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Private | List tasks with filters & pagination | Query: `search`, `status`, `priority`, `sort`, `order`, `page`, `limit` |
| `POST` | `/tasks` | Private | Create a task | Body: `{ "title": "...", "description": "...", "status": "...", "priority": "...", "dueDate": "..." }` |
| `GET` | `/tasks/:id` | Private | Get single task details | Path param: `id` |
| `PUT` | `/tasks/:id` | Private | Update full task | Path param: `id`, Body: Task fields |
| `PATCH` | `/tasks/:id/status` | Private | Quick update status | Path param: `id`, Body: `{ "status": "Done" }` |
| `DELETE` | `/tasks/:id` | Private | Delete a task | Path param: `id` |
| `GET` | `/tasks/analytics` | Private | Retrieve productivity metrics | Header: `Authorization: Bearer <token>` |

---

## 🚀 Deploying the Whole Project to Render (1-Click Unified Full-Stack)

You can deploy the **entire application** (Frontend + Backend together in one single Web Service) on Render:

1. Log in to [Render](https://render.com) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository **`Mudavath-kumar/FlowTask`**.
3. Configure the Web Service:
   * **Name**: `flowtask`
   * **Root Directory**: *(Leave empty / root)*
   * **Environment**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
4. Add Environment Variables:
   * `PORT`: `5000`
   * `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?appName=Cluster0`
   * `JWT_SECRET`: `your_secure_jwt_secret_key`
   * `NODE_ENV`: `production`
5. Click **Create Web Service**.

Render will install dependencies, compile the React Vite production bundle, start the Express server with static React delivery, and activate the built-in **Keep-Alive ping** at `https://<your-app>.onrender.com/api/health` to keep your instance awake 24/7!

---

## 💤 How the Anti-Sleep / Keep-Alive System Works

1. In production, `backend/utils/keepAlive.js` automatically starts a background timer.
2. Every **14 minutes**, it sends an HTTP/HTTPS GET request to `/api/health`.
3. Because Render checks for activity every 15 minutes, this periodic self-ping resets Render's idle counter and keeps the server active.
4. **Optional External Monitor**: You can also add your `/api/health` URL (e.g. `https://your-app.onrender.com/api/health`) to a free uptime tool like [UptimeRobot](https://uptimerobot.com) or [Cron-Job.org](https://cron-job.org) for 100% external guarantee.

---

## 📜 License
Open-source under the [ISC License](LICENSE).
