# 📝 Task Management App - Beginner DevOps Project

## Project Level: ⭐⭐ (Beginner Friendly)
**Perfect for:** After 2-3 DevOps pipelines  
**Time:** 4-6 hours total  
**Difficulty:** Easy compared to microweather  

---

## 🎯 Project Overview

A **simple but complete DevOps project** with:
- ✅ Single backend service (Node.js)
- ✅ Single database (MongoDB)
- ✅ Simple frontend (HTML/CSS/JS)
- ✅ Docker containerization
- ✅ Docker Compose for local dev
- ✅ Basic Kubernetes deployment
- ✅ Simple Jenkins pipeline
- ✅ GitHub Actions workflow
- ✅ Basic monitoring

**NO Terraform needed for this beginner project** (keeps it simple!)

---

## 📊 Project Architecture

```
┌──────────────────────────────────────────┐
│        React Frontend (Simple)           │
│   (HTML + CSS + JavaScript)              │
└──────────────┬───────────────────────────┘
               │
        ┌──────▼──────┐
        │   Docker    │
        │ Nginx Image │
        └──────┬──────┘
               │
    ┌──────────▼────────────┐
    │  Express.js Backend   │
    │   (Node.js)           │
    │                       │
    │ - GET /tasks          │
    │ - POST /tasks         │
    │ - PUT /tasks/:id      │
    │ - DELETE /tasks/:id   │
    └──────────┬────────────┘
               │
        ┌──────▼─────────┐
        │    MongoDB     │
        │   (Database)   │
        └────────────────┘

CI/CD Flow:
Code Push → GitHub → GitHub Actions → Docker Build 
→ Push to Docker Hub → Deploy to K8s/Docker Compose
```

---

## 📁 Project Structure (Super Simple!)

```
task-manager/
│
├── backend/                    [Node.js API]
│   ├── server.js              → Single file (50 lines!)
│   ├── package.json           → Dependencies
│   └── Dockerfile             → Container config
│
├── frontend/                   [Simple HTML/CSS/JS]
│   ├── index.html             → Main page
│   ├── style.css              → Styling
│   ├── script.js              → Logic (simple!)
│   └── Dockerfile             → Container config
│
├── docker-compose.yml         → Local development
│
├── kubernetes/                 [K8s manifests]
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── mongodb-deployment.yaml
│   ├── services.yaml
│   └── ingress.yaml
│
├── jenkins/                    [Jenkins pipeline]
│   └── Jenkinsfile            → Simple 5 stages
│
├── .github/workflows/         [GitHub Actions]
│   └── deploy.yml             → Auto-deploy workflow
│
└── README.md                  → Simple docs
```

---

## 📝 Step 1: Backend Setup (10 minutes)

### Create Project
```bash
mkdir task-manager
cd task-manager

# Create backend folder
mkdir backend
cd backend

# Initialize Node.js
npm init -y

# Install dependencies (only 2!)
npm install express mongoose
npm install --save-dev nodemon
```

### Create server.js (Simple!)

```javascript
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/tasks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Task Schema (Super simple)
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      completed: false
    });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Create .env

```env
MONGO_URI=mongodb://mongo:27017/tasks
PORT=3001
NODE_ENV=development
```

### Create package.json

```json
{
  "name": "task-manager-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

---

## 🎨 Step 2: Frontend Setup (15 minutes)

### Create frontend/index.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Task Manager</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>📝 Task Manager</h1>
    
    <div class="input-section">
      <input type="text" id="taskTitle" placeholder="Task title...">
      <input type="text" id="taskDesc" placeholder="Description...">
      <button onclick="addTask()">Add Task</button>
    </div>

    <div id="tasksList" class="tasks-list"></div>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

### Create frontend/style.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

button {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #5568d3;
}

.task-item {
  background: #f5f5f5;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #667eea;
}

.task-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.task-info {
  flex: 1;
}

.task-title {
  font-weight: bold;
  color: #333;
}

.task-desc {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.task-actions {
  display: flex;
  gap: 5px;
}

.task-actions button {
  padding: 5px 10px;
  font-size: 12px;
  background: #ff6b6b;
}

.task-actions button:hover {
  background: #ff5252;
}

.check-btn {
  background: #51cf66 !important;
}

.check-btn:hover {
  background: #40c057 !important;
}
```

### Create frontend/script.js

```javascript
const API_URL = 'http://localhost:3001/api/tasks';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskEl.innerHTML = `
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-desc">${task.description}</div>
        </div>
        <div class="task-actions">
          <button class="check-btn" onclick="toggleTask('${task._id}', ${!task.completed})">
            ${task.completed ? '↩️' : '✓'}
          </button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      `;
      tasksList.appendChild(taskEl);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function addTask() {
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDesc').value;
  
  if (!title.trim()) {
    alert('Please enter a task title');
    return;
  }
  
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        completed: false
      })
    });
    
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    loadTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

