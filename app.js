// ============================================
// Nook - Application Logic
// ============================================

// === Constants ===
const MOBILE_BREAKPOINT = 768;
const FEEDBACK_DURATION = 2000;
const AUTOSAVE_DELAY = 1000;
const PREVIEW_LENGTH = 100;

// === State Management ===
let currentEntry = {
    date: '',
    mood: null,
    content: '',
    timestamp: null,
    submitted: false
};

let currentCalendarMonth = new Date();
let autoSaveTimeout = null;

// Todo state
let todos = [];

// === DOM Elements ===
const elements = {
    dateIndicator: document.getElementById('dateIndicator'),
    journalTextarea: document.getElementById('journalTextarea'),
    moodOptions: document.getElementById('moodOptions'),
    moodButtons: document.querySelectorAll('.mood-btn'),
    characterCount: document.getElementById('characterCount'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    overlay: document.getElementById('overlay'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    importFile: document.getElementById('importFile'),
    submitBtn: document.getElementById('submitBtn'),
    entriesSidebar: document.getElementById('entriesSidebar'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    collapseSidebarBtn: document.getElementById('collapseSidebarBtn'),
    expandSidebarBtn: document.getElementById('expandSidebarBtn'),
    entriesList: document.getElementById('entriesList'),
    calendarGrid: document.getElementById('calendarGrid'),
    calendarMonthYear: document.getElementById('calendarMonthYear'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    todoSidebar: document.getElementById('todoSidebar'),
    collapseTodoBtn: document.getElementById('collapseTodoBtn'),
    expandTodoBtn: document.getElementById('expandTodoBtn'),
    todoList: document.getElementById('todoList'),
    completedList: document.getElementById('completedList'),
    completedSection: document.getElementById('completedSection'),
    todoView: document.getElementById('todoView'),
    archivedView: document.getElementById('archivedView'),
    viewArchivedBtn: document.getElementById('viewArchivedBtn'),
    backFromArchivedBtn: document.getElementById('backFromArchivedBtn'),
    deleteAllArchivedBtn: document.getElementById('deleteAllArchivedBtn'),
    archivedCount: document.getElementById('archivedCount'),
    archivedSearchInput: document.getElementById('archivedSearchInput'),
    archivedList: document.getElementById('archivedList'),
    welcomeModal: document.getElementById('welcomeModal'),
    welcomeCloseBtn: document.getElementById('welcomeCloseBtn'),
    entrySearchInput: document.getElementById('entrySearchInput'),
    suggestTasksBtn: document.getElementById('suggestTasksBtn'),
    suggestTasksIcon: document.getElementById('suggestTasksIcon'),
    suggestTasksText: document.getElementById('suggestTasksText')
};

// === Utility Functions ===

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * Format date for display (e.g., "Saturday, November 22")
 */
function formatDateForDisplay(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format date for entry list (e.g., "Nov 22")
 */
function formatDateShort(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Get all entries from localStorage with error handling
 */
function getAllEntries() {
    try {
        const entries = localStorage.getItem('journalEntries');
        return entries ? JSON.parse(entries) : {};
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return {};
    }
}

/**
 * Save all entries to localStorage with error handling
 */
function saveAllEntries(entries) {
    try {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Could show user notification here
    }
}

/**
 * Get entry for a specific date
 */
function getEntryForDate(date) {
    const entries = getAllEntries();
    return entries[date] || { date, mood: null, content: '', timestamp: null, submitted: false };
}

/**
 * Save current entry to localStorage
 */
function saveCurrentEntry(isSubmit = false) {
    const entries = getAllEntries();
    currentEntry.timestamp = new Date().toISOString();
    if (isSubmit) {
        currentEntry.submitted = true;
    }
    entries[currentEntry.date] = currentEntry;
    saveAllEntries(entries);

    // Update sidebar
    renderEntriesList();
}

/**
 * Update character count
 */
function updateCharacterCount() {
    const count = elements.journalTextarea.value.length;
    elements.characterCount.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
}

/**
 * Get mood emoji from mood name
 */
function getMoodEmoji(mood) {
    const moodMap = {
        happy: '😊',
        calm: '😌',
        sad: '😔',
        anxious: '😰',
        tired: '😴',
        thoughtful: '🤔'
    };
    return moodMap[mood] || '';
}

/**
 * Show temporary feedback on a button
 */
function showButtonFeedback(button, feedbackHTML, duration = FEEDBACK_DURATION) {
    const originalHTML = button.innerHTML;
    const wasDisabled = button.disabled;

    button.innerHTML = feedbackHTML;
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = wasDisabled;
    }, duration);
}

// === Event Handlers ===

/**
 * Handle journal textarea input
 */
function handleJournalInput(event) {
    currentEntry.content = event.target.value;
    updateCharacterCount();

    // Auto-save as draft
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveCurrentEntry(false);
    }, AUTOSAVE_DELAY);

    // Enable submit button if there's content
    elements.submitBtn.disabled = !currentEntry.content.trim();
}

/**
 * Handle mood selection
 */
function handleMoodSelection(event) {
    const button = event.target.closest('.mood-btn');
    if (!button) return;

    const selectedMood = button.dataset.mood;

    // Update UI
    elements.moodButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-checked', 'false');
    });

    button.classList.add('selected');
    button.setAttribute('aria-checked', 'true');

    // Update state and save
    currentEntry.mood = selectedMood;
    saveCurrentEntry(false);
}

