// main.js

// main.js

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvofdl83hhdL31MXlA8hbnU0CHjPSDb7w",
  authDomain: "productivepro-235ec.firebaseapp.com",
  projectId: "productivepro-235ec",
  storageBucket: "productivepro-235ec.appspot.com",
  messagingSenderId: "719890419030",
  appId: "1:719890419030:web:666fbef7feaaccceafdaf7",
  measurementId: "G-1388CRZH9M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Firestore
const db = firebase.firestore();

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Existing initialization functions
  initializePomodoro();
  initializeTaskManager();
  initializeMatrix();
  initializeLinkOrganizer();
  initializeGoalSetting();
  initializeFocusTimer();
  initializeAnalyticsDashboard();
  initializeVoiceCommands(); // Placeholder
  initializeCalendarIntegration(); // Updated
  
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
  });

  // Initialize Authentication UI
  initializeAuthenticationUI();
});

/* =========================
 Authentication UI Management
 ========================= */
function initializeAuthenticationUI() {
  // Get DOM elements
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const loginButton = document.getElementById('login-button');
  const signupButton = document.getElementById('signup-button');
  const logoutButton = document.getElementById('logout-button');
  const closeLogin = document.getElementById('close-login');
  const closeSignup = document.getElementById('close-signup');
  const showSignup = document.getElementById('show-signup');
  const showLogin = document.getElementById('show-login');
  const userEmailSpan = document.getElementById('user-email'); // Optional

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  const mainContent = document.getElementById('main-content');
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info'); // Optional

  // Open Login Modal
  loginButton.addEventListener('click', () => {
      loginModal.style.display = 'block';
  });

  // Open Signup Modal
  signupButton.addEventListener('click', () => {
      signupModal.style.display = 'block';
  });

  // Close Modals
  closeLogin.addEventListener('click', () => {
      loginModal.style.display = 'none';
  });

  closeSignup.addEventListener('click', () => {
      signupModal.style.display = 'none';
  });

  // Switch to Signup Modal from Login Modal
  showSignup.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'none';
      signupModal.style.display = 'block';
  });

  // Switch to Login Modal from Signup Modal
  showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      signupModal.style.display = 'none';
      loginModal.style.display = 'block';
  });

  // Handle Signup
  signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();

      auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Signed up successfully
              const user = userCredential.user;
              alert('Signup successful!');
              signupModal.style.display = 'none';
          })
          .catch((error) => {
              console.error(error);
              alert(error.message);
          });
  });

  // Handle Login
  loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Logged in successfully
              const user = userCredential.user;
              alert('Login successful!');
              loginModal.style.display = 'none';
          })
          .catch((error) => {
              console.error(error);
              alert(error.message);
          });
  });

  // Handle Logout
  logoutButton.addEventListener('click', () => {
      auth.signOut()
          .then(() => {
              alert('Logged out successfully!');
          })
          .catch((error) => {
              console.error(error);
              alert(error.message);
          });
  });

  // Listen to Auth State Changes
  auth.onAuthStateChanged((user) => {
      if (user) {
          // User is signed in
          loginButton.style.display = 'none';
          signupButton.style.display = 'none';
          logoutButton.style.display = 'block';

          // Show main content
          mainContent.style.display = 'block';

          // // Optional: Display user email
          // if (userEmailSpan) {
          //     userEmailSpan.textContent = user.email;
          //     userInfo.style.display = 'inline'; // Ensure userInfo is visible
          // }

      } else {
          // No user is signed in
          loginButton.style.display = 'block';
          signupButton.style.display = 'block';
          logoutButton.style.display = 'none';

          // Hide main content
          mainContent.style.display = 'none';

          // Optional: Hide user info
          if (userEmailSpan) {
              userEmailSpan.textContent = '';
              userInfo.style.display = 'none';
          }
      }
  });

  // Close modals when clicking outside of them
  window.addEventListener('click', (event) => {
      if (event.target == loginModal) {
          loginModal.style.display = 'none';
      }
      if (event.target == signupModal) {
          signupModal.style.display = 'none';
      }
  });
}


/* =========================
   Pomodoro Timer Module
   ========================= */
function initializePomodoro() {
  const timerDisplay = document.getElementById("pomodoro-timer-display");
  const startButton = document.getElementById("start-pomodoro");
  const resetButton = document.getElementById("reset-pomodoro");
  const sessionsDisplay = document.getElementById("pomodoro-sessions");

  let pomodoroDuration = 25 * 60; // 25 minutes
  let breakDuration = 5 * 60; // 5 minutes
  let timer = null;
  let isPomodoro = true;
  let sessions = 0;

  startButton.addEventListener("click", () => {
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
            alert("Break time!");
            pomodoroDuration = breakDuration;
            isPomodoro = false;
          } else {
            alert("Pomodoro session complete!");
            pomodoroDuration = 25 * 60;
            isPomodoro = true;
          }
        }
      }, 1000);
    }
  });

  resetButton.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    pomodoroDuration = 25 * 60;
    isPomodoro = true;
    updateTimerDisplay(pomodoroDuration, timerDisplay);
  });

  function updateTimerDisplay(time, display) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    display.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

