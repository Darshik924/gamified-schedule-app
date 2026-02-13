function saveToLocalStor(data) {
  localStorage.setItem("gamifiedAppData", JSON.stringify(data));
}

function loadFromLocalStor() {
  const data = localStorage.getItem("gamifiedAppData");
  return data;
}

function addTask(task) {
  appData.tasks.push(task);
  saveToLocalStorage(appData);
}

export { saveToLocalStor, loadFromLocalStor, addTask };
