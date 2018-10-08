import snarkdown from 'snarkdown';

const dice = document.getElementById("dice");
const button = document.getElementById("button");
const records = document.getElementById("records");

let PastLaunches = [];

let randomNumber = () => {

  let number = Math.round( (Math.random() * 5 ) + 1);
  PastLaunches.push(number);
  dice.innerHTML = number;
  records.innerHTML = snarkdown(PastLaunches);
}

/*
let showRecords = () => {

    let str = "<table>"

    for (let i = 0; i < PastLaunches.length; i++) {
        str += "<tr><td colspan=\"2\">" + PastLaunches[i] + "</td></tr>";
    }

    str += "</table>";
}
*/

button.onclick = () => randomNumber();