/**
 * Handle submit button click
 */
function handleSubmit() {
    if (!currentEntry.content.trim()) return;

    // Save as submitted
    saveCurrentEntry(true);

    // Visual feedback
    showButtonFeedback(elements.submitBtn, '<span>✓</span> Saved!');
}

/**
 * Toggle settings panel
 */
function toggleSettings(open) {
    if (open) {
        elements.settingsPanel.classList.add('open');
        elements.overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    } else {
        elements.settingsPanel.classList.remove('open');
        elements.overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

/**
 * Toggle entries sidebar (mobile only)
 */
function toggleSidebar(open) {
    // Only toggle on mobile
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
        if (open) {
            elements.entriesSidebar.classList.add('open');
            elements.overlay.classList.add('visible');
        } else {
            elements.entriesSidebar.classList.remove('open');
            elements.overlay.classList.remove('visible');
        }
    }
}

/**
 * Collapse sidebar (desktop)
 */
/**
 * Collapse sidebar (desktop & mobile)
 */
function collapseSidebar() {
    elements.entriesSidebar.classList.add('collapsed');
    elements.entriesSidebar.classList.remove('open'); // For mobile
    document.body.classList.remove('entries-sidebar-open');
    localStorage.setItem('entriesSidebarCollapsed', 'true');
}

/**
 * Expand sidebar (desktop & mobile)
 */
function expandSidebar() {
    elements.entriesSidebar.classList.remove('collapsed');
    elements.entriesSidebar.classList.add('open'); // For mobile
    document.body.classList.add('entries-sidebar-open');
    localStorage.setItem('entriesSidebarCollapsed', 'false');
}

/**
 * Render calendar for current month
 */
function renderCalendar() {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();

    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    elements.calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Get previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Get all entries to mark days with entries
    const entries = getAllEntries();
    const today = getTodayDate();

    // Build calendar grid
    let html = '';

    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        html += `<div class="calendar-day other-month">${day}</div>`;
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === today;
        const hasEntry = entries[dateStr] !== undefined;
        const isSelected = dateStr === currentEntry.date;

        const classes = ['calendar-day'];
        if (isToday) classes.push('today');
        if (hasEntry) classes.push('has-entry');
        if (isSelected) classes.push('selected');

        html += `<div class="${classes.join(' ')}" data-date="${dateStr}">${day}</div>`;
    }

    // Add next month's days to fill the grid
    const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        html += `<div class="calendar-day other-month">${day}</div>`;
    }

    elements.calendarGrid.innerHTML = html;
}

/**
 * Handle calendar day clicks (event delegation)
 */
function handleCalendarClick(event) {
    const dayEl = event.target.closest('.calendar-day:not(.other-month)');
    if (dayEl && dayEl.dataset.date) {
        loadEntryForDate(dayEl.dataset.date);
    }
}

/**
 * Navigate to previous month
 */
function prevMonth() {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1);
    renderCalendar();
}

/**
 * Navigate to next month
 */
function nextMonth() {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1);
    renderCalendar();
}

// === Todo Sidebar Functions ===

