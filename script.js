const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const emptyState = document.getElementById("empty-state");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const totalTasksDisplay = document.getElementById("total-tasks");
const completedTasksDisplay = document.getElementById("completed-tasks");

let currentFilter = "all";

// Initialize app
function init() {
    loadTasks();
    updateStats();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    inputBox.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });

    listContainer.addEventListener("click", handleTaskClick);
}

// Handle task interactions
function handleTaskClick(e) {
    const target = e.target;
    const li = target.closest("li");

    if (!li) return;

    // Toggle task completion
    if (target.closest(".checkbox")) {
        toggleTask(li);
    }
    // Delete task
    else if (target.closest(".delete-btn")) {
        deleteTask(li);
    }
    // Click on task text to toggle
    else if (target.closest(".task-text")) {
        toggleTask(li);
    }
}

// Add new task
function addTask() {
    const taskText = inputBox.value.trim();

    if (!taskText) {
        inputBox.focus();
        return;
    }

    const li = createTaskElement(taskText);
    listContainer.appendChild(li);
    inputBox.value = "";
    inputBox.focus();

    saveTasks();
    updateStats();
    updateEmptyState();
}

// Create task element
function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.className = "task-item";

    // Checkbox
    const checkbox = document.createElement("div");
    checkbox.className = "checkbox";
    checkbox.innerHTML = "✓";

    // Task text
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = taskText;

    // Status badge
    const statusSpan = document.createElement("span");
    statusSpan.className = "status status-pending";
    statusSpan.textContent = "Pending";

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.type = "button";

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(statusSpan);
    li.appendChild(deleteBtn);

    return li;
}

// Toggle task completion
function toggleTask(li) {
    li.classList.toggle("checked");
    const statusSpan = li.querySelector(".status");

    if (li.classList.contains("checked")) {
        statusSpan.textContent = "Completed";
        statusSpan.className = "status status-completed";
    } else {
        statusSpan.textContent = "Pending";
        statusSpan.className = "status status-pending";
    }

    saveTasks();
    updateStats();
    applyFilter();
}

// Delete task
function deleteTask(li) {
    li.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
        li.remove();
        saveTasks();
        updateStats();
        updateEmptyState();
        applyFilter();
    }, 300);
}

// Clear completed tasks
function clearCompleted() {
    const completedTasks = listContainer.querySelectorAll("li.checked");
    if (completedTasks.length === 0) return;

    completedTasks.forEach(task => {
        task.style.animation = "fadeOut 0.3s ease-out forwards";
        setTimeout(() => task.remove(), 300);
    });

    setTimeout(() => {
        saveTasks();
        updateStats();
        updateEmptyState();
        applyFilter();
    }, 300);
}

// Remove all tasks
function removeAll() {
    if (listContainer.children.length === 0) return;

    const confirmation = confirm("Are you sure you want to delete all tasks? This cannot be undone.");
    if (!confirmation) return;

    listContainer.innerHTML = "";
    localStorage.removeItem("tasks");
    updateStats();
    updateEmptyState();
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;

    // Update active filter button
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    applyFilter();
}

// Apply current filter
function applyFilter() {
    const allTasks = listContainer.querySelectorAll("li");
    let visibleCount = 0;

    allTasks.forEach(task => {
        let shouldShow = true;

        if (currentFilter === "completed") {
            shouldShow = task.classList.contains("checked");
        } else if (currentFilter === "pending") {
            shouldShow = !task.classList.contains("checked");
        }

        task.style.display = shouldShow ? "" : "none";
        if (shouldShow) visibleCount++;
    });

    updateEmptyState();
}

// Update stats
function updateStats() {
    const allTasks = listContainer.querySelectorAll("li");
    const completedTasks = listContainer.querySelectorAll("li.checked");

    totalTasksDisplay.textContent = allTasks.length;
    completedTasksDisplay.textContent = completedTasks.length;

    // Show/hide action buttons
    clearCompletedBtn.style.display = completedTasks.length > 0 ? "block" : "none";
    clearAllBtn.style.display = allTasks.length > 0 ? "block" : "none";
}

// Update empty state visibility
function updateEmptyState() {
    const visibleTasks = Array.from(listContainer.querySelectorAll("li")).filter(
        task => task.style.display !== "none"
    );
    emptyState.classList.toggle("show", visibleTasks.length === 0);
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    listContainer.querySelectorAll("li").forEach(task => {
        tasks.push({
            text: task.querySelector(".task-text").textContent,
            completed: task.classList.contains("checked")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) return;

    try {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            const li = createTaskElement(task.text);
            if (task.completed) {
                li.classList.add("checked");
                const statusSpan = li.querySelector(".status");
                statusSpan.textContent = "Completed";
                statusSpan.className = "status status-completed";
            }
            listContainer.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
        localStorage.removeItem("tasks");
    }
}

// Add fade out animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
init();