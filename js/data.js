// Complete Academy - Static data & curriculum

const LESSONS = [
  {
    id: "js-basics",
    title: "JavaScript Fundamentals",
    module: "Beginner",
    duration: "25 min",
    difficulty: "Beginner",
    points: 100,
    description: "Master the building blocks of modern web and app development.",
    content: `
      <h2>Welcome to JavaScript</h2>
      <p>JavaScript is the language that powers interactive websites and most modern mobile apps. In the FNB App Academy you will use it heavily with React.</p>
      
      <h3>Variables</h3>
      <p>Store data using <code>let</code>, <code>const</code> or (older) <code>var</code>.</p>
      <pre><code>const name = "Thabo";
let age = 22;
age = 23; // allowed with let
// name = "Lerato"; // error - const cannot be reassigned</code></pre>

      <h3>Data Types</h3>
      <ul>
        <li><strong>String</strong> – text: <code>"Hello Africa"</code></li>
        <li><strong>Number</strong> – <code>42</code> or <code>3.14</code></li>
        <li><strong>Boolean</strong> – <code>true</code> or <code>false</code></li>
        <li><strong>Array</strong> – list: <code>["Johannesburg", "Cape Town", "Durban"]</code></li>
        <li><strong>Object</strong> – key-value pairs</li>
      </ul>

      <h3>Functions</h3>
      <pre><code>function greet(name) {
  return "Sawubona, " + name + "!";
}

// Arrow function (modern)
const greet2 = (name) => \`Sawubona, \${name}!\`;

console.log(greet("Nomsa"));</code></pre>

      <h3>Practice Challenge</h3>
      <p>Open the <strong>Code Playground</strong> and write a function that takes a learner's name and returns a welcome message for Complete Academy.</p>
    `
  },
  {
    id: "react-intro",
    title: "Intro to React",
    module: "Beginner",
    duration: "30 min",
    difficulty: "Beginner",
    points: 120,
    description: "Build user interfaces the modern way with components.",
    content: `
      <h2>Why React?</h2>
      <p>React (created by Meta) lets you build complex UIs from small, reusable pieces called <strong>components</strong>. It is the main library taught in the FNB App Academy intermediate path.</p>

      <h3>Your first component</h3>
      <pre><code>function Welcome() {
  return &lt;h1&gt;Welcome to Complete Academy&lt;/h1&gt;;
}</code></pre>

      <h3>JSX</h3>
      <p>JSX looks like HTML but is actually JavaScript. You can embed expressions with curly braces:</p>
      <pre><code>const learner = "Amina";
return &lt;p&gt;Hello, {learner}! Ready to code?&lt;/p&gt;;</code></pre>

      <h3>Props</h3>
      <p>Pass data into components:</p>
      <pre><code>function Badge({ points }) {
  return &lt;span className="badge"&gt;{points} pts&lt;/span&gt;;
}

&lt;Badge points={150} /&gt;</code></pre>

      <h3>State (useState)</h3>
      <p>Make your component interactive:</p>
      <pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;button onClick={() => setCount(count + 1)}&gt;
      Clicked {count} times
    &lt;/button&gt;
  );
}</code></pre>
    `
  },
  {
    id: "design-thinking",
    title: "Design Thinking for Apps",
    module: "Core Skills",
    duration: "20 min",
    difficulty: "Beginner",
    points: 80,
    description: "Solve real African problems with a human-centred process.",
    content: `
      <h2>Design Thinking in 5 Steps</h2>
      <p>The FNB App Academy emphasises solving real problems. Design Thinking gives you a repeatable process.</p>

      <h3>1. Empathise</h3>
      <p>Talk to real users. What are their pain points in daily life, finance, education or agriculture?</p>

      <h3>2. Define</h3>
      <p>Turn insights into a clear problem statement:  
      <em>"Young traders in rural KZN need a simple way to track stock and payments offline."</em></p>

      <h3>3. Ideate</h3>
      <p>Generate many ideas without judging. Quantity first, quality later.</p>

      <h3>4. Prototype</h3>
      <p>Build the smallest version that lets users experience the idea (paper sketches, Figma, or a simple React screen).</p>

      <h3>5. Test</h3>
      <p>Put the prototype in front of real people. Listen. Iterate.</p>

      <h3>African Context Tip</h3>
      <p>Always design for low data, intermittent connectivity, and multiple languages. Offline-first is not a nice-to-have — it is essential.</p>
    `
  },
  {
    id: "git-github",
    title: "Git & GitHub Basics",
    module: "Core Skills",
    duration: "25 min",
    difficulty: "Beginner",
    points: 90,
    description: "Collaborate like a professional developer.",
    content: `
      <h2>Version Control is Non-Negotiable</h2>
      <p>Every serious developer uses Git. GitHub is where most open-source and team projects live.</p>

      <h3>Essential commands</h3>
      <pre><code>git init                  # start a new repo
git add .                 # stage all changes
git commit -m "message"   # save a snapshot
git status                # see what changed
git log                   # history</code></pre>

      <h3>Working with GitHub</h3>
      <pre><code>git remote add origin https://github.com/you/repo.git
git push -u origin main
git pull                  # get latest changes</code></pre>

      <h3>Good commit messages</h3>
      <ul>
        <li>✅ "Add offline lesson caching"</li>
        <li>✅ "Fix progress bar on mobile"</li>
        <li>❌ "updates" or "stuff"</li>
      </ul>

      <p>In the Academy you will push your final projects to GitHub so mentors and judges can review them.</p>
    `
  },
  {
    id: "ux-principles",
    title: "UX Principles for African Apps",
    module: "Core Skills",
    duration: "20 min",
    difficulty: "Beginner",
    points: 85,
    description: "Design interfaces that work for real users on real devices.",
    content: `
      <h2>UX that Works in Africa</h2>
      
      <h3>1. Mobile-first always</h3>
      <p>Most users will experience your app on a mid-range Android phone with a small screen.</p>

      <h3>2. Low data & offline</h3>
      <p>Cache content. Show clear offline indicators. Avoid auto-playing large media.</p>

      <h3>3. Clear hierarchy</h3>
      <p>One primary action per screen. Big, tappable buttons (minimum 44×44 px).</p>

      <h3>4. Feedback</h3>
      <p>Every tap should give immediate visual response. Loading states and success messages matter.</p>

      <h3>5. Accessibility</h3>
      <p>Good contrast, readable font sizes, support for screen readers where possible.</p>

      <h3>Quick test</h3>
      <p>Can your grandmother (or a first-time smartphone user) complete the main task without help? If not, simplify.</p>
    `
  }
];