/**
 * Collapse todo sidebar
 */
function collapseTodoSidebar() {
    elements.todoSidebar.classList.add('collapsed');
    localStorage.setItem('todoSidebarCollapsed', 'true');
}

/**
 * Expand todo sidebar
 */
function expandTodoSidebar() {
    elements.todoSidebar.classList.remove('collapsed');
    localStorage.setItem('todoSidebarCollapsed', 'false');
}

// === Todo Functions ===

/**
 * Load todos from localStorage
 */
function loadTodos() {
    try {
        const saved = localStorage.getItem('todos');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Check if it's the old format {priorities: [], tasks: []}
            if (parsed && typeof parsed === 'object' && (parsed.priorities || parsed.tasks)) {
                console.log('Migrating old todo format to new format');
                // Migrate: combine priorities and tasks into single array
                const oldPriorities = parsed.priorities || [];
                const oldTasks = parsed.tasks || [];
                todos = [...oldPriorities, ...oldTasks];
                // Save in new format
                saveTodos();
            } else if (Array.isArray(parsed)) {
                todos = parsed;
            } else {
                todos = [];
            }
        } else {
            todos = [];
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        todos = [];
    }
}

/**
 * Save todos to localStorage
 */
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
        console.error('Error saving todos:', error);
    }
}

/**
 * Render active todos
 */
function renderTodos() {
    const activeTodos = todos.filter(t => !t.completed && !t.archived);

    // Always show active todos + one empty task
    const todoSlots = [...activeTodos, { text: '', completed: false }];

    const isMobile = window.innerWidth <= 768;

    elements.todoList.innerHTML = todoSlots.map((todo, index) => {
        const isPriority = index < 3;
        const marker = isPriority ? `${index + 1}.` : '•';
        const markerClass = isPriority ? 'todo-number' : 'todo-bullet';
        // Disable drag on mobile to fix scrolling issues
        const isDraggable = !isMobile && !!todo.text;

        return `
    <div class="todo-item" 
         data-index="${index}" 
         draggable="${isDraggable}" 
         role="listitem">
      <span class="${markerClass}">${marker}</span>
      <div class="todo-text" 
           contenteditable="true" 
           data-placeholder="${isPriority ? `Priority ${index + 1}` : 'New task'}"
           data-index="${index}">${todo.text || ''}</div>
      ${todo.text ? `<div class="todo-checkbox" data-index="${index}"></div>` : ''}
    </div>
  `}).join('');

    // Add event listeners
    addTodoEventListeners();
    addDragAndDropListeners();

    // Render completed and archived sections
    renderCompleted();
    renderArchived();
}

/**
 * Add drag and drop listeners
 */
function addDragAndDropListeners() {
    const items = elements.todoList.querySelectorAll('.todo-item[draggable="true"]');

    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Attach dragover and drop to the container, not individual items
    elements.todoList.addEventListener('dragover', handleDragOver);
    elements.todoList.addEventListener('drop', handleDrop);
}

let draggedItem = null;
let placeholder = null;

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.index);

    // Create placeholder
    placeholder = document.createElement('div');
    placeholder.className = 'todo-placeholder';

    // Delay adding class to keep the drag image visible
    setTimeout(() => {
        this.classList.add('dragging');
        this.style.display = 'none'; // Hide the original item
        // Insert placeholder after the dragged item initially
        this.parentNode.insertBefore(placeholder, this.nextSibling);
    }, 0);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.display = ''; // Show item again
    draggedItem = null;

    // Remove placeholder
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    placeholder = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!draggedItem || !placeholder) return;

    const todoList = elements.todoList;
    const afterElement = getDragAfterElement(todoList, e.clientY);

    if (afterElement == null) {
        todoList.appendChild(placeholder);
    } else {
        todoList.insertBefore(placeholder, afterElement);
    }
}

