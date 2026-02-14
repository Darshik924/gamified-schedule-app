import { loadFromLocalStor, saveToLocalStor } from "./backend.js";

document.addEventListener("DOMContentLoaded", () => {
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

  const todoCount = document.getElementById("todoCount");
  const progressCount = document.getElementById("progressCount");
  const completeCount = document.getElementById("completedCount");
  const activeTask = document.getElementById("activeTask");
  const Total = document.getElementById("Total");

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

  const view = { VIEW: "MAIN" };

  const profilePage = document.querySelector(".profile-content");
  const mainPage = document.querySelector(".main-content");

  const XP_REWARDS = {
    Easy: 50,
    Medium: 100,
    Hard: 250,
  };

  updateCounts();

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      view.VIEW = view.VIEW === "MAIN" ? "PROFILE" : "MAIN";
      renderView();
    });
  }

  if (profileBackBtn) {
    profileBackBtn.addEventListener("click", () => {
      view.VIEW = view.VIEW === "PROFILE" ? "MAIN" : "PROFILE";
      renderView();
    });
  }

  if (openTodoBtn) {
    openTodoBtn.addEventListener("click", () => {
      activeColumn = todoContainer;
      modal.classList.remove("hidden");
    });
  }

  if (openProgressBtn) {
    openProgressBtn.addEventListener("click", () => {
      activeColumn = progressContainer;
      modal.classList.remove("hidden");
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  let appData = loadFromLocalStor();

  if (!appData || !appData.tasks || !appData.user) {
    appData = {
      user: {
        name: "Harry Potter",
        level: 1,
        xp: 0,
        maxXp: 1000,
        totalXp: 0,
        completedTasks: 0,
        achievements: 0,
        coins: 500,
        ownedProfiles: [
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
      },
      tasks: [],
    };
    saveToLocalStor(appData);
  }

  if (!appData.user.completedTasks) appData.user.completedTasks = 0;
  if (!appData.user.achievements) appData.user.achievements = 0;
  if (!appData.user.coins) appData.user.coins = 0;
  if (!appData.user.achievementsUnlocked)
    appData.user.achievementsUnlocked = [];

  renderView();
  renderProfile(appData);
  renderAllTasks();
  renderData(appData);
  startTimer();

  function renderData(appData) {
    const { user } = appData;

    if (!userName) return;

    userName.textContent = user.name;
    userLevel.textContent = `Level ${user.level}`;
    userCoins.textContent = user.coins ?? 0;
    userAchievements.textContent = `${user.achievements}`;
    userXP.textContent = `${user.xp} / ${user.maxXp}`;
    const percent = Math.min((user.xp / user.maxXp) * 100, 100);
    xpBar.style.width = `${percent}%`;
    userTotTasks.textContent = `${user.completedTasks}`;
  }

  function renderProfile(appData) {
    if (!appData || !appData.user) return;

    const { user } = appData;

    const usernameEl = document.querySelector("[data-username]");
    const levelBadgeEl = document.querySelector("[data-level-badge]");
    const xpTextEl = document.querySelector("[data-xp-text]");
    const xpBarEl = document.querySelector("[data-xp-bar]");
    const totalXpEl = document.querySelector("[data-total-xp]");
    const levelTextEl = document.querySelector("[data-level-text]");

    if (!usernameEl) return;

    usernameEl.textContent = user.name;
    levelBadgeEl.textContent = `Level ${user.level} ★`;
    xpTextEl.textContent = `${user.xp} / ${user.maxXp}`;
    totalXpEl.textContent = user.totalXp || user.xp;
    levelTextEl.textContent = `Level ${user.level}`;

    const xpPercent = Math.min((user.xp / user.maxXp) * 100, 100);
    xpBarEl.style.width = `${xpPercent}%`;
  }

  function renderView() {
    if (!profilePage || !mainPage) return;

    if (view.VIEW === "PROFILE") {
      profilePage.style.display = "block";
      mainPage.style.display = "none";
    } else {
      profilePage.style.display = "none";
      mainPage.style.display = "block";
    }
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const name = taskNameInput.value.trim();
      const time = taskTimeInput.value.trim();

      if (!name || !selectedDifficulty || !time) {
        alert("Make sure you have filled everything");
        return;
      }

      const newTask = {
        id: Date.now(),
        title: name,
        priority: selectedDifficulty,
        deadline: Date.now() + time * 60 * 60 * 1000,
        status: activeColumn === progressContainer ? "progress" : "todo",
      };

      appData.tasks.push(newTask);
      saveToLocalStor(appData);

      renderAllTasks();
      renderData(appData);
      closeModal();
    });
  }

  function renderAllTasks() {
    if (!todoContainer || !progressContainer || !completedContainer) return;

    todoContainer.innerHTML = "";
    progressContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    appData.tasks.forEach((task) => {
      const card = createTaskCard(
        task.title,
        task.priority,
        task.deadline,
        task.id,
      );

      if (task.status === "todo") {
        todoContainer.appendChild(card);
        updateButtons(card, "todo");
      } else if (task.status === "progress") {
        progressContainer.appendChild(card);
        updateButtons(card, "progress");
      } else {
        completedContainer.appendChild(card);
        updateButtons(card, "completed");
      }
    });

    appData.user.completedTasks = appData.tasks.filter(
      task => task.status === "completed"
    ).length;

    updateCounts();
  }

  function createTaskCard(name, difficulty, time, id) {
    let difficultyColor = "bg-[#06b6d4]";
    if (difficulty === "Medium") difficultyColor = "bg-[#ffd700]";
    if (difficulty === "Hard") difficultyColor = "bg-red-500";

    const card = document.createElement("div");
    card.setAttribute("data-id", id);
    card.className =
      "p-4 rounded-xl bg-[hsl(260_25%_15%)] border border-[hsl(260_25%_20%)] hover:border-[#8b5cf6] transition duration-300";

    card.innerHTML = `
    <div class="flex justify-between items-center mb-3">
        <h4 class="font-bold font-sans text-2xl">${name}</h4>
        <span class="text-xs px-2 py-1 rounded ${difficultyColor} text-black font-bold">
            ${difficulty}
        </span>
    </div>
    <p class="task-time text-md font-sans mb-4 font-bold text-[hsl(210_20%_70%)]"></p>
    <div class="flex gap-4 text-xs">
      <button class="move-btn bg-blue-500 p-2 font-bold rounded-2xl">To-Do</button>
      <button class="move-btn bg-amber-500 p-2 font-bold rounded-2xl">Progress</button>
      <button class="move-btn bg-green-600 p-2 font-bold rounded-2xl">Done</button>
      <button class="delete-btn bg-red-600 p-2 font-bold rounded-2xl">Delete</button>
    </div>
  `;

    attachMoveLogic(card, id);
    return card;
  }

  function startTimer() {
    setInterval(() => {
      const now = Date.now();

      appData.tasks.forEach((task) => {
        const card = document.querySelector(`[data-id="${task.id}"]`);
        if (!card) return;

        const timeEl = card.querySelector(".task-time");
        if (!timeEl) return;

        if (task.status === "completed") {
          timeEl.textContent = "✅ Completed";
          timeEl.classList.remove("text-red-500");
          timeEl.classList.add("text-green-400");
          return;
        }

        const remaining = task.deadline - Date.now();

        if (remaining <= 0) {
          timeEl.textContent = "⛔ Time Over";
          timeEl.classList.add("text-red-500");
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor(
            (remaining % (1000 * 60 * 60)) / (1000 * 60),
          );

          timeEl.textContent = `Deadline: ${hours}h ${minutes}m`;
        }
      });
    }, 1000);
  }

  function attachMoveLogic(card, taskId) {
    const buttons = card.querySelectorAll(".move-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    buttons[0].addEventListener("click", () => {
      updateTaskStatus(taskId, "todo");
    });

    buttons[1].addEventListener("click", () => {
      updateTaskStatus(taskId, "progress");
    });

    buttons[2].addEventListener("click", () => {
      updateTaskStatus(taskId, "completed");
    });

    deleteBtn.addEventListener("click", () => {
      deleteTask(taskId);
    });
  }

  function updateTaskStatus(id, newStatus) {
  const task = appData.tasks.find((t) => t.id === id);
  if (!task) return;

  const wasCompleted = task.status === "completed";
  task.status = newStatus;

  if (!wasCompleted && newStatus === "completed") {
    handleXP(task.priority);
  }

  saveToLocalStor(appData);
  renderAllTasks();
  renderData(appData);
}

  function handleXP(difficulty) {
    const xpGain = XP_REWARDS[difficulty] || 0;

    appData.user.xp += xpGain;
    appData.user.totalXp += xpGain;
    appData.user.coins += xpGain / 2;

    checkLevelUp();
    checkAchievements();
  }

  function checkLevelUp() {
    const { user } = appData;

    while (user.xp >= user.maxXp) {
      user.xp -= user.maxXp;
      user.level += 1;
      user.maxXp = Math.floor(user.maxXp * 1.2);

      alert(`🎉 Level Up! You are now Level ${user.level}!`);
    }

    saveToLocalStor(appData);
  }

  function deleteTask(id) {
    appData.tasks = appData.tasks.filter((task) => task.id !== id);

    saveToLocalStor(appData);
    renderAllTasks();
    renderData(appData);
  }

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

  function closeModal() {
    modal.classList.add("hidden");
    resetForm();
  }

  function resetForm() {
    taskNameInput.value = "";
    taskTimeInput.value = "";
    selectedDifficulty = null;

    document
      .querySelectorAll(".difficulty-btn")
      .forEach((b) => b.classList.remove("bg-[#8b5cf6]", "text-white"));
  }

  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      difficultyButtons.forEach((btn) =>
        btn.classList.remove("bg-[#8b5cf6]", "text-white"),
      );

      button.classList.add("bg-[#8b5cf6]", "text-white");

      selectedDifficulty = button.textContent.trim();
    });
  });

  const ACHIEVEMENTS = [
  {
    id: "level_5",
    title: "Level 5",
    description: "Reach Level 5",
    icon: "⭐",
    condition: (user) => user.level >= 5,
  },
  {
    id: "level_10",
    title: "Level 10",
    description: "Reach Level 10",
    icon: "🌟",
    condition: (user) => user.level >= 10,
  },
  {
    id: "complete_5",
    title: "5 Tasks",
    description: "Complete 5 tasks",
    icon: "⚔️",
    condition: (user) => user.completedTasks >= 5,
  },
  {
    id: "complete_10",
    title: "10 Tasks",
    description: "Complete 10 tasks",
    icon: "🏆",
    condition: (user) => user.completedTasks >= 10,
  },
];


