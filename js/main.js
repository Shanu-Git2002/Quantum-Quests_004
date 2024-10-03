// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initializePomodoro();
    initializeTaskManager();
    initializeMatrix();
    initializeLinkOrganizer();
    initializeGoalSetting();
    initializeFocusTimer();
    initializeAnalyticsDashboard();
    initializeVoiceCommands(); // Placeholder
    initializeCalendarIntegration(); // Placeholder

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

/* =========================
   Pomodoro Timer Module
   ========================= */
function initializePomodoro() {
    const timerDisplay = document.getElementById('pomodoro-timer-display');
    const startButton = document.getElementById('start-pomodoro');
    const resetButton = document.getElementById('reset-pomodoro');
    const sessionsDisplay = document.getElementById('pomodoro-sessions');

    let pomodoroDuration = 25 * 60; // 25 minutes
    let breakDuration = 5 * 60; // 5 minutes
    let timer = null;
    let isPomodoro = true;
    let sessions = 0;

    startButton.addEventListener('click', () => {
        if (!timer) {
            timer = setInterval(() => {
                pomodoroDuration--;
                updateTimerDisplay(pomodoroDuration, timerDisplay);
                if (pomodoroDuration <= 0) {
                    clearInterval(timer);
                    timer = null;
                    if (isPomodoro) {
                        sessions++;
                        sessionsDisplay.textContent = sessions;
                        alert('Break time!');
                        pomodoroDuration = breakDuration;
                        isPomodoro = false;
                    } else {
                        alert('Pomodoro session complete!');
                        pomodoroDuration = 25 * 60;
                        isPomodoro = true;
                    }
                }
            }, 1000);
        }
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        timer = null;
        pomodoroDuration = 25 * 60;
        isPomodoro = true;
        updateTimerDisplay(pomodoroDuration, timerDisplay);
    });

    function updateTimerDisplay(time, display) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

/* =========================
   Task Management Module
   ========================= */
function initializeTaskManager() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    let tasks = [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskInput = document.getElementById('task-input').value.trim();
        if (taskInput) {
            const task = { id: Date.now(), name: taskInput, completed: false };
            tasks.push(task);
            renderTasks();
            taskForm.reset();
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-task')) {
            const taskItem = e.target.closest('li');
            if (taskItem) {
                const taskId = taskItem.dataset.id;
                tasks = tasks.filter(task => task.id != taskId);
                renderTasks();
            }
        }
        if (e.target.classList.contains('complete-task')) {
            const taskItem = e.target.closest('li');
            if (taskItem) {
                const taskId = taskItem.dataset.id;
                tasks = tasks.map(task => {
                    if (task.id == taskId) task.completed = !task.completed;
                    return task;
                });
                renderTasks();
            }
        }
    });

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span>${task.name}</span>
                <div>
                    <button class="complete-task">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-task">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
}


/* =========================
   Urgent Important Matrix Module
   ========================= */
function initializeMatrix() {
    const matrixContainer = document.querySelector('.matrix-container');
    const pointsDisplay = document.getElementById('points');
    const badgesDisplay = document.getElementById('badges');

    let points = 0;
    let badges = [];

    // For demonstration, let's assume we have a list of tasks
    // In a complete application, this should integrate with the Task Management module
    // Here, we'll add a simple interface to assign tasks to quadrants

    // Create a form to assign tasks to quadrants
    const assignForm = document.createElement('form');
    assignForm.id = 'assign-form';
    assignForm.innerHTML = `
        <input type="text" id="assign-task-input" placeholder="Task Name" required>
        <select id="assign-quadrant">
            <option value="quadrant1">Urgent & Important</option>
            <option value="quadrant2">Not Urgent & Important</option>
            <option value="quadrant3">Urgent & Not Important</option>
            <option value="quadrant4">Not Urgent & Not Important</option>
        </select>
        <button type="submit">Assign</button>
    `;
    matrixContainer.insertBefore(assignForm, matrixContainer.firstChild);

    assignForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('assign-task-input').value.trim();
        const quadrant = document.getElementById('assign-quadrant').value;
        if (taskName) {
            addTaskToMatrix(taskName, quadrant);
            assignForm.reset();
        }
    });

    function addTaskToMatrix(task, quadrant) {
        const quadrantList = document.querySelector(`#${quadrant} ul`);
        const li = document.createElement('li');
        li.textContent = task;
        quadrantList.appendChild(li);

        // Gamification: Award points
        points += 10;
        updateGamification();

        // Check for badges
        if (points >= 50 && !badges.includes('Productivity Novice')) {
            badges.push('Productivity Novice');
            updateGamification();
        }
    }

    function updateGamification() {
        pointsDisplay.textContent = points;
        badgesDisplay.textContent = badges.length > 0 ? badges.join(', ') : 'None';
    }
}

/* =========================
   Link Organizer Module
   ========================= */
