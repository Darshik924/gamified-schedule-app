import { loadFromLocalStor, saveToLocalStor } from "./backend.js";

let arr=["Harry Potter", "Dobby", "Ron Weasly", "Albus Dumbeldore", "Rubeus Hagrid", "Draco Malfoy", "Voldemort", "Lucious Malfoy", "Severus Snape", "Minerva McGonagall", "Ginny Weasly", "Hermoine Granger", "Sirius Black"];

let price=[100, 20, 40, 45, 45, 50, 100, 20, 50, 50, 40, 80, 40 ];

let cards=document.querySelectorAll('.profCard');
let profilePhoto=document.getElementsByClassName('image');
let name=document.getElementById('name');
let cost=document.getElementById('cost');
let profile=document.getElementsByClassName('profilePicture');

let currentProfile=Number(localStorage.getItem('currentProfile'));
profilePhoto[0].setAttribute("src", `src/assets/hp_${currentProfile+1}.png`);
name.textContent=`NAME: ${arr[currentProfile]}`;
cost.textContent=`PRICE: ${price[currentProfile]}`;

for(let i=0; i<13; i++){
    cards[i].addEventListener('click', ()=>{
        profilePhoto[0].setAttribute("src", `src/assets/hp_${i+1}.png`);
        name.textContent=`NAME: ${arr[i]}`
        cost.textContent=`PRICE: ${price[i]}`;
        localStorage.setItem('currentProfile', i);
    });
}

