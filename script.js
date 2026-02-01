// Application state
const state = {
  tasks: [],
  theme: 'light',
  language: 'en'
};

// Translations
const translations = {
  en: {
    appTitle: 'DT Planner',
    addTask: 'Add Task',
    taskPlaceholder: 'Enter a new task...',
    noTasks: 'No tasks yet. Add your first task!',
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    totalTasks: 'Total Tasks',
    completed: 'Completed',
    notCompleted: 'Not Completed',
    notMarked: 'Not Marked',
    todayProgress: "Today's Progress",
    clearAll: 'Clear All',
    confirmClear: 'Are you sure you want to clear all tasks?',
    yes: 'Yes',
    no: 'No',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    markCompleted: 'Mark as completed',
    markNotCompleted: 'Mark as not completed',
    markNotMarked: 'Mark as not marked',
    deleteTask: 'Delete task',
    emptyDashboard: 'Add tasks to see statistics',
    of: 'of',
    tasksCompleted: 'tasks completed'
  },
  ru: {
    appTitle: 'DT Planner',
    addTask: 'Добавить задачу',
    taskPlaceholder: 'Введите новую задачу...',
    noTasks: 'Задач пока нет. Добавьте первую задачу!',
    dashboard: 'Панель',
    tasks: 'Задачи',
    totalTasks: 'Всего задач',
    completed: 'Выполнено',
    notCompleted: 'Не выполнено',
    notMarked: 'Не отмечено',
    todayProgress: 'Прогресс за сегодня',
    clearAll: 'Очистить все',
    confirmClear: 'Вы уверены, что хотите удалить все задачи?',
    yes: 'Да',
    no: 'Нет',
    lightMode: 'Светлая тема',
    darkMode: 'Тёмная тема',
    markCompleted: 'Отметить как выполнено',
    markNotCompleted: 'Отметить как не выполнено',
    markNotMarked: 'Отметить как не отмечено',
    deleteTask: 'Удалить задачу',
    emptyDashboard: 'Добавьте задачи для отображения статистики',
    of: 'из',
    tasksCompleted: 'задач выполнено'
  },
  uz: {
    appTitle: 'DT Planner',
    addTask: "Vazifa qo'shish",
    taskPlaceholder: 'Yangi vazifa kiriting...',
    noTasks: "Hali vazifalar yo'q. Birinchi vazifangizni qo'shing!",
    dashboard: 'Boshqaruv paneli',
    tasks: 'Vazifalar',
    totalTasks: 'Jami vazifalar',
    completed: 'Bajarildi',
    notCompleted: 'Bajarilmadi',
    notMarked: 'Belgilanmagan',
    todayProgress: 'Bugungi taraqqiyot',
    clearAll: 'Hammasini tozalash',
    confirmClear: 'Barcha vazifalarni o\'chirishni xohlaysizmi?',
    yes: 'Ha',
    no: "Yo'q",
    lightMode: "Yorug' rejim",
    darkMode: "Qorong'u rejim",
    markCompleted: 'Bajarilgan deb belgilash',
    markNotCompleted: 'Bajarilmagan deb belgilash',
    markNotMarked: 'Belgilanmagan deb belgilash',
    deleteTask: "Vazifani o'chirish",
    emptyDashboard: "Statistikani ko'rish uchun vazifalar qo'shing",
    of: 'dan',
    tasksCompleted: 'vazifa bajarildi'
  }
};

// DOM Elements
const DOM = {
  // Theme and language
  themeToggle: document.getElementById('themeToggle'),
  langButtons: document.querySelectorAll('.lang-btn'),
  
  // Task elements
  taskList: document.getElementById('taskList'),
  taskCount: document.getElementById('taskCount'),
  newTaskInput: document.getElementById('newTaskInput'),
  addTaskForm: document.getElementById('addTaskForm'),
  addTaskBtn: document.getElementById('addTaskBtn'),
  clearAllBtn: document.getElementById('clearAllBtn'),
  
  // Modal elements
  confirmModal: document.getElementById('confirmModal'),
  cancelBtn: document.getElementById('cancelBtn'),
  confirmBtn: document.getElementById('confirmBtn'),
  
  // Stats elements
  totalTasks: document.getElementById('totalTasks'),
  completedTasks: document.getElementById('completedTasks'),
  notCompletedTasks: document.getElementById('notCompletedTasks'),
  notMarkedTasks: document.getElementById('notMarkedTasks'),
  completionRate: document.getElementById('completionRate'),
  progressBar: document.getElementById('progressBar'),
  completedCount: document.getElementById('completedCount'),
  totalCount: document.getElementById('totalCount'),
  
  // Visual stats
  visualCompleted: document.getElementById('visualCompleted'),
  visualNotCompleted: document.getElementById('visualNotCompleted'),
  visualNotMarked: document.getElementById('visualNotMarked'),
  visualStats: document.getElementById('visualStats'),
  
  // Other
  appTitle: document.querySelector('.app-title'),
  currentYear: document.getElementById('currentYear')
};

// Initialize application
function init() {
  loadState();
  setupEventListeners();
  render();
  setCurrentYear();
}

