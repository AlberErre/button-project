import snarkdown from 'snarkdown';

const dice = document.getElementById("dice");
const button = document.getElementById("button");
const records = document.getElementById("records");
const mean = document.getElementById("mean");

let PastLaunches = [];
let meanValue;


let randomNumber = () => {

  let number = Math.round( (Math.random() * 5 ) + 1);
  PastLaunches.push(number);
  dice.innerHTML = number;
  records.innerHTML = PastLaunches;
  calculateMean;
  mean.innerHTML = meanValue;

}

let calculateMean = () => {
    let sum = 0;

    for (let i = 0; i < PastLaunches.length; i++) {
        sum = sum + PastLaunches[i];
    }

    meanValue = sum/PastLaunches.length;
}

let showRecords = () => {

    let str = "<table>";

    for (let i = 0; i < PastLaunches.length; i++) {
        str = str + "<tr><td>" + PastLaunches[i] + "</td></tr>";
    }

    str = str + "</table>";

}

button.onclick = () => randomNumber();




