function saveToLocalStor(data) {
  localStorage.setItem("gamifiedAppData", JSON.stringify(data));
}

function loadFromLocalStor() {
  const data = localStorage.getItem("gamifiedAppData");
  return data;
}


export { saveToLocalStor, loadFromLocalStor };