const BADGES = [
  { id: "first-lesson", name: "First Step", icon: "🌱", description: "Complete your first lesson", requirement: 1 },
  { id: "streak-3", name: "On Fire", icon: "🔥", description: "3-day learning streak", requirement: 3 },
  { id: "streak-7", name: "Unstoppable", icon: "⚡", description: "7-day learning streak", requirement: 7 },
  { id: "points-300", name: "Rising Star", icon: "⭐", description: "Earn 300 points", requirement: 300 },
  { id: "all-beginner", name: "Foundation", icon: "🏗️", description: "Finish all Beginner lessons", requirement: "beginner" },
  { id: "coder", name: "Code Explorer", icon: "💻", description: "Run code in the playground 5 times", requirement: 5 }
];

const MOCK_AI_RESPONSES = {
  default: "I'm your Complete Academy Study Buddy! Ask me anything about JavaScript, React, design thinking, or how to succeed in the FNB App Academy. What would you like to learn today?",
  js: "JavaScript tip: Always prefer `const` and `let` over `var`. Use template literals (backticks) for clean string building: `Hello ${name}`!",
  react: "In React, keep components small and focused. One component = one job. Pass data down with props and lift state up when siblings need to share data.",
  design: "Design Thinking starts with empathy. Before writing any code, talk to at least 3 potential users. Their pain points will guide your best features.",
  motivation: "Every expert was once a beginner. Consistency beats intensity — even 25 focused minutes a day compounds massively over the Academy period. You've got this!",
  offline: "Great question! Complete Academy caches lessons so you can keep learning even with poor connectivity. Just open the lesson once while online.",
  certificate: "When you complete enough lessons and earn points you can generate a shareable certificate from the Progress page. It looks great on LinkedIn!"
};

const LEADERBOARD = [
  { name: "Thabo M.", points: 850, streak: 12, country: "🇿🇦" },
  { name: "Amina K.", points: 720, streak: 9, country: "🇳🇬" },
  { name: "Lerato S.", points: 680, streak: 7, country: "🇿🇦" },
  { name: "You", points: 0, streak: 0, country: "🌍", isYou: true },
  { name: "Kwame O.", points: 540, streak: 5, country: "🇬🇭" },
  { name: "Fatima B.", points: 490, streak: 4, country: "🇰🇪" }
];