async function toggleTask(id, completed) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    loadTasks();
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}
```

### Create frontend/Dockerfile

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Create frontend/nginx.conf

```nginx
events {
  worker_connections 1024;
}

http {
  server {
    listen 80;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # API proxy
    location /api {
      proxy_pass http://backend:3001;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
    
    # Fallback for SPA
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

---

## 🐳 Step 3: Docker Compose (5 minutes)

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      MONGO_URI: mongodb://mongo:27017/tasks
      PORT: 3001
    depends_on:
      - mongo
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  mongo:
    image: mongo:5-alpine
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

volumes:
  mongo_data:

networks:
  app-network:
    driver: bridge
```

### Run Locally

```bash
# Build and start
docker-compose up -d

# Check
docker-compose ps

# Logs
docker-compose logs -f backend

# Stop
docker-compose down
```

---

## ☸️ Step 4: Kubernetes (10 minutes)

### Create kubernetes/namespace.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: task-manager
```

### Create kubernetes/backend-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: task-manager
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: YOUR_DOCKER_USERNAME/task-manager-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: MONGO_URI
          value: "mongodb://mongo:27017/tasks"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 10
```

### Create kubernetes/frontend-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: task-manager
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: YOUR_DOCKER_USERNAME/task-manager-frontend:latest
        ports:
        - containerPort: 80
```

### Create kubernetes/mongodb-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
  namespace: task-manager
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - name: mongo
        image: mongo:5-alpine
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongo-data
          mountPath: /data/db
      volumes:
      - name: mongo-data
        emptyDir: {}
```

### Create kubernetes/services.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: task-manager
spec:
  selector:
    app: backend
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: task-manager
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer

---
apiVersion: v1
kind: Service
metadata:
  name: mongo
  namespace: task-manager
spec:
  selector:
    app: mongo
  ports:
  - port: 27017
    targetPort: 27017
  type: ClusterIP
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Deploy all
kubectl apply -f kubernetes/

# Check
kubectl get all -n task-manager

# See frontend service
kubectl get svc -n task-manager

# Access logs
kubectl logs deployment/backend -n task-manager
```

---

## 🚀 Step 5: Jenkins Pipeline (Simple!)

### Create Jenkinsfile

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'docker build -t YOUR_USERNAME/task-manager-backend:latest ./backend'
                    sh 'docker build -t YOUR_USERNAME/task-manager-frontend:latest ./frontend'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh 'echo "Running tests..."'
                    // Add actual tests here
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    sh '''
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        docker push YOUR_USERNAME/task-manager-backend:latest
                        docker push YOUR_USERNAME/task-manager-frontend:latest
                    '''
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                script {
                    sh '''
                        kubectl set image deployment/backend backend=YOUR_USERNAME/task-manager-backend:latest -n task-manager || true
                        kubectl set image deployment/frontend frontend=YOUR_USERNAME/task-manager-frontend:latest -n task-manager || true
                    '''
                }
            }
        }
    }
}
```

---

## 📦 Step 6: GitHub Actions (Simple!)

### Create .github/workflows/deploy.yml

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push backend
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/task-manager-backend:latest
    
    - name: Build and push frontend
      uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/task-manager-frontend:latest
    
    - name: Deploy to K8s
      run: |
        kubectl set image deployment/backend backend=${{ secrets.DOCKER_USERNAME }}/task-manager-backend:latest -n task-manager || true
        kubectl set image deployment/frontend frontend=${{ secrets.DOCKER_USERNAME }}/task-manager-frontend:latest -n task-manager || true
```

---

## 📖 Complete Beginner Setup Guide

### Day 1: Local Development (1 hour)

```bash
# 1. Create project
mkdir task-manager && cd task-manager
git init

# 2. Create backend (copy code from above)
mkdir backend
# Copy server.js, package.json, Dockerfile, .env

# 3. Create frontend (copy code from above)
mkdir frontend
# Copy index.html, style.css, script.js, Dockerfile, nginx.conf

# 4. Create docker-compose.yml (copy from above)

# 5. Test locally
docker-compose up -d

# 6. Open browser
# http://localhost (your app!)
# Add some tasks, delete them, mark complete

# 7. Verify database
docker exec task-manager_mongo_1 mongosh
# db.tasks.find()
```

### Day 2: Docker & Registries (1 hour)

```bash
# 1. Create Docker Hub account (free)
# https://hub.docker.com/

# 2. Build images
docker build -t your-username/task-manager-backend:v1 ./backend
docker build -t your-username/task-manager-frontend:v1 ./frontend

# 3. Test images
docker run -p 3001:3001 your-username/task-manager-backend:v1

# 4. Push to Docker Hub
docker login
docker push your-username/task-manager-backend:v1
docker push your-username/task-manager-frontend:v1

# 5. Verify on Docker Hub
# https://hub.docker.com/r/your-username/task-manager-backend
```

### Day 3: Kubernetes Deployment (1.5 hours)

