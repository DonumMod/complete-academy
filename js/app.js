// Complete Academy - Main Application Logic

const STORAGE_KEY = "complete_academy_v1";

// ---------- State ----------
let state = {
  user: null,           // { name, email, avatar }
  completedLessons: [], // array of lesson ids
  points: 0,
  streak: 0,
  lastActive: null,     // ISO date string
  badges: [],
  playgroundRuns: 0,
  currentLessonId: null
};

// ---------- Persistence ----------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
    }
  } catch (e) {
    console.warn("Could not load state", e);
  }
  updateStreak();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateStreak() {
  const today = new Date().toDateString();
  if (!state.lastActive) {
    state.streak = 0;
    return;
  }
  const last = new Date(state.lastActive).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (last === today) {
    // already counted today
  } else if (last === yesterday) {
    // continue streak later when they complete something
  } else {
    state.streak = 0;
  }
}

function recordActivity() {
  const today = new Date().toDateString();
  const last = state.lastActive ? new Date(state.lastActive).toDateString() : null;

  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === yesterday) {
      state.streak += 1;
    } else {
      state.streak = 1;
    }
    state.lastActive = new Date().toISOString();
    checkBadges();
    saveState();
  }
}

// ---------- Navigation ----------
function navigate(page, params = {}) {
  // Update bottom nav
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  const main = document.getElementById("main-content");
  const topNav = document.getElementById("top-nav");
  const bottomNav = document.getElementById("bottom-nav");

  // Show/hide chrome
  if (page === "landing" || page === "login") {
    topNav.classList.add("hidden");
    bottomNav.classList.add("hidden");
  } else {
    topNav.classList.remove("hidden");
    bottomNav.classList.remove("hidden");
    updateHeader();
  }

  // Render view
  let html = "";
  switch (page) {
    case "landing":   html = renderLanding(); break;
    case "login":     html = renderLogin(); break;
    case "dashboard": html = renderDashboard(); break;
    case "lessons":   html = renderLessons(); break;
    case "lesson":    html = renderLesson(params.id); break;
    case "playground":html = renderPlayground(); break;
    case "buddy":     html = renderBuddy(); break;
    case "progress":  html = renderProgress(); break;
    case "profile":   html = renderProfile(); break;
    default:          html = renderDashboard();
  }

  main.innerHTML = html;
  main.classList.add("animate-in");

  // Post-render hooks
  if (page === "playground") initPlayground();
  if (page === "buddy") initBuddy();
  if (page === "lesson") window.scrollTo(0, 0);
}

function updateHeader() {
  const streakEl = document.getElementById("streak-badge");
  const countEl = document.getElementById("streak-count");
  const avatarBtn = document.getElementById("avatar-btn");

  if (state.streak > 0) {
    streakEl.classList.remove("hidden");
    countEl.textContent = state.streak;
  } else {
    streakEl.classList.add("hidden");
  }

  if (state.user) {
    avatarBtn.textContent = state.user.name.charAt(0).toUpperCase();
  }
}

// ---------- Toast ----------
function showToast(msg, duration = 2500) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), duration);
}

// ---------- Auth (simple local) ----------
function login(name, email) {
  state.user = {
    name: name.trim() || "Learner",
    email: email.trim() || "learner@complete.academy",
    avatar: (name || "L").charAt(0).toUpperCase()
  };
  saveState();
  showToast(`Welcome, ${state.user.name}! 🚀`);
  navigate("dashboard");
}

function logout() {
  if (confirm("Log out? Your progress will stay on this device.")) {
    state.user = null;
    saveState();
    navigate("landing");
  }
}

function demoLogin() {
  login("Demo Learner", "demo@complete.academy");
}

// ---------- Lessons ----------
function completeLesson(id) {
  if (state.completedLessons.includes(id)) {
    showToast("Already completed!");
    return;
  }
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson) return;

  state.completedLessons.push(id);
  state.points += lesson.points;
  recordActivity();
  checkBadges();
  saveState();
  showToast(`+${lesson.points} points! Lesson complete 🎉`);
  navigate("lesson", { id });
}

function isCompleted(id) {
  return state.completedLessons.includes(id);
}

function getProgressPercent() {
  return Math.round((state.completedLessons.length / LESSONS.length) * 100);
}

