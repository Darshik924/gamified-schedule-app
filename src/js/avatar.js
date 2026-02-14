// ===============================
// INITIAL STATE (LOCAL STORAGE)
// ===============================

let coins = Number(localStorage.getItem("coins")) || 2450;
let ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars")) || ["Harry"];
let selectedAvatar = localStorage.getItem("selectedAvatar") || "Harry";
let currentAvatar = selectedAvatar;

// ===============================
// DOM ELEMENTS
// ===============================

const coinDisplay = document.querySelector(".user-coins");
const nameDisplay = document.getElementById("name");
const costDisplay = document.getElementById("cost");
const imageDisplay = document.querySelector(".image");
const purchaseBtn = document.getElementById("purchaseBtn");
const useBtn = document.getElementById("useBtn");
const avatarCards = document.querySelectorAll(".avatarCard");

// ===============================
// AVATAR DATA
// ===============================

const avatars = {
    Harry: { name: "Harry Potter", price: 0, image: "src/assets/hp_1.png" },
    Dobby: { name: "Dobby", price: 200, image: "src/assets/hp_2.png" },
    Ron: { name: "Ron Weasly", price: 300, image: "src/assets/hp_3.png" },
    Albus: { name: "Albus Dumbledore", price: 500, image: "src/assets/hp_4.png" },
    Rubeus: { name: "Rubeus Hagrid", price: 400, image: "src/assets/hp_5.png" },
    Draco: { name: "Draco Malfoy", price: 350, image: "src/assets/hp_6.png" },
    Voldemort: { name: "Voldemort", price: 800, image: "src/assets/hp_7.png" },
    Lucious: { name: "Lucious Malfoy", price: 450, image: "src/assets/hp_8.png" },
    Severus: { name: "Severus Snape", price: 600, image: "src/assets/hp_9.png" },
    Minerva: { name: "Minerva Mcgonagall", price: 550, image: "src/assets/hp_10.png" },
    ginny: { name: "Ginny Weasly", price: 300, image: "src/assets/hp_11.png" },
    hermoine: { name: "Hermoine Granger", price: 400, image: "src/assets/hp_12.png" },
    Sirius: { name: "Sirius Black", price: 500, image: "src/assets/hp_13.png" }
};

// ===============================
// INITIAL LOAD
// ===============================

coinDisplay.textContent = coins;
loadAvatar(currentAvatar);
updateOwnedUI();
updateButtons();

// ===============================
// LOAD AVATAR DETAILS
// ===============================

function loadAvatar(id) {
    const avatar = avatars[id];

    nameDisplay.textContent = "Name: " + avatar.name;
    costDisplay.textContent = "Price: " + avatar.price;
    imageDisplay.src = avatar.image;

    currentAvatar = id;
    updateButtons();
}

// ===============================
// UPDATE OWNED UI (REMOVE BLUR)
// ===============================

function updateOwnedUI() {
    ownedAvatars.forEach(id => {
        const card = document.getElementById(id);
        if (card) {
            card.classList.remove("blur-sm");
        }
    });
}

// ===============================
// UPDATE BUTTON TEXT
// ===============================

function updateButtons() {

    if (ownedAvatars.includes(currentAvatar)) {
        purchaseBtn.textContent = "Owned";
        purchaseBtn.disabled = true;
    } else {
        purchaseBtn.textContent = "Purchase";
        purchaseBtn.disabled = false;
    }

    if (selectedAvatar === currentAvatar) {
        useBtn.textContent = "Currently Using";
        useBtn.disabled = true;
    } else {
        useBtn.textContent = "Use As Profile";
        useBtn.disabled = false;
    }
}

// ===============================
// CARD CLICK
// ===============================

avatarCards.forEach(card => {
    card.addEventListener("click", () => {
        loadAvatar(card.id);
    });
});

// ===============================
// PURCHASE LOGIC
// ===============================

purchaseBtn.addEventListener("click", () => {

    if (ownedAvatars.includes(currentAvatar)) {
        alert("You already own this avatar!");
        return;
    }

    const price = avatars[currentAvatar].price;

    if (coins >= price) {

        coins -= price;
        ownedAvatars.push(currentAvatar);

        localStorage.setItem("coins", coins);
        localStorage.setItem("ownedAvatars", JSON.stringify(ownedAvatars));

        coinDisplay.textContent = coins;

        updateOwnedUI();
        updateButtons();

        alert("Purchase successful!");

    } else {
        alert("Not enough coins!");
    }
});

// ===============================
// USE AS PROFILE
// ===============================

useBtn.addEventListener("click", () => {

    if (!ownedAvatars.includes(currentAvatar)) {
        alert("You need to purchase this avatar first!");
        return;
    }

    selectedAvatar = currentAvatar;
    localStorage.setItem("selectedAvatar", selectedAvatar);

    updateButtons();

    alert("Profile avatar updated!");
});
