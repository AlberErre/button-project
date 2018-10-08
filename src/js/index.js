const dice = document.getElementById("dice");
const button = document.getElementById("button");


let randomNumber = () => {

  let number = Math.floor((Math.random() * 5 ) + 1);
  dice.innerHTML = number;
}

button.onclick = () => randomNumber();




