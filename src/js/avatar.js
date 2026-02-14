// =======================
// INITIAL STATE
// =======================

let coins = Number(localStorage.getItem("coins")) || 2450;
let ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars")) || ["Harry"];
let selectedAvatar = localStorage.getItem("selectedAvatar") || "Harry";

const coinDisplay = document.querySelector(".user-coins");
const purchaseBtn = document.getElementById("purchaseBtn");
const useBtn = document.getElementById("useBtn");
const nameDisplay = document.getElementById("name");
const costDisplay = document.getElementById("cost");
const imageDisplay = document.querySelector(".image");

let budget = document.getElementsByClassName('budget');

function updateCoins() {
    let storedData = localStorage.getItem('gamifiedAppData');
    let appData = JSON.parse(storedData) || {};
    budget[0].textContent = `${appData.user.coins}`;
}

updateCoins();
coinDisplay.textContent = coins;

// =======================
// AVATAR DATA
// =======================

const avatars = {
    Harry: {
        name: "Harry Potter",
        price: 0,
        image: "src/assets/hp_1.png"
    },
    Dobby: {
        name: "Dobby",
        price: 200,
        image: "src/assets/hp_2.png"
    },
    Ron: {
        name: "Ron Weasly",
        price: 300,
        image: "src/assets/hp_3.png"
    },
    Albus: {
        name: "Albus Dumbledore",
        price: 500,
        image: "src/assets/hp_4.png"
    },
    Rubeus: {
        name: "Rubeus Hagrid",
        price: 400,
        image: "src/assets/hp_5.png"
    },
    Draco: {
        name: "Draco Malfoy",
        price: 350,
        image: "src/assets/hp_6.png"
    },
    Voldemort: {
        name: "Voldemort",
        price: 800,
        image: "src/assets/hp_7.png"
    },
    Lucious: {
        name: "Lucious Malfoy",
        price: 450,
        image: "src/assets/hp_8.png"
    },
    Severus: {
        name: "Severus Snape",
        price: 600,
        image: "src/assets/hp_9.png"
    },
    Minerva: {
        name: "Minerva Mcgonagall",
        price: 550,
        image: "src/assets/hp_10.png"
    },
    ginny: {
        name: "Ginny Weasly",
        price: 300,
        image: "src/assets/hp_11.png"
    },
    hermoine: {
        name: "Hermoine Granger",
        price: 400,
        image: "src/assets/hp_12.png"
    },
    Sirius: {
        name: "Sirius Black",
        price: 500,
        image: "src/assets/hp_13.png"
    }
};

let currentAvatar = selectedAvatar;

// =======================
// LOAD OWNED STATE
// =======================


let currentProfile = Number(localStorage.getItem('currentProfile'));
profilePhoto[0].setAttribute("src", `src/assets/hp_${currentProfile + 1}.png`);
name.textContent = `Name: ${arr[currentProfile]}`;
cost.textContent = `Price: ${price[currentProfile]}`;

let purchaseBtn = document.getElementsByClassName('purchase');

for (let i = 0; i < 13; i++) {
    cards[i].addEventListener('click', () => {
        profilePhoto[0].setAttribute("src", `src/assets/hp_${i + 1}.png`);
        name.textContent = `NAME: ${arr[i]}`
        cost.textContent = `PRICE: ${price[i]}`;
        localStorage.setItem('currentProfile', i);
        if (appData.user.ownedProfiles[i]) {
            purchaseBtn[0].textContent = "Use As Profile";
        }
        else {
            purchaseBtn[0].textContent = "Purchase";

            function updateOwnedUI() {
                ownedAvatars.forEach(id => {
                    const card = document.getElementById(id);
                    if (card) {
                        card.classList.remove("blur-sm");

                    }
                });
            }

            purchaseBtn[0].addEventListener('click', () => {
                currentProfile = Number(localStorage.getItem('currentProfile'));
                if (appData.user.ownedProfiles[currentProfile]) {
                    alert("You already own this profile!");
                }

                else {
                    let amount = price[currentProfile];
                    if (amount > appData.user.coins) {
                        alert("Not enough Coins!!! Complete Tasks to get coins.");
                    }
                    else {
                        appData.user.coins -= amount;
                        appData.user.ownedProfiles[currentProfile] = true;
                        purchaseBtn[0].textContent = "Use As Profile";
                        localStorage.setItem('gamifiedAppData', JSON.stringify(appData));
                        updateCoins();
                        updateOwnedUI();

                        // =======================
                        // LOAD SELECTED ON PAGE LOAD
                        // =======================

                        function loadAvatar(id) {
                            const avatar = avatars[id];
                            nameDisplay.textContent = "Name: " + avatar.name;
                            costDisplay.textContent = "Price: " + avatar.price;
                            imageDisplay.src = avatar.image;
                        }

                        loadAvatar(currentAvatar);

                        // =======================
                        // CLICK AVATAR
                        // =======================

                        document.querySelectorAll(".avatarCard").forEach(card => {
                            card.addEventListener("click", () => {
                                currentAvatar = card.id;
                                loadAvatar(currentAvatar);
                            });
                        });

                        // =======================
                        // PURCHASE LOGIC
                        // =======================

                        purchaseBtn.addEventListener("click", () => {

                            if (ownedAvatars.includes(currentAvatar)) {
                                alert("This avatar is already owned!");
                                return;

                            }

                            const price = avatars[currentAvatar].price;

                            if (coins >= price) {

                                coins -= price;
                                ownedAvatars.push(currentAvatar);

                                localStorage.setItem("coins", coins);
                                localStorage.setItem("ownedAvatars", JSON.stringify(ownedAvatars));

                                coinDisplay.textContent = coins;

                                document.getElementById(currentAvatar).classList.remove("blur-sm");

                                alert("Purchase successful!");

                            } else {
                                alert("Not enough coins!");
                            }
                        });

                        // =======================
                        // USE AS PROFILE
                        // =======================

                        useBtn.addEventListener("click", () => {

                            if (!ownedAvatars.includes(currentAvatar)) {
                                alert("You need to purchase this avatar first!");
                                return;
                            }

                            selectedAvatar = currentAvatar;
                            localStorage.setItem("selectedAvatar", selectedAvatar);

                            alert("Profile avatar updated!");
                        });
