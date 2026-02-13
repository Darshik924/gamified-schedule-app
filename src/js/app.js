//Adding the quests part, don't change pls

import { loadFromLocalStor, saveToLocalStor } from "./backend.js";

console.log("JS LOADED");
const modal = document.getElementById("taskModal");

const openTodoBtn = document.getElementById("openModal");
const openProgressBtn = document.getElementById("openModalProgress");

const cancelBtn = document.getElementById("cancelTask");
const saveBtn = document.getElementById("saveTask");

const taskNameInput = document.getElementById("taskName");
const taskTimeInput = document.getElementById("taskTime");

const todoContainer = document.getElementById("todoContainer");
const progressContainer = document.getElementById("progressContainer");
const completedContainer = document.getElementById("completedContainer");

let selectedDifficulty = null;
let activeColumn = null;
const profileBtn = document.querySelector(".profile-btn");
const profileBackBtn = document.querySelector(".profile-backbtn");

const userXP = document.querySelector(".user-xp");
const userName = document.querySelector(".user-name");
const xpBar = document.querySelector(".xp-bar");
const userCoins = document.querySelector(".user-coins");
const userLevel = document.querySelector(".user-level");
const userTotTasks = document.querySelector(".completed-tasks");
const userAchievements = document.querySelector(".achievements");

const view = {
  VIEW: "MAIN",
};

const profilePage = document.querySelector(".profile-content");
const mainPage = document.querySelector(".main-content");

profileBtn.addEventListener("click", () => {
  view.VIEW = view.VIEW === "MAIN" ? "PROFILE" : "MAIN";
  renderView();
});
profileBackBtn.addEventListener("click", () => {
  view.VIEW = view.VIEW === "PROFILE" ? "MAIN" : "PROFILE";
  renderView();
});

let appData = loadFromLocalStor();

if (!appData) {
  appData = {
    user: {
      name: "Epic Quester",
      level: 1,
      xp: 0,
      maxXp: 1000,
      totalXp: 0,
      completedTasks: 0,
      achievements: 0,
      coins: 500,
    },

    tasks: [],
  };

  saveToLocalStor(appData);
}

// 🔥 Normalize old saves
if (!appData.user.completedTasks) {
  appData.user.completedTasks = 0;
}

if (!appData.user.coins) {
  appData.user.coins = 0;
}

renderView();
renderProfile(appData);
renderData(appData);

function renderData(appData) {
  const { user } = appData;

  userName.textContent = user.name;
  userLevel.textContent = `Level ${user.level}`;
  userCoins.textContent = user.coins ?? 0;

  userXP.textContent = `${user.xp} / ${user.maxXp}`;
  xpBar.style.width = `${(user.xp / user.maxXp) * 100}%`;

  userTotTasks.textContent = `${user.completedTasks}`;
}

function renderProfile(appData) {
  if (!appData || !appData.user) return;

  const { user } = appData;

  // Select elements
  const usernameEl = document.querySelector("[data-username]");
  const levelBadgeEl = document.querySelector("[data-level-badge]");
  const xpTextEl = document.querySelector("[data-xp-text]");
  const xpBarEl = document.querySelector("[data-xp-bar]");
  const hpTextEl = document.querySelector("[data-hp-text]");
  const hpBarEl = document.querySelector("[data-hp-bar]");
  const totalXpEl = document.querySelector("[data-total-xp]");
  const healthStatEl = document.querySelector("[data-health-stat]");
  const levelTextEl = document.querySelector("[data-level-text]");

  // Safety check
  if (!usernameEl) return;

  // Set values
  usernameEl.textContent = user.name;
  levelBadgeEl.textContent = `Level ${user.level} ★`;
  xpTextEl.textContent = `${user.xp} / ${user.maxXp}`;
  hpTextEl.textContent = `${user.hp}%`;

  totalXpEl.textContent = user.totalXp || user.xp;
  healthStatEl.textContent = `${user.hp}%`;
  levelTextEl.textContent = `Level ${user.level}`;

  // Calculate XP %
  const xpPercent = Math.min((user.xp / user.maxXp) * 100, 100);
  xpBarEl.style.width = `${xpPercent}%`;
}

function renderView() {
  if (view.VIEW === "PROFILE") {
    profilePage.style.display = "block";
    mainPage.style.display = "none";
  } else {
    profilePage.style.display = "none";
    mainPage.style.display = "block";
  }
}

// ================= OPEN MODAL =================

openTodoBtn.addEventListener("click", () => {
  activeColumn = todoContainer;
  modal.classList.remove("hidden");
});

