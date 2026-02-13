function saveToLocalStor(data) {
  localStorage.setItem("gamifiedAppData", JSON.stringify(data));
}

function loadFromLocalStor() {
  const data = localStorage.getItem("gamifiedAppData");

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    return null;
  }
}

function addTask(task, appData) {
  appData.tasks.push(task);
  saveToLocalStor(appData);
}

export { saveToLocalStor, loadFromLocalStor, addTask };
