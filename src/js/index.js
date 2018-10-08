const dice = document.getElementById("dice");
const button = document.getElementById("button");
const records = document.getElementById("records");

let PastLaunches = [];

let randomNumber = () => {

  let number = Math.round( (Math.random() * 5 ) + 1);
  PastLaunches.push(number);
  dice.innerHTML = number;
  records.innerHTML = PastLaunches;
}

button.onclick = () => randomNumber();