// ---------- Badges ----------
function checkBadges() {
  const earned = new Set(state.badges);

  if (state.completedLessons.length >= 1) earned.add("first-lesson");
  if (state.streak >= 3) earned.add("streak-3");
  if (state.streak >= 7) earned.add("streak-7");
  if (state.points >= 300) earned.add("points-300");
  if (state.playgroundRuns >= 5) earned.add("coder");

  const beginnerIds = LESSONS.filter(l => l.module === "Beginner").map(l => l.id);
  if (beginnerIds.every(id => state.completedLessons.includes(id))) {
    earned.add("all-beginner");
  }

  state.badges = Array.from(earned);
}

// ---------- Views ----------
function renderLanding() {
  return `
    <div class="min-h-screen flex flex-col">
      <!-- Hero -->
      <section class="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 pt-12 pb-16 px-4">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 50%, #2DD4BF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #EF4444 0%, transparent 40%);"></div>
        <div class="relative max-w-lg mx-auto text-center">
          <div class="inline-flex items-center gap-2 bg-teal-700/50 border border-teal-600 rounded-full px-3 py-1 text-xs font-medium mb-6">
            <span class="w-2 h-2 rounded-full bg-teal-400 pulse-soft"></span>
            Built for FNB App Academy learners
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            From Grassroots<br/>to <span class="text-teal-400">Greatness</span>
          </h1>
          <p class="text-teal-100/90 text-lg mb-8 max-w-md mx-auto">
            The mobile companion that helps you finish the Academy, practise coding, and stay consistent — even offline.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button onclick="navigate('login')" class="btn-primary px-8 py-3.5 text-base">
              Get Started — Free
            </button>
            <button onclick="demoLogin()" class="btn-secondary px-8 py-3.5 text-base">
              Try Demo Account
            </button>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="px-4 py-12 max-w-lg mx-auto w-full">
        <h2 class="text-xl font-bold mb-6 text-center">Everything you need to complete the Academy</h2>
        <div class="space-y-4">
          ${featureCard("📚", "Offline-first lessons", "Core modules cached so you can learn with weak or no connection.")}
          ${featureCard("💻", "Code Playground", "Write and run JavaScript instantly — perfect for practising Academy concepts.")}
          ${featureCard("🔥", "Streaks & Badges", "Daily motivation and recognition that keeps you coming back.")}
          ${featureCard("🤖", "AI Study Buddy", "Ask questions about the curriculum any time (mock for now).")}
          ${featureCard("🏆", "Certificates & Progress", "Track completion and generate shareable proof of your work.")}
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-auto py-8 text-center text-sm text-teal-500/70 px-4">
        <p>Complete Academy · Companion for FNB App Academy</p>
        <p class="mt-1">Built for Best Educational & Best African Solution</p>
      </footer>
    </div>
  `;
}

function featureCard(icon, title, desc) {
  return `
    <div class="card p-4 flex gap-4">
      <div class="text-2xl">${icon}</div>
      <div>
        <h3 class="font-semibold">${title}</h3>
        <p class="text-sm text-teal-200/80 mt-0.5">${desc}</p>
      </div>
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-teal-700 flex items-center justify-center text-2xl font-bold mx-auto mb-4">CA</div>
          <h1 class="text-2xl font-bold">Welcome back</h1>
          <p class="text-teal-300 mt-1 text-sm">Sign in to continue your learning journey</p>
        </div>

        <div class="card p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-teal-200 mb-1.5">Your name</label>
            <input id="login-name" type="text" placeholder="e.g. Thabo Molefe"
              class="w-full bg-teal-950/60 border border-teal-700 rounded-xl px-4 py-3 text-white placeholder-teal-600 focus:outline-none focus:border-teal-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-teal-200 mb-1.5">Email (optional)</label>
            <input id="login-email" type="email" placeholder="you@email.com"
              class="w-full bg-teal-950/60 border border-teal-700 rounded-xl px-4 py-3 text-white placeholder-teal-600 focus:outline-none focus:border-teal-500" />
          </div>
          <button onclick="handleLogin()" class="btn-primary w-full py-3.5 mt-2">
            Start Learning
          </button>
          <button onclick="demoLogin()" class="btn-secondary w-full py-3">
            Use Demo Account
          </button>
        </div>

        <p class="text-center text-xs text-teal-600 mt-6">
          Progress is saved on this device only (localStorage).
        </p>
      </div>
    </div>
  `;
}

function handleLogin() {
  const name = document.getElementById("login-name").value;
  const email = document.getElementById("login-email").value;
  login(name, email);
}