```bash
# 1. Enable Kubernetes in Docker Desktop
# Settings > Kubernetes > Enable Kubernetes

# 2. Create namespace
kubectl create namespace task-manager

# 3. Deploy
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/mongodb-deployment.yaml
kubectl apply -f kubernetes/services.yaml

# 4. Monitor
kubectl get all -n task-manager
kubectl get pods -n task-manager
kubectl logs deployment/backend -n task-manager

# 5. Access frontend
kubectl port-forward svc/frontend 8080:80 -n task-manager
# http://localhost:8080

# 6. Test adding tasks in browser
```

### Day 4: GitHub & CI/CD (1.5 hours)

```bash
# 1. Create GitHub repo
# https://github.com/new
# Name: task-manager

# 2. Push code
git add .
git commit -m "Initial commit"
git push origin main

# 3. Setup GitHub Secrets
# Settings > Secrets and variables > Actions
# Add: DOCKER_USERNAME, DOCKER_PASSWORD

# 4. Create workflows folder
mkdir -p .github/workflows
# Copy deploy.yml to .github/workflows/

# 5. Push workflow
git add .github/
git commit -m "Add GitHub Actions workflow"
git push

# 6. Monitor
# GitHub > Actions tab
# Watch workflow run automatically!

# 7. Make a change
# Edit backend/server.js or frontend/script.js
git add .
git commit -m "Update app"
git push

# 8. Watch workflow automatically:
# - Build Docker images
# - Push to Docker Hub
# - Deploy to Kubernetes
```

---

## ✅ What You'll Learn

After this beginner project, you'll know:

✅ How to structure a simple app  
✅ Frontend + Backend communication  
✅ Docker containers (basic)  
✅ Docker Compose (basic)  
✅ Kubernetes deployments (basic)  
✅ CI/CD with GitHub Actions  
✅ Docker Hub registry  
✅ Basic Jenkins pipeline  
✅ How apps are deployed  

---

## 🎯 Key Differences from MicroWeather

| Feature | Task Manager | MicroWeather |
|---------|--------------|-------------|
| Complexity | ⭐ Beginner | ⭐⭐⭐⭐⭐ Advanced |
| Services | 1 backend | 3 backends |
| Databases | 1 (MongoDB) | 2 (PostgreSQL + Redis) |
| Frontend | Simple HTML | React SPA |
| Kubernetes | Basic | Advanced |
| Terraform | None | Complete AWS |
| Monitoring | None | Prometheus + Grafana |
| Pipeline | Simple 5 stages | Complex 12 stages |
| Time to deploy | 30 min | 2+ hours |

---

## 📚 Learning Path

```
Week 1: Task Manager (This Project)
   ↓
Week 2-3: Add features to Task Manager
   - Add user authentication
   - Add database migrations
   - Add unit tests
   ↓
Week 3-4: Intermediate Project
   - Multi-service app
   - Multiple databases
   - Better monitoring
   ↓
Week 5: Advanced Project
   - Full MicroWeather
   - Terraform + AWS
   - Complete CI/CD
   - All monitoring
```

---

## 🚀 Next: Easy to Medium Difficulty Projects

After Task Manager, try:

### Project 2: Blog App (⭐⭐)
- Node.js + PostgreSQL
- Kubernetes deployment
- GitHub Actions
- Docker Compose

### Project 3: Chat Application (⭐⭐⭐)
- Multiple services (chat, user, auth)
- WebSocket integration
- Basic monitoring
- Simple Terraform

### Then: MicroWeather (⭐⭐⭐⭐⭐)
- Everything together!
- You'll find it easy after these 3!

---

## ✨ Tips for Success

1. **Start Simple**: Just get docker-compose working first
2. **Test Locally**: Before pushing to Docker Hub
3. **Small Changes**: Commit often, test each change
4. **Use Logs**: `docker logs` and `kubectl logs` are your friends
5. **Read Errors**: Error messages tell you exactly what's wrong
6. **Be Patient**: Each step takes time, that's normal
7. **Take Notes**: Write down what you learn

---

## 📋 Files You'll Create

```
task-manager/
├── backend/
│   ├── server.js (70 lines)
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── frontend/
│   ├── index.html (50 lines)
│   ├── style.css (100 lines)
│   ├── script.js (80 lines)
│   ├── nginx.conf
│   └── Dockerfile
├── kubernetes/
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── mongodb-deployment.yaml
│   └── services.yaml
├── .github/
│   └── workflows/
│       └── deploy.yml
├── Jenkinsfile
├── docker-compose.yml
└── README.md
```

**Total: ~30 simple files**  
**Code written: ~500 lines (mostly boilerplate)**  
**Learning: 100% of beginner DevOps concepts!**

---

## 🎓 You're Ready!

This is MUCH easier than MicroWeather but teaches all the same concepts:
- Docker basics
- Kubernetes basics
- Simple CI/CD
- Simple monitoring
- Basic DevOps workflow

**After completing this project 2 times, the MicroWeather project will feel easy!**

---

Ready to start? Pick **Day 1** and follow the step-by-step guide! 🚀

Good luck! You've got this! 💪