function initializeLinkOrganizer() {
    const linkForm = document.getElementById('link-form');
    const linkList = document.getElementById('link-list');
    const openAllButton = document.getElementById('open-all-links');

    let links = [];

    linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const linkInput = document.getElementById('link-input').value.trim();
        const category = document.getElementById('link-category').value.trim();
        if (linkInput && category) {
            const link = { id: Date.now(), url: linkInput, category };
            links.push(link);
            renderLinks();
            linkForm.reset();
        }
    });

    linkList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-link')) {
            const linkId = e.target.parentElement.dataset.id;
            links = links.filter(link => link.id != linkId);
            renderLinks();
        }
    });

    openAllButton.addEventListener('click', () => {
        links.forEach(link => {
            window.open(link.url, '_blank');
        });
    });

    function renderLinks() {
        linkList.innerHTML = '';
        links.forEach(link => {
            const li = document.createElement('li');
            li.dataset.id = link.id;
            li.innerHTML = `
                <span>[${link.category}] <a href="${link.url}" target="_blank">${link.url}</a></span>
                <button class="delete-link">Delete</button>
            `;
            linkList.appendChild(li);
        });
    }
}

/* =========================
   Goal Setting Module
   ========================= */
function initializeGoalSetting() {
    const goalForm = document.getElementById('goal-form');
    const goalList = document.getElementById('goal-list');

    let goals = [];

    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const goalInput = document.getElementById('goal-input').value.trim();
        if (goalInput) {
            const goal = { id: Date.now(), name: goalInput, milestones: [] };
            goals.push(goal);
            renderGoals();
            goalForm.reset();
        }
    });

    goalList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-goal')) {
            const goalId = e.target.parentElement.dataset.id;
            goals = goals.filter(goal => goal.id != goalId);
            renderGoals();
        }
    });

    function renderGoals() {
        goalList.innerHTML = '';
        goals.forEach(goal => {
            const li = document.createElement('li');
            li.dataset.id = goal.id;
            li.innerHTML = `
                <span>${goal.name}</span>
                <button class="delete-goal">Delete</button>
            `;
            goalList.appendChild(li);
        });
    }
}

/* =========================
   Focus Timer Module
   ========================= */
function initializeFocusTimer() {
    const timerDisplay = document.getElementById('focus-timer-display');
    const startButton = document.getElementById('start-focus');
    const resetButton = document.getElementById('reset-focus');
    const playMusicButton = document.getElementById('play-music');
    const stopMusicButton = document.getElementById('stop-music');
    const musicSelect = document.getElementById('music-select');

    let focusDuration = 50 * 60; // 50 minutes
    let timer = null;
    let focusMusic = null;

    startButton.addEventListener('click', () => {
        if (!timer) {
            timer = setInterval(() => {
                focusDuration--;
                updateTimerDisplay(focusDuration, timerDisplay);
                if (focusDuration <= 0) {
                    clearInterval(timer);
                    timer = null;
                    alert('Focus session complete!');
                }
            }, 1000);
        }
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        timer = null;
        focusDuration = 50 * 60;
        updateTimerDisplay(focusDuration, timerDisplay);
    });

    playMusicButton.addEventListener('click', () => {
        const selectedTrack = musicSelect.value;
        if (selectedTrack !== 'none') {
            if (focusMusic) focusMusic.pause();
            focusMusic = new Audio(`assets/music/${selectedTrack}.mp3`);
            focusMusic.loop = true;
            focusMusic.play();
        }
    });

    stopMusicButton.addEventListener('click', () => {
        if (focusMusic) {
            focusMusic.pause();
            focusMusic = null;
        }
    });

    function updateTimerDisplay(time, display) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

/* =========================
   Analytics Dashboard Module
   ========================= */
function initializeAnalyticsDashboard() {
    const ctx = document.getElementById('analytics-chart').getContext('2d');

    // Sample data; in a real application, this would be dynamic
    const data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Pomodoro Sessions',
            data: [5, 3, 6, 2, 4, 0, 1],
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
    };

    const analyticsChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // To update the chart with real data, integrate with your task and pomodoro data
}

/* =========================
   Voice Command Integration Module (Placeholder)
   ========================= */
function initializeVoiceCommands() {
    // Voice command integration typically requires backend support.
    // Here's a basic example using the Web Speech API for limited functionality.

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Web Speech API not supported in this browser.');
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    const voiceButton = document.createElement('button');
    voiceButton.textContent = 'Start Voice Command';
    voiceButton.style.position = 'fixed';
    voiceButton.style.bottom = '20px';
    voiceButton.style.right = '20px';
    voiceButton.style.padding = '0.5em 1em';
    voiceButton.style.backgroundColor = '#4CAF50';
    voiceButton.style.color = '#fff';
    voiceButton.style.border = 'none';
    voiceButton.style.borderRadius = '4px';
    voiceButton.style.cursor = 'pointer';
    voiceButton.style.zIndex = '1001'; // Above other elements
    document.body.appendChild(voiceButton);

    voiceButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
    };

    function handleVoiceCommand(command) {
        if (command.includes('start pomodoro')) {
            document.getElementById('start-pomodoro').click();
        }
        if (command.includes('reset pomodoro')) {
            document.getElementById('reset-pomodoro').click();
        }
        if (command.includes('start focus')) {
            document.getElementById('start-focus').click();
        }
        if (command.includes('reset focus')) {
            document.getElementById('reset-focus').click();
        }
        // Add more command handlers as needed
        alert(`Command received: "${command}"`);
    }
}

/* =========================
   Google Calendar Integration Module (Placeholder)
   ========================= */
function initializeCalendarIntegration() {
    const syncButton = document.getElementById('sync-calendar');

    syncButton.addEventListener('click', () => {
        alert('Google Calendar integration requires backend setup with OAuth 2.0.');
        // Redirect to backend authentication or provide instructions
    });
}
