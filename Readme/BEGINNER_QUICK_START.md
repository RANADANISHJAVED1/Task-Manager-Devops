# 📝 Task Manager App - Quick Start (30 minutes!)

## What is This?

A **SIMPLE but COMPLETE DevOps project** perfect for beginners who want to learn:
- Docker basics
- Kubernetes basics
- Simple CI/CD
- How to deploy apps

**No microservices, no complexity - just a working app!**

---

## ⚡ 15-Minute Quick Start

### Step 1: Setup (3 minutes)
```bash
# Create project folder
mkdir task-manager
cd task-manager

# Create subfolders
mkdir backend frontend kubernetes

# Copy the code files provided:
# - backend-server.js → backend/server.js
# - frontend-script.js → frontend/script.js
# - beginner-docker-compose.yml → docker-compose.yml
```

### Step 2: Create Simple Files

**backend/package.json:**
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

**backend/.env:**
```
MONGO_URI=mongodb://mongo:27017/tasks
PORT=3001
NODE_ENV=development
```

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

**frontend/index.html:**
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
      <button onclick="addTask()">➕ Add Task</button>
    </div>

    <div id="tasksList" class="tasks-list"></div>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

**frontend/style.css:**
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial; background: #667eea; min-height: 100vh; padding: 20px; }
.container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
h1 { text-align: center; color: #333; margin-bottom: 20px; }
.input-section { display: flex; gap: 10px; margin-bottom: 20px; }
input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
button { padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; }
button:hover { background: #5568d3; }
.task-item { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; display: flex; justify-content: space-between; }
.task-item.completed { opacity: 0.6; text-decoration: line-through; }
.task-title { font-weight: bold; }
.task-desc { font-size: 12px; color: #666; margin-top: 5px; }
.task-actions { display: flex; gap: 5px; }
.task-actions button { padding: 5px 10px; font-size: 12px; background: #ff6b6b; }
.check-btn { background: #51cf66 !important; }
```

**frontend/Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf:**
```nginx
events { worker_connections 1024; }
http {
  server {
    listen 80;
    root /usr/share/nginx/html;
    location /api { proxy_pass http://backend:3001; }
    location / { try_files $uri /index.html; }
  }
}
```

### Step 3: Run It (5 minutes)
```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Open browser
# http://localhost

# Add a task, mark complete, delete - all works!
```

### Step 4: Stop (1 minute)
```bash
docker-compose down
```

---

## 📚 Directory Structure

```
task-manager/
├── backend/
│   ├── server.js        ← API code
│   ├── package.json     ← Dependencies
│   ├── .env             ← Config
│   └── Dockerfile
├── frontend/
│   ├── index.html       ← Main page
│   ├── style.css        ← Styling
│   ├── script.js        ← JavaScript
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml   ← All services
└── kubernetes/          ← (for later)
```

---

## 🐳 What Docker Compose Does

```
┌─ docker-compose up -d ────────────────────┐
│                                            │
│  Creates 3 containers:                    │
│                                            │
│  1. MongoDB (database)                    │
│  2. Backend (API - Port 3001)             │
│  3. Frontend (Website - Port 80)          │
│                                            │
│  All connected in network: app-network    │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🎯 What You're Learning

✅ **Docker**: Building and running containers  
✅ **Docker Compose**: Running multiple services  
✅ **APIs**: Frontend talking to backend  
✅ **Databases**: MongoDB storing data  
✅ **Web Development**: HTML/CSS/JavaScript  

---

## 📊 Common Commands

| Command | What it does |
|---------|-------------|
| `docker-compose up -d` | Start everything |
| `docker-compose down` | Stop everything |
| `docker-compose logs -f backend` | Watch backend logs |
| `docker-compose ps` | See running containers |
| `docker-compose exec backend sh` | Go inside backend container |
| `docker-compose build` | Rebuild images |

---

## 🔧 Troubleshooting

### Frontend shows error?
```bash
# Check backend is running
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Can't add tasks?
```bash
# Check MongoDB is running
docker-compose logs mongo

# Check network
docker network ls
```

### Port already in use?
```bash
# Stop other containers
docker-compose down

# Or use different ports in docker-compose.yml
# Change "80:80" to "8080:80"
```

---

## 🚀 Next Steps (After Task Manager)

### Week 1: Learn This Project
- Run locally with docker-compose ✅
- Understand how frontend/backend work
- Modify code and rebuild

### Week 2: Add to GitHub & Learn Docker Hub
- Create GitHub repo
- Create Docker Hub account
- Push images to Docker Hub

### Week 3: Deploy to Kubernetes
- Use kubernetes/ manifests
- Deploy to local K8s cluster
- Use kubectl commands

### Week 4: Add CI/CD
- Setup GitHub Actions
- Auto build on every push
- Auto deploy to K8s

### Then: Try Projects 2 & 3
- Blog App (similar complexity)
- Chat App (slightly harder)
- More databases, more services
- More monitoring

### Finally: MicroWeather Project
- After 3 beginner projects
- You'll find it much easier!
- Everything will click into place

---

## ✨ This Project vs MicroWeather

| Aspect | Task Manager | MicroWeather |
|--------|--------------|-------------|
| Services | 1 | 3 |
| Databases | 1 | 2 |
| Complexity | ⭐ | ⭐⭐⭐⭐⭐ |
| Time | 4-6 hours | 20+ hours |
| Learning | Foundations | Everything |

**Task Manager = Learn basics in 1 day**
**MicroWeather = Master everything in 1 week**

---

## 📝 Tips for Success

1. **Follow exactly**: Don't skip steps
2. **Test each part**: Stop and verify each stage works
3. **Read error messages**: They tell you what's wrong
4. **Use logs**: `docker-compose logs` shows everything
5. **Commit often**: Save your progress in Git
6. **Ask questions**: Google the errors you see
7. **Take notes**: Write down what you learn

---

## 🎓 By The End You'll Know

✅ How to write simple Node.js APIs  
✅ How MongoDB works  
✅ How Docker containers work  
✅ How to use docker-compose  
✅ How frontend/backend communicate  
✅ Basic DevOps workflow  

---

## 💡 Key Learning Points

1. **Backend** = Express.js server with 5 API endpoints
2. **Frontend** = HTML/CSS/JavaScript that talks to backend
3. **Database** = MongoDB stores all tasks
4. **Docker** = Packages everything in containers
5. **Compose** = Runs all services together

---

**Ready? Start with Step 1! You'll have it working in 30 minutes!** 🚀

Need help? Check BEGINNER_TASK_MANAGER.md for detailed guide!