// Load state from localStorage
function loadState() {
  const savedTasks = localStorage.getItem('tasks');
  const savedTheme = localStorage.getItem('theme');
  const savedLanguage = localStorage.getItem('language');
  
  if (savedTasks) {
    try {
      state.tasks = JSON.parse(savedTasks);
    } catch (e) {
      console.error('Error loading tasks:', e);
      state.tasks = [];
    }
  }
  
  if (savedTheme) {
    state.theme = savedTheme;
    document.documentElement.className = savedTheme;
    updateThemeIcon();
  }
  
  if (savedLanguage) {
    state.language = savedLanguage;
    updateLanguageButtons();
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
  localStorage.setItem('theme', state.theme);
  localStorage.setItem('language', state.language);
}

// Set up event listeners
function setupEventListeners() {
  // Theme toggle
  DOM.themeToggle.addEventListener('click', toggleTheme);
  
  // Language buttons
  DOM.langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
    });
  });
  
  // Add task form
  DOM.addTaskForm.addEventListener('submit', handleAddTask);
  DOM.newTaskInput.addEventListener('input', updateAddButtonState);
  
  // Clear all button
  DOM.clearAllBtn.addEventListener('click', showClearAllModal);
  
  // Modal buttons
  DOM.cancelBtn.addEventListener('click', hideClearAllModal);
  DOM.confirmBtn.addEventListener('click', handleClearAllTasks);
  
  // Close modal on overlay click
  DOM.confirmModal.addEventListener('click', (e) => {
    if (e.target === DOM.confirmModal) {
      hideClearAllModal();
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.confirmModal.classList.contains('active')) {
      hideClearAllModal();
    }
  });
}

// Toggle theme
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.className = state.theme;
  updateThemeIcon();
  saveState();
}

// Update theme icon
function updateThemeIcon() {
  const icon = DOM.themeToggle.querySelector('i');
  if (state.theme === 'light') {
    icon.className = 'fas fa-moon';
    DOM.themeToggle.title = translations[state.language].darkMode;
  } else {
    icon.className = 'fas fa-sun';
    DOM.themeToggle.title = translations[state.language].lightMode;
  }
}

// Set language
function setLanguage(lang) {
  state.language = lang;
  updateLanguageButtons();
  updateTranslations();
  saveState();
}

// Update language buttons active state
function updateLanguageButtons() {
  DOM.langButtons.forEach(btn => {
    if (btn.dataset.lang === state.language) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Update all text with translations
function updateTranslations() {
  const t = translations[state.language];
  
  // Update app title
  DOM.appTitle.textContent = t.appTitle;
  
  // Update task section
  document.querySelector('.task-section h2').textContent = t.tasks;
  document.querySelector('.clear-all-btn').textContent = t.clearAll;
  DOM.newTaskInput.placeholder = t.taskPlaceholder;
  DOM.addTaskBtn.querySelector('.btn-text').textContent = t.addTask;
  
  // Update dashboard section
  document.querySelector('.dashboard-section h2').textContent = t.dashboard;
  document.querySelector('.progress-header h3').textContent = t.todayProgress;
  
  // Update stats labels
  document.querySelector('.total-tasks .stat-label').textContent = t.totalTasks;
  document.querySelector('.completed .stat-label').textContent = t.completed;
  document.querySelector('.not-completed .stat-label').textContent = t.notCompleted;
  document.querySelector('.not-marked .stat-label').textContent = t.notMarked;
  
  // Update visual stats labels
  document.querySelectorAll('.visual-stat.completed .visual-label')[0].textContent = t.completed;
  document.querySelectorAll('.visual-stat.not-completed .visual-label')[0].textContent = t.notCompleted;
  document.querySelectorAll('.visual-stat.not-marked .visual-label')[0].textContent = t.notMarked;
  
  // Update modal
  document.querySelector('.modal-text').textContent = t.confirmClear;
  DOM.cancelBtn.textContent = t.no;
  DOM.confirmBtn.textContent = t.yes;
  
  // Update theme toggle title
  updateThemeIcon();
}

// Handle adding a new task
function handleAddTask(e) {
  e.preventDefault();
  
  const taskText = DOM.newTaskInput.value.trim();
  if (!taskText) return;
  
  const newTask = {
    id: Date.now().toString(),
    text: taskText,
    status: 'not-marked',
    createdAt: new Date().toISOString()
  };
  
  state.tasks.unshift(newTask);
  DOM.newTaskInput.value = '';
  updateAddButtonState();
  
  saveState();
  render();
}

// Update add button state based on input
function updateAddButtonState() {
  const hasText = DOM.newTaskInput.value.trim().length > 0;
  DOM.addTaskBtn.disabled = !hasText;
}

// Show clear all confirmation modal
function showClearAllModal() {
  if (state.tasks.length === 0) return;
  DOM.confirmModal.classList.add('active');
}

// Hide clear all confirmation modal
function hideClearAllModal() {
  DOM.confirmModal.classList.remove('active');
}

// Handle clear all tasks
function handleClearAllTasks() {
  state.tasks = [];
  hideClearAllModal();
  saveState();
  render();
}

// Handle task status change
function handleTaskStatusChange(taskId, newStatus) {
  const taskIndex = state.tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    state.tasks[taskIndex].status = newStatus;
    saveState();
    render();
  }
}

// Handle task deletion
function handleTaskDelete(taskId) {
  state.tasks = state.tasks.filter(task => task.id !== taskId);
  saveState();
  render();
}

// Calculate task statistics
function calculateStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(task => task.status === 'completed').length;
  const notCompleted = state.tasks.filter(task => task.status === 'not-completed').length;
  const notMarked = state.tasks.filter(task => task.status === 'not-marked').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, notCompleted, notMarked, completionRate };
}