/* =========================
   Task Management Module
   ========================= */
function initializeTaskManager() {
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");

  let tasks = [];

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.getElementById("task-input").value.trim();
    if (taskInput) {
      const task = { id: Date.now(), name: taskInput, completed: false };
      tasks.push(task);
      renderTasks();
      taskForm.reset();
    }
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-task")) {
      const taskItem = e.target.closest("li");
      if (taskItem) {
        const taskId = taskItem.dataset.id;
        tasks = tasks.filter((task) => task.id != taskId);
        renderTasks();
      }
    }
    if (e.target.classList.contains("complete-task")) {
      const taskItem = e.target.closest("li");
      if (taskItem) {
        const taskId = taskItem.dataset.id;
        tasks = tasks.map((task) => {
          if (task.id == taskId) task.completed = !task.completed;
          return task;
        });
        renderTasks();
      }
    }
  });

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = task.id;
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
                <span>${task.name}</span>
                <div>
                    <button class="complete-task">${
                      task.completed ? "Undo" : "Complete"
                    }</button>
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
  const matrixContainer = document.querySelector(".matrix-container");
  const pointsDisplay = document.getElementById("points");
  const badgesDisplay = document.getElementById("badges");

  let points = 0;
  let badges = [];

  // For demonstration, let's assume we have a list of tasks
  // In a complete application, this should integrate with the Task Management module
  // Here, we'll add a simple interface to assign tasks to quadrants

  // Create a form to assign tasks to quadrants
  const assignForm = document.createElement("form");
  assignForm.id = "assign-form";
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

  assignForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = document.getElementById("assign-task-input").value.trim();
    const quadrant = document.getElementById("assign-quadrant").value;
    if (taskName) {
      addTaskToMatrix(taskName, quadrant);
      assignForm.reset();
    }
  });

  function addTaskToMatrix(task, quadrant) {
    const quadrantList = document.querySelector(`#${quadrant} ul`);
    const li = document.createElement("li");
    li.textContent = task;
    quadrantList.appendChild(li);

    // Gamification: Award points
    points += 10;
    updateGamification();

    // Check for badges
    if (points >= 50 && !badges.includes("Productivity Novice")) {
      badges.push("Productivity Novice");
      updateGamification();
    }
  }

  function updateGamification() {
    pointsDisplay.textContent = points;
    badgesDisplay.textContent = badges.length > 0 ? badges.join(", ") : "None";
  }
}

/* =========================
   Link Organizer Module
   ========================= */
