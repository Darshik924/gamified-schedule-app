import { loadFromLocalStor, saveToLocalStor } from "./backend.js";

let arr=["Harry Potter", "Dobby", "Ron Weasly", "Albus Dumbeldore", "Rubeus Hagrid", "Draco Malfoy", "Voldemort", "Lucious Malfoy", "Severus Snape", "Minerva McGonagall", "Ginny Weasly", "Hermoine Granger", "Sirius Black"];

let price=[100, 40, 40, 55, 65, 80, 120, 50, 60, 80, 80, 100, 50 ];

let budget=document.getElementsByClassName('budget');

function updateCoins(){
    let storedData=localStorage.getItem('gamifiedAppData');
    let appData=JSON.parse(storedData) || {};
    budget[0].textContent=`${appData.user.coins}`;
}

updateCoins();

function availability(i){
    if(appData.user.ownedProfiles[i]){
            purchaseBtn[0].textContent="Use As Profile";
        }
        else{
            purchaseBtn[0].textContent="Purchase";
        }
}

if(localStorage.getItem('loginName')===null){
    localStorage.setItem('loginName', 0);
}

let initial=Number(localStorage.getItem('loginName'));
// availability(localStorage.getItem('loginName'));

let cards=document.querySelectorAll('.profCard');
let profilePhoto=document.getElementsByClassName('image');
let name=document.getElementById('name');
let cost=document.getElementById('cost');
let profile=document.getElementsByClassName('profilePicture');

let storedData=localStorage.getItem('gamifiedAppData');
let appData=JSON.parse(storedData) || {};

let purchaseBtn=document.getElementsByClassName('purchase');
let currentProfile=Number(localStorage.getItem('currentProfile'));
profilePhoto[0].setAttribute("src", `src/assets/hp_${initial+1}.png`);
name.textContent=`Name: ${arr[initial]}`;
cost.textContent=`Price: ${price[initial]}`;
availability(initial);

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
        localStorage.setItem('loginName', currentProfile);
        
        storedData=localStorage.getItem('gamifiedAppData');
        appData=JSON.parse(storedData) || {};

        appData.user.name=`${arr[currentProfile]}`;
        localStorage.setItem('gamifiedAppData', JSON.stringify(appData));

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