// Update statistics display
function updateStats() {
  const stats = calculateStats();
  
  // Update numeric stats
  DOM.totalTasks.textContent = stats.total;
  DOM.completedTasks.textContent = stats.completed;
  DOM.notCompletedTasks.textContent = stats.notCompleted;
  DOM.notMarkedTasks.textContent = stats.notMarked;
  
  // Update task count
  DOM.taskCount.textContent = stats.total;
  
  // Update completion rate
  DOM.completionRate.textContent = `${stats.completionRate}%`;
  
  // Set completion rate color class
  DOM.completionRate.className = 'progress-rate';
  if (stats.completionRate >= 70) {
    DOM.completionRate.classList.add('high');
  } else if (stats.completionRate >= 40) {
    DOM.completionRate.classList.add('medium');
  } else {
    DOM.completionRate.classList.add('low');
  }
  
  // Update progress bar
  DOM.progressBar.style.width = `${stats.completionRate}%`;
  DOM.progressBar.className = 'progress-bar';
  if (stats.completionRate >= 70) {
    DOM.progressBar.classList.add('high');
  } else if (stats.completionRate >= 40) {
    DOM.progressBar.classList.add('medium');
  } else {
    DOM.progressBar.classList.add('low');
  }
  
  // Update progress text
  DOM.completedCount.textContent = stats.completed;
  DOM.totalCount.textContent = stats.total;
  
  // Update visual stats
  DOM.visualCompleted.textContent = stats.completed;
  DOM.visualNotCompleted.textContent = stats.notCompleted;
  DOM.visualNotMarked.textContent = stats.notMarked;
  
  // Show/hide visual stats
  if (stats.total > 0) {
    DOM.visualStats.style.display = 'grid';
  } else {
    DOM.visualStats.style.display = 'none';
  }
}

// Render task list
function renderTaskList() {
  const t = translations[state.language];
  
  if (state.tasks.length === 0) {
    DOM.taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <p class="empty-text">${t.noTasks}</p>
      </div>
    `;
    return;
  }
  
  DOM.taskList.innerHTML = state.tasks.map(task => {
    const statusClass = task.status;
    const statusText = task.status === 'completed' ? 'completed' : 
                      task.status === 'not-completed' ? 'not-completed' : 'not-marked';
    
    const emoji = task.status === 'completed' ? '✅' : 
                 task.status === 'not-completed' ? '❌' : '⏳';
    
    const textClass = task.status === 'completed' ? 'completed' : '';
    
    return `
      <div class="task-item ${statusClass}" data-task-id="${task.id}">
        <button class="status-btn" data-action="cycle-status" title="${t.taskStatus}">
          ${emoji}
        </button>
        <p class="task-text ${textClass}">${escapeHtml(task.text)}</p>
        <div class="status-controls">
          <button class="status-control-btn completed ${task.status === 'completed' ? 'active' : ''}" 
                  data-action="set-status" data-status="completed" title="${t.markCompleted}">
            ✅
          </button>
          <button class="status-control-btn not-completed ${task.status === 'not-completed' ? 'active' : ''}" 
                  data-action="set-status" data-status="not-completed" title="${t.markNotCompleted}">
            ❌
          </button>
          <button class="status-control-btn not-marked ${task.status === 'not-marked' ? 'active' : ''}" 
                  data-action="set-status" data-status="not-marked" title="${t.markNotMarked}">
            ⏳
          </button>
        </div>
        <button class="delete-btn" data-action="delete" title="${t.deleteTask}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }).join('');
  
  // Add event listeners to task items
  DOM.taskList.querySelectorAll('.task-item').forEach(item => {
    const taskId = item.dataset.taskId;
    
    // Cycle status button
    item.querySelector('[data-action="cycle-status"]').addEventListener('click', () => {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const statusOrder = ['not-marked', 'completed', 'not-completed'];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      
      handleTaskStatusChange(taskId, nextStatus);
    });
    
    // Set status buttons
    item.querySelectorAll('[data-action="set-status"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.status;
        handleTaskStatusChange(taskId, status);
      });
    });
    
    // Delete button
    item.querySelector('[data-action="delete"]').addEventListener('click', () => {
      handleTaskDelete(taskId);
    });
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Set current year in footer
function setCurrentYear() {
  DOM.currentYear.textContent = new Date().getFullYear();
}

// Main render function
function render() {
  renderTaskList();
  updateStats();
  updateAddButtonState();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);