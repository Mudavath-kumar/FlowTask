# FlowTask — Full-Stack SaaS Task Management & Analytics Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

**FlowTask** is a production-grade full-stack SaaS task management and productivity analytics application. Built with **React 18 (Vite)**, **Node.js/Express**, and **MongoDB Atlas**, it delivers a minimal, responsive experience with instant Dark/Light theme switching, real-time filtering, multi-field sorting, pagination, and visual Recharts analytics.

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
* 🛡️ **Defensive UX & Feedback**:
  * Non-intrusive Toast notification feedback for actions (create, edit, delete, status toggle).
  * Confirmation dialog modals before destructive actions.
  * Skeleton loading screens and helpful empty states.
* ⚡ **Optimized for Cloudflare Pages & Render**:
  * Single Page Application (SPA) routing configuration (`_redirects` & `_headers`) for Cloudflare Pages.
  * Compound MongoDB database indexing (`user + status`, `user + priority`, `user + dueDate`) for fast queries.

---

## 📐 Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│             React + Vite (Cloudflare Pages)            │
│       Pages: Login, Signup, Dashboard, Tasks, Analytics │
│          Contexts: AuthContext, ThemeContext            │
│          Axios Client with Token Interceptor            │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP / REST (Bearer JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express.js REST API (Render)             │
│        Routes: /api/auth/*, /api/tasks/*               │
│        Middleware: Auth (JWT), ErrorHandler            │
│        Controllers: authController, taskController     │
└───────────────────────────┬────────────────────────────┘
                            │  Mongoose ODM (with Compound Indexes)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  MongoDB Atlas Cluster                 │
│              Collections: users, tasks                 │
└────────────────────────────────────────────────────────┘
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
│   │   └── generateToken.js      # JWT signing utility
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   │   ├── _redirects            # Cloudflare Pages SPA 200 rewrite rule
│   │   └── _headers              # Security headers for Cloudflare Pages
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

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Update `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start backend:
```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```
Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start frontend:
```bash
npm run dev
# Frontend live at http://localhost:5173
```

---

## 📖 API Documentation

### Base URL: `/api`

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

## ☁️ Deployment Guide

### 1. Deploy Frontend to **Cloudflare Pages**
1. Push this repository to GitHub (`https://github.com/Mudavath-kumar/FlowTask.git`).
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Workers & Pages** ➔ **Create Application** ➔ **Pages** ➔ **Connect to Git**.
3. Select the `FlowTask` repository.
4. Configure Build Settings:
   * **Framework preset**: `Vite` (or `None`)
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
   * **Root directory (Advanced)**: `frontend`
5. Under **Environment variables**, add:
   * `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
6. Click **Save and Deploy**.
   *(The included `frontend/public/_redirects` file automatically handles single-page app route rewrites).*

### 2. Deploy Backend to **Render**
1. Log in to [Render](https://render.com) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository `FlowTask`.
3. Configure Service:
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Add Environment Variables:
   * `PORT`: `5000`
   * `MONGO_URI`: `your_mongodb_atlas_connection_string`
   * `JWT_SECRET`: `your_secure_secret_key`
   * `NODE_ENV`: `production`
   * `CLIENT_URL`: `https://your-flowtask.pages.dev` (Your Cloudflare Pages domain)
5. Click **Create Web Service**.

### 3. MongoDB Atlas Database Access
* In your MongoDB Atlas dashboard, navigate to **Network Access** and ensure your IP (or `0.0.0.0/0`) is whitelisted for incoming traffic from Render.

---

## 📜 License
Open-source under the [ISC License](LICENSE).
