// frontend/script.js - Complete frontend logic

const API_URL = 'http://localhost:3001/api/tasks';

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, fetching tasks...');
  loadTasks();
  
  // Auto-refresh every 5 seconds
  setInterval(loadTasks, 5000);
});

// Load all tasks from API
async function loadTasks() {
  try {
    console.log('Fetching tasks...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tasks = await response.json();
    console.log('Tasks received:', tasks);
    
    // Clear current list
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    // Display empty message if no tasks
    if (tasks.length === 0) {
      tasksList.innerHTML = '<div style="text-align:center; color:#999; padding:20px;">No tasks yet. Add one to get started! 📝</div>';
      return;
    }
    
    // Display each task
    tasks.forEach(task => {
      const taskEl = createTaskElement(task);
      tasksList.appendChild(taskEl);
    });
    
  } catch (error) {
    console.error('Error loading tasks:', error);
    alert('Error loading tasks. Please refresh.');
  }
}

// Create HTML element for a task
function createTaskElement(task) {
  const taskEl = document.createElement('div');
  taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
  taskEl.id = `task-${task._id}`;
  
  taskEl.innerHTML = `
    <div class="task-info">
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-desc">${escapeHtml(task.description)}</div>
      <div class="task-date">${new Date(task.createdAt).toLocaleDateString()}</div>
    </div>
    <div class="task-actions">
      <button class="check-btn" onclick="toggleTask('${task._id}', ${!task.completed})" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
        ${task.completed ? '↩️ Undo' : '✓ Done'}
      </button>
      <button class="delete-btn" onclick="deleteTask('${task._id}')" title="Delete task">
        🗑️ Delete
      </button>
    </div>
  `;
  
  return taskEl;
}

// Add new task
async function addTask() {
  const titleInput = document.getElementById('taskTitle');
  const descInput = document.getElementById('taskDesc');
  
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  
  // Validation
  if (!title) {
    alert('Please enter a task title');
    titleInput.focus();
    return;
  }
  
  try {
    console.log('Adding new task:', { title, description });
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const newTask = await response.json();
    console.log('Task created:', newTask);
    
    // Clear inputs
    titleInput.value = '';
    descInput.value = '';
    titleInput.focus();
    
    // Reload tasks
    loadTasks();
    
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Error adding task. Please try again.');
  }
}

// Toggle task completion
async function toggleTask(id, completed) {
  try {
    console.log(`Toggling task ${id} to completed=${completed}`);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Task updated');
    loadTasks();
    
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Error updating task. Please try again.');
  }
}

// Delete task
async function deleteTask(id) {
  // Confirm before deleting
  if (!confirm('Are you sure you want to delete this task? This cannot be undone.')) {
    return;
  }
  
  try {
    console.log(`Deleting task ${id}`);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Task deleted');
    loadTasks();
    
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Error deleting task. Please try again.');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Allow Enter key to add task
document.addEventListener('DOMContentLoaded', () => {
  const taskTitle = document.getElementById('taskTitle');
  const taskDesc = document.getElementById('taskDesc');
  
  taskTitle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  
  taskDesc.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      addTask();
    }
  });
});
