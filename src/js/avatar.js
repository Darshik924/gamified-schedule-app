import { loadFromLocalStor, saveToLocalStor } from "./backend.js";

let arr=["Harry Potter", "Dobby", "Ron Weasly", "Albus Dumbeldore", "Rubeus Hagrid", "Draco Malfoy", "Voldemort", "Lucious Malfoy", "Severus Snape", "Minerva McGonagall", "Ginny Weasly", "Hermoine Granger", "Sirius Black"];

let price=[100, 20, 40, 45, 45, 50, 100, 20, 50, 50, 40, 80, 40 ];

let budget=document.getElementsByClassName('budget');

function updateCoins(){
    let storedData=localStorage.getItem('gamifiedAppData');
    let appData=JSON.parse(storedData) || {};
    budget[0].textContent=`${appData.user.coins}`;
}

updateCoins();

let cards=document.querySelectorAll('.profCard');
let profilePhoto=document.getElementsByClassName('image');
let name=document.getElementById('name');
let cost=document.getElementById('cost');
let profile=document.getElementsByClassName('profilePicture');

let storedData=localStorage.getItem('gamifiedAppData');
let appData=JSON.parse(storedData) || {};


let currentProfile=Number(localStorage.getItem('currentProfile'));
profilePhoto[0].setAttribute("src", `src/assets/hp_${currentProfile+1}.png`);
name.textContent=`Name: ${arr[currentProfile]}`;
cost.textContent=`Price: ${price[currentProfile]}`;

let purchaseBtn=document.getElementsByClassName('purchase');

for(let i=0; i<13; i++){
    cards[i].addEventListener('click', ()=>{
        profilePhoto[0].setAttribute("src", `src/assets/hp_${i+1}.png`);
        name.textContent=`NAME: ${arr[i]}`
        cost.textContent=`PRICE: ${price[i]}`;
        localStorage.setItem('currentProfile', i);
        if(appData.user.ownedProfiles[i]){
            purchaseBtn[0].textContent="Use As Profile";
        }
        else{
            purchaseBtn[0].textContent="Purchase";
        }
    });
}

    purchaseBtn[0].addEventListener('click', ()=>{
        currentProfile=Number(localStorage.getItem('currentProfile'));
        if (appData.user.ownedProfiles[currentProfile]) {
        alert("You already own this profile!"); 
        }

    else{
        let amount = price[currentProfile];
    if(amount>appData.user.coins){
        alert("Not enough Coins!!! Complete Tasks to get coins.");
    }
    else{
        appData.user.coins-=amount;
        appData.user.ownedProfiles[currentProfile] = true;
        purchaseBtn[0].textContent="Use As Profile";
        localStorage.setItem('gamifiedAppData', JSON.stringify(appData));
        updateCoins();
    }
    }
});




