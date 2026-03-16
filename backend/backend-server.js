// backend/server.js - Task Manager API
// Simple, clean, and easy to understand!

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// CORS - Allow frontend to talk to backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/tasks';
console.log('Connecting to MongoDB:', mongoUri);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// ============================================
// DATABASE SCHEMA (Super Simple!)
// ============================================

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

// ============================================
// API ROUTES
// ============================================

// 1. GET /api/tasks - Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST /api/tasks - Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    // Validate input
    if (!req.body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Create task
    const task = new Task({
      title: req.body.title,
      description: req.body.description || '',
      completed: false
    });

    // Save to database
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
      },
      { new: true } // Return updated task
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// HEALTH CHECK (Used by Kubernetes)
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'task-manager-backend'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      'GET /api/tasks': 'Get all tasks',
      'POST /api/tasks': 'Create new task',
      'PUT /api/tasks/:id': 'Update task',
      'DELETE /api/tasks/:id': 'Delete task',
      'GET /health': 'Health check'
    }
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
  ========================================
  🚀 Task Manager API Server Started
  ========================================
  
  Server running on port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  MongoDB URI: ${mongoUri}
  
  📝 API Endpoints:
  - GET  /api/tasks        (Get all tasks)
  - POST /api/tasks        (Create task)
  - PUT  /api/tasks/:id    (Update task)
  - DELETE /api/tasks/:id  (Delete task)
  - GET  /health           (Health check)
  
  ========================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});
