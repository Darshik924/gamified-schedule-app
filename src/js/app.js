//Adding the quests part, don't change pls

console.log("MODULE RUNNING");

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

  updateCounts();

  // ================= SAFE EVENT LISTENERS =================

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
        name: "Epic Quester",
        level: 1,
        xp: 0,
        maxXp: 1000,
        totalXp: 0,
        completedTasks: 0,
        achievements: 0,
        coins: 500,
        ownedProfiles: [true, false, false, false, false, false, false, false, false, false, false, false, false],
      },
      tasks: [],
    };
    saveToLocalStor(appData);
  }

  if (!appData.user.completedTasks) appData.user.completedTasks = 0;
  if (!appData.user.achievements) appData.user.achievements = 0;
  if (!appData.user.coins) appData.user.coins = 0;

  renderView();
  renderProfile(appData);
  renderAllTasks();
  renderData(appData);
  startTimer();

  // ================= RENDER FUNCTIONS =================

  function renderData(appData) {
    const { user } = appData;

    if (!userName) return;

    userName.textContent = user.name;
    userLevel.textContent = `Level ${user.level}`;
    userCoins.textContent = user.coins ?? 0;
    userAchievements.textContent = `${user.achievements}`;
    userXP.textContent = `${user.xp} / ${user.maxXp}`;
    xpBar.style.width = `${(user.xp / user.maxXp) * 100}%`;
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

      appData.tasks.forEach(task => {
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
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

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

    task.status = newStatus;

    saveToLocalStor(appData);
    renderAllTasks();
  }

  function deleteTask(id) {
    appData.tasks = appData.tasks.filter(task => task.id !== id);

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

  // ================= DIFFICULTY SELECTION =================

  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active styles from all
      difficultyButtons.forEach((btn) =>
        btn.classList.remove("bg-[#8b5cf6]", "text-white"),
      );

      // Add active style to clicked one
      button.classList.add("bg-[#8b5cf6]", "text-white");

      // Set selected difficulty
      selectedDifficulty = button.textContent.trim();
    });
  });

  // ================= COUNTS =================

  function updateCounts() {
    if (!todoCount) return;

    todoCount.textContent = todoContainer.children.length;
    progressCount.textContent = progressContainer.children.length;
    completeCount.textContent = completedContainer.children.length;
    activeTask.textContent =
      todoContainer.children.length + progressContainer.children.length;
    Total.textContent = completedContainer.children.length;
  }
});


let profilePicture=document.getElementsByClassName('profilePicture');

if(localStorage.getItem('loginName')!== null){
let userName=Number(localStorage.getItem('loginName'));
profilePicture[0].setAttribute("src", `./src/assets/hp_${userName+1}.png`);
}

else{
  localStorage.setItem('loginName', 0);
}
// const avatars = {
//   Harry: {
//     name: "Harry Potter",
//     image: "src/assets/hp_1.png"
//   },
//   Dobby: {
//     name: "Dobby",
//     image: "src/assets/hp_2.png"
//   },
//   Ron: {
//     name: "Ron Weasly",
//     image: "src/assets/hp_3.png"
//   },
//   Albus: {
//     name: "Albus Dumbledore",
//     image: "src/assets/hp_4.png"
//   },
//   Rubeus: {
//     name: "Rubeus Hagrid",
//     image: "src/assets/hp_5.png"
//   },
//   Draco: {
//     name: "Draco Malfoy",
//     image: "src/assets/hp_6.png"
//   },
//   Voldemort: {
//     name: "Voldemort",
//     image: "src/assets/hp_7.png"
//   },
//   Lucious: {
//     name: "Lucious Malfoy",
//     image: "src/assets/hp_8.png"
//   },
//   Severus: {
//     name: "Severus Snape",
//     image: "src/assets/hp_9.png"
//   },
//   Minerva: {
//     name: "Minerva Mcgonagall",
//     image: "src/assets/hp_10.png"
//   },
//   ginny: {
//     name: "Ginny Weasly",
//     image: "src/assets/hp_11.png"
//   },
//   hermoine: {
//     name: "Hermoine Granger",
//     image: "src/assets/hp_12.png"
//   },
//   Sirius: {
//     name: "Sirius Black",
//     image: "src/assets/hp_13.png"
//   }
// };


// const selectedAvatar =
//   localStorage.getItem("selectedAvatar") || "Harry";

// const profileImage = document.querySelector(".profilePicture");

// if (avatars[selectedAvatar]) {
//   profileImage.src = avatars[selectedAvatar].image;
// }

// const nameElement = document.getElementById("name");

// if (avatars[selectedAvatar]) {
//   profileImage.src = avatars[selectedAvatar].image;
//   nameElement.textContent = avatars[selectedAvatar].name;
// }