// Helper to find the element after the cursor
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function handleDrop(e) {
    e.preventDefault();

    if (!draggedItem || !placeholder) return;

    const fromIndex = parseInt(draggedItem.dataset.index);

    // Get active and completed todos
    const activeTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

    // Get the dragged todo
    const draggedTodo = activeTodos[fromIndex];

    if (!draggedTodo) {
        return;
    }

    // Remove dragged todo from active list
    const remainingTodos = activeTodos.filter((_, i) => i !== fromIndex);

    // Find where to insert based on placeholder position
    const children = [...elements.todoList.children];
    const placeholderPosition = children.indexOf(placeholder);

    // Count how many visible todo items come before the placeholder
    // Exclude empty tasks (tasks with no text)
    let insertPosition = 0;
    for (let i = 0; i < placeholderPosition; i++) {
        const child = children[i];
        if (child.classList.contains('todo-item') && child !== draggedItem) {
            // Check if this is a real task (not the empty slot)
            const childIndex = parseInt(child.dataset.index);
            if (childIndex < activeTodos.length && activeTodos[childIndex].text) {
                insertPosition++;
            }
        }
    }

    // Insert dragged todo at the new position
    remainingTodos.splice(insertPosition, 0, draggedTodo);

    // Update todos array
    todos = [...remainingTodos, ...completedTodos];

    saveTodos();
    renderTodos();
}

/**
 * Render completed todos
 */
function renderCompleted() {
    const completedTodos = todos.filter(t => t.completed && !t.archived);

    if (completedTodos.length === 0) {
        elements.completedSection.style.display = 'none';
        return;
    }

    elements.completedSection.style.display = 'block';
    elements.completedList.innerHTML = completedTodos.map((todo, index) => {
        const actualIndex = todos.findIndex(t => t === todo);
        return `
      <div class="completed-item" data-index="${actualIndex}">
        <span class="todo-bullet">•</span>
        <div class="todo-text">${todo.text}</div>
        <div class="completed-actions">
          <button class="archive-btn" data-index="${actualIndex}" title="Archive">🗄️</button>
          <button class="delete-btn" data-index="${actualIndex}" title="Delete">🗑️</button>
        </div>
        <div class="todo-checkbox checked" data-index="${actualIndex}"></div>
      </div>
    `;
    }).join('');

    // Add checkbox listeners for unchecking
    document.querySelectorAll('.completed-item .todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (todos[index]) {
                // Visual feedback
                e.target.classList.remove('checked');
                const item = e.target.closest('.completed-item');
                if (item) item.style.opacity = '0.5';

                setTimeout(() => {
                    todos[index].completed = false;
                    saveTodos();
                    renderTodos();
                }, 150);
            }
        });
    });

    // Add archive button listeners
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (todos[index]) {
                // Visual feedback
                const item = e.target.closest('.completed-item');
                if (item) item.style.opacity = '0';

                setTimeout(() => {
                    todos[index].archived = true;
                    saveTodos();
                    renderTodos();
                    renderArchived();
                }, 150);
            }
        });
    });

    // Add delete button listeners
    document.querySelectorAll('.completed-item .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (todos[index]) {
                // Visual feedback
                const item = e.target.closest('.completed-item');
                if (item) item.style.opacity = '0';

                setTimeout(() => {
                    todos.splice(index, 1);
                    saveTodos();
                    renderTodos();
                }, 150);
            }
        });
    });
}

/**
 * Render archived todos
 */
