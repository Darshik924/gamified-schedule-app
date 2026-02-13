//Adding the quests part, don't change pls

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

renderView();

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
        <h4 class = "font-semibold">${name}</h4>
        <span class = "text-xs px-2 py-1 rounded ${difficultyColor} text-black font-bold">
            ${difficulty}
        </span>
    </div>
    <p class="text-sm text-[hsl(210_20%_70%)]">
      Deadline: ${time} hours
    </p>

    <div class = "flex gap-2 text-xs"> 
    <button class = "move-btn bg-blue-500 px-2 py-1 rounded">To-Do </button>
    <button class="move-btn bg-amber-500 px-2 py-1 rounded">Progress</button>
    <button class="move-btn bg-green-600 px-2 py-1 rounded">Done</button>
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