openProgressBtn.addEventListener("click", () => {
  activeColumn = progressContainer;
  modal.classList.remove("hidden");
});

// ================= CLOSE MODAL =================

cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.add("hidden");
  resetForm();
}

// ================= DIFFICULTY SELECT =================

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".difficulty-btn")
      .forEach((b) => b.classList.remove("bg-[#8b5cf6]", "text-white"));

    btn.classList.add("bg-[#8b5cf6]", "text-white");
    selectedDifficulty = btn.innerText;
  });
});

// ================= SAVE TASK =================

saveBtn.addEventListener("click", () => {
  const name = taskNameInput.value.trim();
  const time = taskTimeInput.value.trim();

  if (!name || !selectedDifficulty || !time) {
    alert("Make sure you have filled everything");
    return;
  }

  const card = createTaskCard(name, selectedDifficulty, time);
  activeColumn.appendChild(card);
  updateCounts();

  if (activeColumn === todoContainer) {
    updateButtons(card, "todo");
  } else {
    updateButtons(card, "progress");
  }

  closeModal();
});

// ================= CREATE TASK CARD =================

function createTaskCard(name, difficulty, time) {
  let difficultyColor = "bg-[#06b6d4]";
  if (difficulty === "Medium") difficultyColor = "bg-[#ffd700]";
  if (difficulty === "Hard") difficultyColor = "bg-red-500";

  const card = document.createElement("div");
  card.className =
    "p-4 rounded-xl bg-[hsl(260_25%_15%)] border border-[hsl(260_25%_20%)] hover:border-[#8b5cf6] transition duration-300";

  card.innerHTML = `
    <div class = "flex justify-between items-center mb-3">
        <h4 class = "font-bold font-sans text-2xl items-center">${name}</h4>
        <span class = "text-xs px-2 py-1 rounded ${difficultyColor} text-black font-bold">
            ${difficulty}
        </span>
    </div>
    <p class="text-md font-sans mb-4 font-bold hover text-[hsl(210_20%_70%)]">
      Deadline: ${time} hours
    </p>

    <div class = "flex gap-4 text-xs"> 
    <button class = "move-btn bg-blue-500 p-2 font-bold font-sans rounded-2xl hover:cursor-pointer hover:bg-blue-800 text-shadow-white">To-Do </button>
    <button class="move-btn bg-amber-500 p-2 font-bold font-sans rounded-2xl hover:cursor-pointer hover:bg-amber-700 text-shadow-white">Progress</button>
    <button class="move-btn bg-green-600 p-2 font-bold font-sans rounded-2xl hover:cursor-pointer hover:bg-green-800 text-shadow-white">Done</button>
    `;

  attachMoveLogic(card);
  return card;
}

// ================= Movement Logic =================

function attachMoveLogic(card) {
  const buttons = card.querySelectorAll(".move-btn");

  buttons[0].addEventListener("click", () => {
    todoContainer.appendChild(card);
    updateCounts();
    updateButtons(card, "todo");
  });

  buttons[1].addEventListener("click", () => {
    progressContainer.appendChild(card);
    updateCounts();
    updateButtons(card, "progress");
  });

  buttons[2].addEventListener("click", () => {
    completedContainer.appendChild(card);
    updateButtons(card, "completed");
    updateCounts();
  });
}

// ================= CHANGING BUTTONS=================

function updateButtons(card, state) {
  const buttons = card.querySelectorAll(".move-btn");

  if (state === "todo") {
    buttons[0].style.display = "none";
    buttons[1].style.display = "inline-block";
    buttons[2].style.display = "inline-block";
  } else if (state === "progress") {
    buttons[0].style.display = "inline-block";
    buttons[1].style.display = "none";
    buttons[2].style.display = "inline-block";
  } else {
    buttons[0].style.display = "none";
    buttons[1].style.display = "none";
    buttons[2].style.display = "none";
  }
}

// ================= RESET FORM =================
function resetForm() {
  taskNameInput.value = "";
  taskTimeInput.value = "";
  selectedDifficulty = null;

  document
    .querySelectorAll(".difficulty-btn")
    .forEach((b) => b.classList.remove("bg-[#8b5cf6]", "text-white"));
}

// =============UPDATING COUNT LOGIC================

const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const completeCount = document.getElementById("completedCount");
const activeTask = document.getElementById("activeTask");

function updateCounts() {
  todoCount.textContent = todoContainer.children.length;
  progressCount.textContent = progressContainer.children.length;
  completeCount.textContent = completedContainer.children.length;
  activeTask.textContent =
    todoContainer.children.length + progressContainer.children.length;
}