function renderArchived(searchQuery = '') {
    const archivedTodos = todos.filter(t => t.archived);

    if (archivedTodos.length === 0) {
        elements.viewArchivedBtn.style.display = 'none';
        // If we're in archived view and no tasks left, go back to todo view
        if (elements.archivedView.style.display === 'flex') {
            showTodoView();
        }
        return;
    }

    // Show view archived button with count
    elements.viewArchivedBtn.style.display = 'flex';
    elements.archivedCount.textContent = archivedTodos.length;

    // Filter by search query if provided
    const filteredTodos = searchQuery
        ? archivedTodos.filter(todo =>
            todo.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : archivedTodos;

    if (filteredTodos.length === 0) {
        elements.archivedList.innerHTML = '<p class="empty-state">No archived tasks match your search.</p>';
        return;
    }

    elements.archivedList.innerHTML = filteredTodos.map((todo, index) => {
        const actualIndex = todos.findIndex(t => t === todo);
        return `
            <div class="archived-item" data-index="${actualIndex}">
                <span class="todo-bullet">•</span>
                <div class="todo-text">${todo.text}</div>
                <div class="archived-actions">
                    <button class="unarchive-btn" data-index="${actualIndex}">Unarchive</button>
                    <button class="delete-archived-btn" data-index="${actualIndex}" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    // Add unarchive listeners
    document.querySelectorAll('.unarchive-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (todos[index]) {
                // Visual feedback
                const item = e.target.closest('.archived-item');
                if (item) item.style.opacity = '0';

                setTimeout(() => {
                    todos[index].archived = false;
                    saveTodos();
                    renderTodos();
                    renderArchived(elements.archivedSearchInput.value);
                }, 150);
            }
        });
    });

    // Add delete listeners
    document.querySelectorAll('.delete-archived-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (todos[index]) {
                // Visual feedback
                const item = e.target.closest('.archived-item');
                if (item) item.style.opacity = '0';

                setTimeout(() => {
                    todos.splice(index, 1);
                    saveTodos();
                    renderTodos();
                    renderArchived(elements.archivedSearchInput.value);
                }, 150);
            }
        });
    });
}

/**
 * Delete all archived tasks
 */
function deleteAllArchived() {
    if (confirm('Are you sure you want to delete all archived tasks? This cannot be undone.')) {
        todos = todos.filter(t => !t.archived);
        saveTodos();
        renderTodos();
        showTodoView(); // Go back to todo view
    }
}

/**
 * Handle archived search
 */
function handleArchivedSearch(e) {
    const searchQuery = e.target.value;
    renderArchived(searchQuery);
}

/**
 * Show archived view
 */
function showArchivedView() {
    elements.todoView.style.display = 'none';
    elements.archivedView.style.display = 'flex';
    elements.archivedSearchInput.value = ''; // Clear search
    renderArchived(); // Re-render to ensure fresh data
}

/**
 * Show todo view (back from archived)
 */
function showTodoView() {
    elements.archivedView.style.display = 'none';
    elements.todoView.style.display = 'block';
}

/**
 * Add event listeners to todo items
 */
function addTodoEventListeners() {
    // Checkbox clicks
    document.querySelectorAll('.todo-item .todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const activeTodos = todos.filter(t => !t.completed && !t.archived);
            if (index < activeTodos.length) {
                // Visual feedback first
                e.target.classList.add('checked');
                const todoItem = e.target.closest('.todo-item');
                if (todoItem) todoItem.style.opacity = '0.5';

                // Delay data update
                setTimeout(() => {
                    const todo = activeTodos[index];
                    const actualIndex = todos.findIndex(t => t === todo);
                    if (actualIndex !== -1) {
                        todos[actualIndex].completed = true;
                        saveTodos();
                        renderTodos();
                    }
                }, 150);
            }
        });
    });

    // Text editing
    document.querySelectorAll('.todo-item .todo-text').forEach(textEl => {
        // Blur: save text
        textEl.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            const text = e.target.textContent.trim();

            if (text) {
                // Save or update todo
                if (index < todos.filter(t => !t.completed).length) {
                    // Update existing
                    const activeTodos = todos.filter(t => !t.completed);
                    const todo = activeTodos[index];
                    const actualIndex = todos.findIndex(t => t === todo);
                    todos[actualIndex].text = text;
                } else {
                    // Add new
                    todos.push({ text, completed: false });
                }
                saveTodos();
                renderTodos();
            } else if (index < todos.filter(t => !t.completed).length) {
                // Delete if emptied
                const activeTodos = todos.filter(t => !t.completed);
                const todo = activeTodos[index];
                const actualIndex = todos.findIndex(t => t === todo);
                todos.splice(actualIndex, 1);
                saveTodos();
                renderTodos();
            }
        });

        // Enter key: save and move to next task
        textEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const currentIndex = parseInt(e.target.dataset.index);
                const text = e.target.textContent.trim();

                // Save current task
                if (text) {
                    if (currentIndex < todos.filter(t => !t.completed).length) {
                        // Update existing
                        const activeTodos = todos.filter(t => !t.completed);
                        const todo = activeTodos[currentIndex];
                        const actualIndex = todos.findIndex(t => t === todo);
                        todos[actualIndex].text = text;
                    } else {
                        // Add new
                        todos.push({ text, completed: false });
                    }
                    saveTodos();
                    renderTodos();

                    // Focus next task after render
                    setTimeout(() => {
                        const nextIndex = currentIndex + 1;
                        const nextTask = document.querySelector(`.todo-item .todo-text[data-index="${nextIndex}"]`);
                        if (nextTask) {
                            nextTask.focus();
                            // Place cursor at end
                            const range = document.createRange();
                            const sel = window.getSelection();
                            range.selectNodeContents(nextTask);
                            range.collapse(false);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }, 0);
                } else {
                    e.target.blur();
                }
            }
        });
    });
}

/**
 * Render entries list in sidebar
 */
function renderEntriesList(searchQuery = '') {
    const entries = getAllEntries();
    let entryDates = Object.keys(entries).sort().reverse(); // Newest first

    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        entryDates = entryDates.filter(date => {
            const entry = entries[date];
            const contentMatch = entry.content && entry.content.toLowerCase().includes(query);
            const moodMatch = entry.mood && entry.mood.toLowerCase().includes(query);
            const dateMatch = formatDateShort(date).toLowerCase().includes(query);
            return contentMatch || moodMatch || dateMatch;
        });
    }

    if (entryDates.length === 0) {
        if (searchQuery) {
            elements.entriesList.innerHTML = '<p class="empty-state">No entries match your search.</p>';
        } else {
            elements.entriesList.innerHTML = '<p class="empty-state">No entries yet. Start writing!</p>';
        }
        return;
    }

    elements.entriesList.innerHTML = entryDates.map(date => {
        const entry = entries[date];
        const isActive = date === currentEntry.date;
        const preview = entry.content.substring(0, PREVIEW_LENGTH);
        const moodEmoji = entry.mood ? getMoodEmoji(entry.mood) : '';

        return `
      <div class="entry-item ${isActive ? 'active' : ''}" data-date="${date}">
        <div class="entry-date">${formatDateShort(date)}</div>
        ${moodEmoji ? `<div class="entry-mood">${moodEmoji}</div>` : ''}
        <div class="entry-preview">${preview || 'No content'}</div>
      </div>
    `;
    }).join('');

    // Add click handlers to entry items
    document.querySelectorAll('.entry-item').forEach(item => {
        item.addEventListener('click', () => {
            const date = item.dataset.date;
            loadEntryForDate(date);
            // On mobile, close sidebar
            if (window.innerWidth <= 768) {
                collapseSidebar();
            }
        });
    });
}

/**
 * Load entry for a specific date
 */
function loadEntryForDate(date) {
    currentEntry = getEntryForDate(date);

    // Update UI
    elements.dateIndicator.textContent = formatDateForDisplay(date);
    elements.journalTextarea.value = currentEntry.content;
    updateCharacterCount();

    // Restore mood selection
    elements.moodButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-checked', 'false');
        if (btn.dataset.mood === currentEntry.mood) {
            btn.classList.add('selected');
            btn.setAttribute('aria-checked', 'true');
        }
    });

    // Update submit button state
    elements.submitBtn.disabled = !currentEntry.content.trim();

    // Update sidebar
    renderEntriesList();
    renderCalendar();
}

/**
 * Export all entries as JSON
 */
function exportEntries() {
    const entries = getAllEntries();

    // Categorize todos
    const activeTodos = todos.filter(t => !t.completed && !t.archived);
    const completedTodos = todos.filter(t => t.completed && !t.archived);
    const archivedTodos = todos.filter(t => t.archived);

    // Create export object with both entries and todos
    const exportData = {
        exportDate: new Date().toISOString(),
        journalEntries: entries,
        todos: {
            active: activeTodos,
            completed: completedTodos,
            archived: archivedTodos,
            total: todos.length
        }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = `nook-export-${getTodayDate()}.json`;
    downloadLink.click();

    // Clean up
    URL.revokeObjectURL(downloadLink.href);

    // Show feedback
    showButtonFeedback(elements.exportBtn, '<span>✓</span> Exported!');
}

/**
 * Import entries from JSON file
 */
function importEntries(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            // Validate data structure
            if (!data.journalEntries && !data.todos) {
                throw new Error('Invalid backup file format');
            }

            if (confirm('This will overwrite your current data. Are you sure you want to proceed?')) {
                // Restore journal entries
                if (data.journalEntries) {
                    localStorage.setItem('journalEntries', JSON.stringify(data.journalEntries));
                }

                // Restore todos
                if (data.todos) {
                    // Handle new export format (with categorized todos)
                    let allTodos = [];
                    if (data.todos.active) allTodos = allTodos.concat(data.todos.active);
                    if (data.todos.completed) allTodos = allTodos.concat(data.todos.completed);
                    if (data.todos.archived) allTodos = allTodos.concat(data.todos.archived);

                    // If it's the old format (just an array of todos), handle that too
                    if (Array.isArray(data.todos)) {
                        allTodos = data.todos;
                    }

                    todos = allTodos;
                    saveTodos();
                }

                // Refresh UI
                loadTodos();
                renderTodos();
                renderArchived();
                renderCalendar();
                loadTodayEntry();

                showButtonFeedback(elements.importBtn, '<span>✓</span> Imported!');
                setTimeout(() => {
                    alert('Data imported successfully!');
                    location.reload(); // Reload to ensure everything is fresh
                }, 500);
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing data. Please check if the file is a valid Nook backup.');
        }

        // Reset file input
        event.target.value = '';
    };

    reader.readAsText(file);
}

/**
 * Handle overlay click
 */
function handleOverlayClick() {
    toggleSettings(false);
    toggleSidebar(false);
}

// === Initialization ===

/**
 * Load entry for today
 */
function loadTodayEntry() {
    const today = getTodayDate();
    loadEntryForDate(today);
}

/**
 * Restore sidebar states from localStorage
 */
function restoreSidebarStates() {
    const isMobile = window.innerWidth <= 768;

    // --- Entries Sidebar ---
    if (isMobile) {
        // Mobile: Always default to closed
        elements.entriesSidebar.classList.remove('open');
        elements.entriesSidebar.classList.add('collapsed');
        document.body.classList.remove('entries-sidebar-open');
    } else {
        // Desktop: Restore from local storage (default to open if not set)
        const entriesSidebarCollapsed = localStorage.getItem('entriesSidebarCollapsed');
        const shouldCollapseEntries = entriesSidebarCollapsed === 'true';

        if (shouldCollapseEntries) {
            elements.entriesSidebar.classList.add('collapsed');
            document.body.classList.remove('entries-sidebar-open');
        } else {
            elements.entriesSidebar.classList.remove('collapsed');
            document.body.classList.add('entries-sidebar-open');
        }
    }

    // --- Todo Sidebar ---
    if (isMobile) {
        // Mobile: Always default to closed
        elements.todoSidebar.classList.remove('open');
        elements.todoSidebar.classList.add('collapsed');
        document.body.classList.remove('todo-sidebar-open');
    } else {
        // Desktop: Restore from local storage (default to open if not set)
        const todoSidebarCollapsed = localStorage.getItem('todoSidebarCollapsed');
        const shouldCollapseTodo = todoSidebarCollapsed === 'true';

        if (shouldCollapseTodo) {
            elements.todoSidebar.classList.add('collapsed');
            document.body.classList.remove('todo-sidebar-open');
        } else {
            elements.todoSidebar.classList.remove('collapsed');
            document.body.classList.add('todo-sidebar-open');
        }
    }
}

/**
 * Show welcome modal for first-time users
 */
function showWelcomeModal() {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        elements.welcomeModal.classList.add('show');
    }
}

/**
 * Close welcome modal
 */
function closeWelcomeModal() {
    elements.welcomeModal.classList.remove('show');
    localStorage.setItem('hasVisited', 'true');
}

/**
 * Suggest tasks using AI based on journal content
 */
async function suggestTasks() {
    const content = elements.journalTextarea.value.trim();

    // Validate content
    if (!content || content.length < 20) {
        alert('Please write at least a few sentences in your journal before suggesting tasks.');
        return;
    }

    // Set loading state
    elements.suggestTasksBtn.disabled = true;
    elements.suggestTasksBtn.classList.add('loading');
    elements.suggestTasksText.textContent = 'Analyzing...';

    try {
        // Call the API
        const response = await fetch('/api/suggest-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate suggestions');
        }

        const { tasks } = data;

        // Handle empty results
        if (!tasks || tasks.length === 0) {
            alert('No actionable tasks found in your journal entry. Try writing about specific things you need to do!');
            return;
        }

        // Add tasks to the todo list
        let addedCount = 0;
        tasks.forEach(taskText => {
            // Check if task already exists (case-insensitive)
            const exists = todos.some(t =>
                t.text.toLowerCase().trim() === taskText.toLowerCase().trim()
            );

            if (!exists) {
                todos.push({
                    text: taskText,
                    completed: false,
                    archived: false
                });
                addedCount++;
            }
        });

        // Save and render
        if (addedCount > 0) {
            saveTodos();
            renderTodos();

            // Show success message
            const message = addedCount === 1
                ? '✓ Added 1 task to your to-do list!'
                : `✓ Added ${addedCount} tasks to your to-do list!`;

            showButtonFeedback(elements.suggestTasksBtn, message);

            // Expand todo sidebar if collapsed (on desktop)
            if (window.innerWidth > 768 && elements.todoSidebar.classList.contains('collapsed')) {
                expandTodoSidebar();
            }
        } else {
            alert('All suggested tasks are already in your to-do list!');
        }

    } catch (error) {
        console.error('Error suggesting tasks:', error);

        // Show more specific error message
        let errorMessage = 'Failed to generate task suggestions. ';

        if (error.message.includes('AI service not configured')) {
            errorMessage += 'The AI service is not set up yet. Please add your GEMINI_API_KEY to Vercel environment variables.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Could not connect to the API. Make sure you\'ve deployed to Vercel.';
        } else {
            errorMessage += error.message || 'Please try again later.';
        }

        alert(errorMessage);
    } finally {
        // Reset button state
        elements.suggestTasksBtn.disabled = false;
        elements.suggestTasksBtn.classList.remove('loading');
        elements.suggestTasksText.textContent = 'Suggest Tasks';
    }
}

/**
 * Initialize the app
 */
function init() {

    // Load today's entry
    loadTodayEntry();

    // Render entries list
    renderEntriesList();

    // Render calendar
    renderCalendar();

    // Load and render todos
    loadTodos();
    renderTodos();

    // Restore sidebar states
    restoreSidebarStates();

    // Show welcome modal for first-time users
    showWelcomeModal();

    // Event listeners
    elements.journalTextarea.addEventListener('input', handleJournalInput);
    elements.moodOptions.addEventListener('click', handleMoodSelection);
    elements.submitBtn.addEventListener('click', handleSubmit);
    elements.settingsBtn.addEventListener('click', () => toggleSettings(true));
    elements.closeSettingsBtn.addEventListener('click', () => toggleSettings(false));
    elements.closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
    elements.collapseSidebarBtn.addEventListener('click', collapseSidebar);
    elements.expandSidebarBtn.addEventListener('click', expandSidebar);
    elements.overlay.addEventListener('click', handleOverlayClick);
    elements.exportBtn.addEventListener('click', exportEntries);
    elements.importBtn.addEventListener('click', () => elements.importFile.click());
    elements.importFile.addEventListener('change', importEntries);
    elements.prevMonthBtn.addEventListener('click', prevMonth);
    elements.nextMonthBtn.addEventListener('click', nextMonth);
    elements.collapseTodoBtn.addEventListener('click', collapseTodoSidebar);
    elements.expandTodoBtn.addEventListener('click', expandTodoSidebar);
    elements.viewArchivedBtn.addEventListener('click', showArchivedView);
    elements.backFromArchivedBtn.addEventListener('click', showTodoView);
    elements.deleteAllArchivedBtn.addEventListener('click', deleteAllArchived);
    elements.archivedSearchInput.addEventListener('input', handleArchivedSearch);
    elements.welcomeCloseBtn.addEventListener('click', closeWelcomeModal);
    elements.entrySearchInput.addEventListener('input', (e) => {
        renderEntriesList(e.target.value);
    });
    elements.suggestTasksBtn.addEventListener('click', suggestTasks);

    // Calendar event delegation
    elements.calendarGrid.addEventListener('click', handleCalendarClick);

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Escape to close panels
        if (event.key === 'Escape') {
            if (elements.settingsPanel.classList.contains('open')) {
                toggleSettings(false);
            } else if (elements.entriesSidebar.classList.contains('open')) {
                toggleSidebar(false);
            }
        }
    });

    // Auto-focus textarea on load
    elements.journalTextarea.focus();

    console.log('Nook initialized ✨');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
