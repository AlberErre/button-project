const dice = document.getElementById("dice");

let randomNumber = () => {
  
  let number = Math.floor((Math.random() * 5 ) + 1);
  dice.innerHTML = number;
}

// init dice 
randomNumber();