function renderDashboard() {
  const percent = getProgressPercent();
  const nextLesson = LESSONS.find(l => !isCompleted(l.id));

  return `
    <div class="max-w-lg mx-auto px-4 py-6 pb-24">
      <div class="mb-6">
        <p class="text-teal-400 text-sm font-medium">Good day,</p>
        <h1 class="text-2xl font-bold">${state.user?.name || "Learner"} 👋</h1>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="card p-3 text-center">
          <div class="text-2xl font-bold text-teal-400">${state.points}</div>
          <div class="text-xs text-teal-300 mt-0.5">Points</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-2xl font-bold text-orange">${state.streak}</div>
          <div class="text-xs text-teal-300 mt-0.5">Day streak</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-2xl font-bold text-teal-400">${state.completedLessons.length}/${LESSONS.length}</div>
          <div class="text-xs text-teal-300 mt-0.5">Lessons</div>
        </div>
      </div>

      <!-- Overall progress -->
      <div class="card p-4 mb-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="font-medium">Academy Progress</span>
          <span class="text-teal-400 font-semibold">${percent}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
      </div>

      <!-- Continue learning -->
      ${nextLesson ? `
        <div class="mb-6">
          <h2 class="font-semibold mb-3">Continue Learning</h2>
          <div class="card card-hover p-4 cursor-pointer" onclick="navigate('lesson', {id: '${nextLesson.id}'})">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center text-xl shrink-0">📖</div>
              <div class="flex-1 min-w-0">
                <div class="text-xs text-teal-400 font-medium mb-0.5">${nextLesson.module} · ${nextLesson.duration}</div>
                <h3 class="font-semibold truncate">${nextLesson.title}</h3>
                <p class="text-sm text-teal-200/70 mt-0.5 line-clamp-2">${nextLesson.description}</p>
              </div>
            </div>
            <button class="btn-primary w-full mt-4 py-2.5 text-sm">Continue →</button>
          </div>
        </div>
      ` : `
        <div class="card p-6 text-center mb-6">
          <div class="text-4xl mb-2">🎉</div>
          <h3 class="font-bold text-lg">All lessons complete!</h3>
          <p class="text-teal-300 text-sm mt-1">Generate your certificate on the Progress page.</p>
        </div>
      `}

      <!-- Quick actions -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button onclick="navigate('playground')" class="card card-hover p-4 text-left">
          <div class="text-2xl mb-1">💻</div>
          <div class="font-semibold text-sm">Code Playground</div>
        </button>
        <button onclick="navigate('buddy')" class="card card-hover p-4 text-left">
          <div class="text-2xl mb-1">🤖</div>
          <div class="font-semibold text-sm">AI Study Buddy</div>
        </button>
      </div>

      <!-- Recent badges -->
      ${state.badges.length ? `
        <div>
          <h2 class="font-semibold mb-3">Your Badges</h2>
          <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            ${state.badges.map(id => {
              const b = BADGES.find(x => x.id === id);
              return b ? `<div class="card px-3 py-2 flex items-center gap-2 shrink-0"><span>${b.icon}</span><span class="text-sm font-medium">${b.name}</span></div>` : "";
            }).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderLessons() {
  return `
    <div class="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 class="text-2xl font-bold mb-1">Lessons</h1>
      <p class="text-teal-300 text-sm mb-6">FNB App Academy aligned curriculum</p>

      <div class="space-y-3">
        ${LESSONS.map(lesson => {
          const done = isCompleted(lesson.id);
          return `
            <div class="card card-hover p-4 cursor-pointer ${done ? 'opacity-80' : ''}" onclick="navigate('lesson', {id: '${lesson.id}'})">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl ${done ? 'bg-teal-600' : 'bg-teal-800'} flex items-center justify-center text-lg shrink-0">
                  ${done ? "✓" : "📖"}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-xs font-medium text-teal-400">${lesson.module}</span>
                    <span class="text-xs text-teal-500">· ${lesson.duration}</span>
                    ${done ? '<span class="badge bg-teal-700 text-teal-300">Completed</span>' : ''}
                  </div>
                  <h3 class="font-semibold">${lesson.title}</h3>
                  <p class="text-sm text-teal-200/70 mt-0.5">${lesson.description}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-xs text-orange font-medium">+${lesson.points} pts</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderLesson(id) {
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson) return `<div class="p-8 text-center">Lesson not found</div>`;

  const done = isCompleted(id);

  return `
    <div class="max-w-lg mx-auto px-4 py-6 pb-28">
      <button onclick="navigate('lessons')" class="text-teal-400 text-sm font-medium mb-4 flex items-center gap-1">
        ← Back to lessons
      </button>

      <div class="mb-6">
        <div class="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
          <span>${lesson.module}</span>
          <span>·</span>
          <span>${lesson.duration}</span>
          <span>·</span>
          <span class="text-orange">+${lesson.points} pts</span>
        </div>
        <h1 class="text-2xl font-bold">${lesson.title}</h1>
      </div>

      <div class="lesson-content card p-5 mb-6">
        ${lesson.content}
      </div>

      <div class="fixed bottom-20 left-0 right-0 px-4 z-40">
        <div class="max-w-lg mx-auto">
          ${done
            ? `<button class="btn-secondary w-full py-3.5" disabled>✓ Completed</button>`
            : `<button onclick="completeLesson('${id}')" class="btn-primary w-full py-3.5 shadow-lg">Mark as Complete · +${lesson.points} pts</button>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderPlayground() {
  return `
    <div class="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 class="text-2xl font-bold mb-1">Code Playground</h1>
      <p class="text-teal-300 text-sm mb-4">Write & run JavaScript instantly</p>

      <div class="card overflow-hidden mb-4">
        <div class="bg-teal-900 px-3 py-2 flex items-center justify-between text-xs">
          <span class="font-medium text-teal-300">editor.js</span>
          <button onclick="runCode()" class="btn-primary px-3 py-1 text-xs">Run ▶</button>
        </div>
        <textarea id="code-editor" rows="12" class="w-full bg-teal-950 p-4 text-teal-100 focus:outline-none resize-y"
          spellcheck="false">// Welcome to the Complete Academy Playground
// Try editing this code and hit Run

function greet(name) {
  return "Sawubona, " + name + "! Welcome to Complete Academy 🚀";
}

console.log(greet("Developer"));
console.log("Points so far:", ${state.points});
</textarea>
      </div>

      <div class="card p-4">
        <div class="text-xs font-medium text-teal-400 mb-2">Output</div>
        <pre id="code-output" class="text-sm text-teal-100 whitespace-pre-wrap min-h-[60px]">// Output will appear here</pre>
      </div>

      <p class="text-xs text-teal-600 mt-4 text-center">
        Runs in your browser only · No data leaves your device
      </p>
    </div>
  `;
}

function initPlayground() {
  // already in DOM
}

function runCode() {
  const editor = document.getElementById("code-editor");
  const output = document.getElementById("code-output");
  if (!editor || !output) return;

  const code = editor.value;
  const logs = [];
  const originalLog = console.log;

  console.log = (...args) => {
    logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
  };

  try {
    // eslint-disable-next-line no-eval
    eval(code);
    output.textContent = logs.length ? logs.join("\n") : "(no output)";
    output.classList.remove("text-red-400");
  } catch (err) {
    output.textContent = "Error: " + err.message;
    output.classList.add("text-red-400");
  }

  console.log = originalLog;

  state.playgroundRuns += 1;
  checkBadges();
  saveState();
}

function renderBuddy() {
  return `
    <div class="max-w-lg mx-auto px-4 py-6 pb-24 flex flex-col h-[calc(100vh-8rem)]">
      <h1 class="text-2xl font-bold mb-1">AI Study Buddy</h1>
      <p class="text-teal-300 text-sm mb-4">Ask about the Academy curriculum (mock responses)</p>

      <div id="chat-messages" class="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        <div class="chat-bubble-ai p-3.5 text-sm max-w-[90%]">
          ${MOCK_AI_RESPONSES.default}
        </div>
      </div>

      <div class="flex gap-2">
        <input id="chat-input" type="text" placeholder="Ask about JS, React, design thinking..."
          class="flex-1 bg-teal-900 border border-teal-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500"
          onkeydown="if(event.key==='Enter') sendChat()" />
        <button onclick="sendChat()" class="btn-primary px-4 rounded-xl">Send</button>
      </div>

      <div class="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
        <button onclick="quickAsk('js')" class="badge bg-teal-800 text-teal-200 shrink-0">JS tip</button>
        <button onclick="quickAsk('react')" class="badge bg-teal-800 text-teal-200 shrink-0">React</button>
        <button onclick="quickAsk('design')" class="badge bg-teal-800 text-teal-200 shrink-0">Design Thinking</button>
        <button onclick="quickAsk('motivation')" class="badge bg-teal-800 text-teal-200 shrink-0">Motivation</button>
      </div>
    </div>
  `;
}

function initBuddy() {
  // ready
}

function sendChat() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");
  if (!input || !messages || !input.value.trim()) return;

  const userMsg = input.value.trim();
  input.value = "";

  // User bubble
  messages.innerHTML += `
    <div class="flex justify-end">
      <div class="chat-bubble-user p-3.5 text-sm max-w-[85%]">${escapeHtml(userMsg)}</div>
    </div>
  `;

  // Fake thinking
  setTimeout(() => {
    const reply = getMockReply(userMsg);
    messages.innerHTML += `
      <div class="chat-bubble-ai p-3.5 text-sm max-w-[90%]">${reply}</div>
    `;
    messages.scrollTop = messages.scrollHeight;
  }, 600);

  messages.scrollTop = messages.scrollHeight;
}

function quickAsk(key) {
  const input = document.getElementById("chat-input");
  if (input) {
    input.value = key === "js" ? "Give me a JavaScript tip" :
                  key === "react" ? "Explain React components" :
                  key === "design" ? "How does design thinking work?" :
                  "I need some motivation";
    sendChat();
  }
}

function getMockReply(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes("js") || lower.includes("javascript") || lower.includes("variable")) return MOCK_AI_RESPONSES.js;
  if (lower.includes("react") || lower.includes("component")) return MOCK_AI_RESPONSES.react;
  if (lower.includes("design") || lower.includes("empath")) return MOCK_AI_RESPONSES.design;
  if (lower.includes("motivat") || lower.includes("stuck") || lower.includes("hard")) return MOCK_AI_RESPONSES.motivation;
  if (lower.includes("offline") || lower.includes("data")) return MOCK_AI_RESPONSES.offline;
  if (lower.includes("certif") || lower.includes("progress")) return MOCK_AI_RESPONSES.certificate;
  return "That's a great question! In the full version I will answer using the real Academy curriculum. For now, try asking about JavaScript, React, Design Thinking, or motivation.";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderProgress() {
  const percent = getProgressPercent();
  const canCert = state.completedLessons.length >= 2;

  // Update leaderboard "You" entry
  const board = LEADERBOARD.map(e => {
    if (e.isYou) return { ...e, points: state.points, streak: state.streak, name: state.user?.name || "You" };
    return e;
  }).sort((a, b) => b.points - a.points);

  return `
    <div class="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 class="text-2xl font-bold mb-6">Your Progress</h1>

      <!-- Stats -->
      <div class="card p-5 mb-6">
        <div class="flex justify-between items-end mb-3">
          <div>
            <div class="text-3xl font-bold text-teal-400">${state.points}</div>
            <div class="text-sm text-teal-300">Total points</div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-orange">${state.streak} 🔥</div>
            <div class="text-sm text-teal-300">Day streak</div>
          </div>
        </div>
        <div class="progress-track mb-1">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
        <div class="text-xs text-teal-400 text-right">${percent}% of lessons complete</div>
      </div>

      <!-- Certificate -->
      <div class="card p-5 mb-6 text-center">
        <div class="text-4xl mb-2">📜</div>
        <h3 class="font-bold">Certificate of Completion</h3>
        <p class="text-sm text-teal-300 mt-1 mb-4">
          ${canCert
            ? "You have completed enough lessons to generate a certificate."
            : "Complete at least 2 lessons to unlock your certificate."}
        </p>
        <button onclick="${canCert ? 'generateCertificate()' : "showToast('Complete more lessons first')"}"
          class="${canCert ? 'btn-primary' : 'btn-secondary opacity-60'} px-6 py-2.5 text-sm">
          ${canCert ? "Generate Certificate" : "Locked"}
        </button>
      </div>

      <!-- Badges -->
      <h2 class="font-semibold mb-3">Badges</h2>
      <div class="grid grid-cols-2 gap-3 mb-8">
        ${BADGES.map(b => {
          const earned = state.badges.includes(b.id);
          return `
            <div class="card p-3 ${earned ? '' : 'opacity-40'}">
              <div class="text-2xl mb-1">${b.icon}</div>
              <div class="font-medium text-sm">${b.name}</div>
              <div class="text-xs text-teal-400 mt-0.5">${b.description}</div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Leaderboard teaser -->
      <h2 class="font-semibold mb-3">African Leaderboard (demo)</h2>
      <div class="card overflow-hidden">
        ${board.slice(0, 6).map((e, i) => `
          <div class="flex items-center gap-3 px-4 py-3 ${e.isYou ? 'bg-teal-800/40' : ''} ${i < board.length - 1 ? 'border-b border-teal-800/50' : ''}">
            <div class="w-6 text-center font-bold text-sm text-teal-400">${i + 1}</div>
            <div class="flex-1 font-medium text-sm">${e.country} ${e.name}</div>
            <div class="text-sm text-teal-300">${e.points} pts</div>
            <div class="text-xs text-orange">${e.streak}🔥</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function generateCertificate() {
  const name = state.user?.name || "Learner";
  const date = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

  // Simple printable certificate
  const certWindow = window.open("", "_blank", "width=800,height=600");
  certWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Certificate - Complete Academy</title>
      <style>
        body { font-family: Georgia, serif; background: #0D4F4F; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .cert { background: linear-gradient(135deg, #0D7377, #0D4F4F); border: 8px solid #2DD4BF; border-radius: 16px; padding: 48px; max-width: 640px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        h1 { font-size: 2rem; margin: 0 0 8px; color: #2DD4BF; }
        h2 { font-size: 1.75rem; margin: 16px 0; }
        .name { font-size: 2.25rem; font-weight: bold; color: #fff; margin: 24px 0; border-bottom: 2px solid #2DD4BF; display: inline-block; padding-bottom: 8px; }
        .meta { color: #99f6e4; font-size: 0.95rem; margin-top: 24px; }
        .badge { display: inline-block; background: #EF4444; color: white; padding: 6px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: bold; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="cert">
        <div style="font-size: 3rem;">🏆</div>
        <h1>Certificate of Completion</h1>
        <p style="color:#99f6e4;">Complete Academy · FNB App Academy Companion</p>
        <p style="margin-top:24px;">This certifies that</p>
        <div class="name">${name}</div>
        <p>has successfully completed core lessons and demonstrated commitment to digital skills development.</p>
        <div class="badge">${state.points} Points Earned</div>
        <div class="meta">
          <p>${date}</p>
          <p style="margin-top:8px; font-size:0.8rem;">From Grassroots to Greatness</p>
        </div>
      </div>
      <script>setTimeout(() => window.print(), 500)</script>
    </body>
    </html>
  `);
  certWindow.document.close();
  showToast("Certificate ready — print or save as PDF");
}

function renderProfile() {
  return `
    <div class="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 class="text-2xl font-bold mb-6">Profile</h1>

      <div class="card p-6 text-center mb-6">
        <div class="w-20 h-20 rounded-full bg-teal-700 flex items-center justify-center text-3xl font-bold mx-auto mb-3">
          ${state.user?.avatar || "U"}
        </div>
        <h2 class="text-xl font-bold">${state.user?.name || "Learner"}</h2>
        <p class="text-teal-400 text-sm">${state.user?.email || ""}</p>
        <div class="flex justify-center gap-4 mt-4 text-sm">
          <div><span class="font-bold text-teal-300">${state.points}</span> pts</div>
          <div><span class="font-bold text-orange">${state.streak}</span> streak</div>
          <div><span class="font-bold text-teal-300">${state.completedLessons.length}</span> lessons</div>
        </div>
      </div>

      <div class="space-y-2">
        <button onclick="navigate('progress')" class="card card-hover w-full p-4 text-left flex items-center justify-between">
          <span>View Progress & Certificates</span>
          <span>→</span>
        </button>
        <button onclick="showToast('Mentorship matching coming in Phase 2')" class="card card-hover w-full p-4 text-left flex items-center justify-between">
          <span>Find a Mentor</span>
          <span class="text-xs text-teal-500">Soon</span>
        </button>
        <button onclick="showToast('Alumni network coming soon')" class="card card-hover w-full p-4 text-left flex items-center justify-between">
          <span>Alumni Network</span>
          <span class="text-xs text-teal-500">Soon</span>
        </button>
      </div>

      <button onclick="logout()" class="btn-secondary w-full mt-8 py-3 text-sm">
        Log out
      </button>

      <p class="text-center text-xs text-teal-600 mt-6">
        Complete Academy v0.1 · Demo for FNB App of the Year
      </p>
    </div>
  `;
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  loadState();

  // Bottom nav clicks
  document.getElementById("bottom-nav").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn");
    if (btn && btn.dataset.page) {
      navigate(btn.dataset.page);
    }
  });

  // Start
  if (state.user) {
    navigate("dashboard");
  } else {
    navigate("landing");
  }

  // Service worker for offline support
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
});