function renderBadges() {
  const container = document.getElementById("badgesContainer");
  if (!container) return;

  container.innerHTML = "";

  ACHIEVEMENTS.forEach((badge) => {
    const unlocked = appData.user.achievementsUnlocked.includes(badge.id);

    const badgeEl = document.createElement("div");

    badgeEl.className = `
      p-4 rounded-xl border text-center transition
      ${unlocked 
        ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
        : "bg-gray-800 border-gray-700 text-gray-500 opacity-50"}
    `;

    badgeEl.innerHTML = `
      <div class="text-3xl mb-2">${badge.icon}</div>
      <div class="font-bold">${badge.title}</div>
      <div class="text-xs">${badge.description}</div>
    `;

    container.appendChild(badgeEl);
  });
}


  function checkAchievements() {
    const user = appData.user;

    ACHIEVEMENTS.forEach((achievement) => {
      const alreadyUnlocked =
        user.achievementsUnlocked.includes(achievement.id);

      if (!alreadyUnlocked && achievement.condition(user)) {
        user.achievementsUnlocked.push(achievement.id);
        user.achievements += 1;

        showAchievementPopup(achievement.title);
      }
    });

    saveToLocalStor(appData);
    renderData(appData);
    renderBadges();
  }


  function showAchievementPopup(title) {
    const popup = document.createElement("div");

    popup.className =
      "fixed top-6 right-6 bg-[#1a112e] border border-[#ffd700] text-[#ffd700] px-6 py-4 rounded-xl shadow-lg z-50";

    popup.innerHTML = `
    <div class="font-bold text-lg">🏆 Achievement Unlocked!</div>
    <div class="text-sm mt-1">${title}</div>
  `;

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 3000);
  }


  function updateCounts() {
    if (!todoCount) return;

    todoCount.textContent = todoContainer.children.length;
    progressCount.textContent = progressContainer.children.length;
    completeCount.textContent = completedContainer.children.length;
    activeTask.textContent =
      todoContainer.children.length + progressContainer.children.length;
    Total.textContent = completedContainer.children.length;
  }
  
  renderBadges();
});

let profilePicture = document.getElementsByClassName("profilePicture");

if (localStorage.getItem("loginName") !== null) {
  let userName = Number(localStorage.getItem("loginName"));
  profilePicture[0].setAttribute("src", `./src/assets/hp_${userName + 1}.png`);
} else {
  localStorage.setItem("loginName", 0);
}