function initializeLinkOrganizer() {
  const linkForm = document.getElementById("link-form");
  const linkList = document.getElementById("link-list");
  const openAllButton = document.getElementById("open-all-links");

  let links = [];

  linkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const linkInput = document.getElementById("link-input").value.trim();
    const category = document.getElementById("link-category").value.trim();
    if (linkInput && category) {
      const link = { id: Date.now(), url: linkInput, category };
      links.push(link);
      renderLinks();
      linkForm.reset();
    }
  });

  linkList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-link")) {
      const linkId = e.target.parentElement.dataset.id;
      links = links.filter((link) => link.id != linkId);
      renderLinks();
    }
  });

  openAllButton.addEventListener("click", () => {
    links.forEach((link) => {
      window.open(link.url, "_blank");
    });
  });

  function renderLinks() {
    linkList.innerHTML = "";
    links.forEach((link) => {
      const li = document.createElement("li");
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
  const goalForm = document.getElementById("goal-form");
  const goalList = document.getElementById("goal-list");

  let goals = [];

  goalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const goalInput = document.getElementById("goal-input").value.trim();
    if (goalInput) {
      const goal = { id: Date.now(), name: goalInput, milestones: [] };
      goals.push(goal);
      renderGoals();
      goalForm.reset();
    }
  });

  goalList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-goal")) {
      const goalId = e.target.parentElement.dataset.id;
      goals = goals.filter((goal) => goal.id != goalId);
      renderGoals();
    }
  });

  function renderGoals() {
    goalList.innerHTML = "";
    goals.forEach((goal) => {
      const li = document.createElement("li");
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
  const timerDisplay = document.getElementById("focus-timer-display");
  const startButton = document.getElementById("start-focus");
  const resetButton = document.getElementById("reset-focus");
  const playMusicButton = document.getElementById("play-music");
  const stopMusicButton = document.getElementById("stop-music");
  const musicSelect = document.getElementById("music-select");

  let focusDuration = 50 * 60; // 50 minutes
  let timer = null;
  let focusMusic = null;

  startButton.addEventListener("click", () => {
    if (!timer) {
      timer = setInterval(() => {
        focusDuration--;
        updateTimerDisplay(focusDuration, timerDisplay);
        if (focusDuration <= 0) {
          clearInterval(timer);
          timer = null;
          alert("Focus session complete!");
        }
      }, 1000);
    }
  });

  resetButton.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    focusDuration = 50 * 60;
    updateTimerDisplay(focusDuration, timerDisplay);
  });

  playMusicButton.addEventListener("click", () => {
    const selectedTrack = musicSelect.value;
    if (selectedTrack !== "none") {
      if (focusMusic) focusMusic.pause();
      focusMusic = new Audio(`assets/music/${selectedTrack}.mp3`);
      focusMusic.loop = true;
      focusMusic.play();
    }
  });

  stopMusicButton.addEventListener("click", () => {
    if (focusMusic) {
      focusMusic.pause();
      focusMusic = null;
    }
  });

  function updateTimerDisplay(time, display) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    display.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

/* =========================
   Analytics Dashboard Module
   ========================= */
function initializeAnalyticsDashboard() {
  const ctx = document.getElementById("analytics-chart").getContext("2d");

  // Sample data; in a real application, this would be dynamic
  const data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Pomodoro Sessions",
        data: [5, 3, 6, 2, 4, 0, 1],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const analyticsChart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // To update the chart with real data, integrate with your task and pomodoro data
}

/* =========================
   Voice Command Integration Module (Placeholder)
   ========================= */
function initializeVoiceCommands() {
  // Voice command integration typically requires backend support.
  // Here's a basic example using the Web Speech API for limited functionality.

  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    console.warn("Web Speech API not supported in this browser.");
    return;
  }

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.continuous = false;

  const voiceButton = document.createElement("button");
  voiceButton.textContent = "Start Voice Command";
  voiceButton.style.position = "fixed";
  voiceButton.style.bottom = "20px";
  voiceButton.style.right = "20px";
  voiceButton.style.padding = "0.5em 1em";
  voiceButton.style.backgroundColor = "#4CAF50";
  voiceButton.style.color = "#fff";
  voiceButton.style.border = "none";
  voiceButton.style.borderRadius = "4px";
  voiceButton.style.cursor = "pointer";
  voiceButton.style.zIndex = "1001"; // Above other elements
  document.body.appendChild(voiceButton);

  voiceButton.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    handleVoiceCommand(command);
  };

  function handleVoiceCommand(command) {
    if (command.includes("start pomodoro")) {
      document.getElementById("start-pomodoro").click();
    }
    if (command.includes("reset pomodoro")) {
      document.getElementById("reset-pomodoro").click();
    }
    if (command.includes("start focus")) {
      document.getElementById("start-focus").click();
    }
    if (command.includes("reset focus")) {
      document.getElementById("reset-focus").click();
    }
    // Add more command handlers as needed
    alert(`Command received: "${command}"`);
  }
}

/* =========================
   Google Calendar Integration Module
   ========================= */
function initializeCalendarIntegration() {
  const syncButton = document.getElementById("sync-calendar");
  const calendarEventsList = document.getElementById("calendar-events");

  // Replace with your actual Client ID
  const CLIENT_ID = "989919565236-m8a52kt9u0riiqqokevkjso0h0j76blv.apps.googleusercontent.com";

  // Desired OAuth 2.0 scopes
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  // Initialize token client
  let tokenClient;

  // Initialize GIS token client
  function initializeTokenClient() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          displayError(`Error obtaining access token: ${tokenResponse.error}`);
          return;
        }
        // Initialize gapi.client with the access token
        initializeGapiClient(tokenResponse.access_token);
      },
    });
  }

  // Initialize gapi.client with the access token
  function initializeGapiClient(accessToken) {
    gapi.load("client", () => {
      gapi.client.setToken({ access_token: accessToken });
      gapi.client.load("calendar", "v3", () => {
        fetchCalendarEvents();
      });
    });
  }

  // Handle Sync Button Click
  function handleSyncButtonClick() {
    // Request an access token
    tokenClient.requestAccessToken({ prompt: "consent" });
  }

  // Fetch Calendar Events
  function fetchCalendarEvents() {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then(
        (response) => {
          const events = response.result.items;
          calendarEventsList.innerHTML = ""; // Clear existing events

          if (events.length > 0) {
            events.forEach((event) => {
              const li = document.createElement("li");
              const when = event.start.dateTime || event.start.date;
              li.textContent = `${event.summary} (${when})`;
              calendarEventsList.appendChild(li);
            });
          } else {
            const li = document.createElement("li");
            li.textContent = "No upcoming events found.";
            calendarEventsList.appendChild(li);
          }
        },
        (error) => {
          displayError("Error fetching events: " + error.result.error.message);
        }
      );
  }

  // Display Error Messages
  function displayError(message) {
    const calendarView = document.getElementById("calendar-view");
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.textContent = message;
    calendarView.appendChild(errorMsg);
  }

  // Initialize the GIS Token Client
  initializeTokenClient();

  // Bind the Sync Button Click
  syncButton.addEventListener("click", handleSyncButtonClick);
}
