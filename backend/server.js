require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const startKeepAlive = require('./utils/keepAlive');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.RENDER_EXTERNAL_URL,
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server self-requests, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      } else {
        return callback(null, true); // Allow client domain or fallback
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (for keep-alive cron & monitoring)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'FlowTask server is alive and active.',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// If Frontend dist build exists, serve static React files (for unified single-service Render deployment)
const frontendDistPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    // If request starts with /api, pass to error handler
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Base route fallback when running backend independently
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'FlowTask API is running smoothly.',
      version: '1.0.0',
    });
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FlowTask Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Start KeepAlive self-ping in production or when URL is set
  if (process.env.NODE_ENV === 'production' || process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL) {
    startKeepAlive();
  }
});
