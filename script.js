// get the game grid
const gameContainer = document.querySelector(".grid-container");

// get the score displays
const guessCounter = document.getElementById("num-guesses");
const lowScore = document.getElementById("low-score");

// get the button and connect the click listener
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

// current version has 8 colors
const COLORS = [
  "card-1",
  "card-2",
  "card-3",
  "card-4",
  "card-5",
  "card-6",
  "card-7",
  "card-8",
  "card-1",
  "card-2",
  "card-3",
  "card-4",
  "card-5",
  "card-6",
  "card-7",
  "card-8"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add("grid-item");
    newDiv.classList.add(color);
    newDiv.classList.add("hidden");
    newDiv.innerText = '?';

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!

const maxMatches = COLORS.length / 2;
let numMatches = 0;
let numGuesses = 0;
let prevCard = null;

function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  const currCard = event.target;
  //console.log("you just clicked", event.target);

  // check to see if the user clicked a face-up card
  if (!currCard.classList.contains('hidden')) {
    return;
  }

  currCard.classList.toggle('hidden');
  currCard.innerText = '';

  // if the user does not have a face-up card yet
  // the card they clicked is now face up
  if (!prevCard) {
    prevCard = currCard;
    return;
  }

  // the user is flipping over a second card
  numGuesses++;
  guessCounter.innerText = numGuesses;

  if (currCard.classList.value === prevCard.classList.value) {
    //console.log("MATCH!")
    numMatches++;

    // check to see if we won the game
    if (numMatches === maxMatches) {
      setTimeout(function () {
        alert(`WINNER! It took you ${numGuesses} guesses.`);
      }, 500);

      // check for a new record low score
      if (lowScore.innerText === '--' || numGuesses < parseInt(lowScore.innerText)) {
        lowScore.innerText = numGuesses;
        localStorage.setItem('record-low-score', numGuesses);
      }
      
      // display the start button
      startButton.classList.toggle('hidden');

    }

    prevCard = null;
  }
  else {
    //console.log("NO MATCH");
    let c1 = currCard;
    let c2 = prevCard;
    setTimeout(function () {
      c1.classList.toggle('hidden');
      c2.classList.toggle('hidden');
      c1.innerText = '?';
      c2.innerText = '?';
    }, 1000);
    prevCard = null;
  }
}

// when the DOM loads

function startGame() {
  // empty the game grid
  while (gameContainer.hasChildNodes()) {
    gameContainer.removeChild(gameContainer.firstChild);
  }

  // shuffle and repopulate the game grid
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);

  // reset counters
  currCard = null;
  prevCard = null;

  numMatches = 0;
  numGuesses = 0;
  guessCounter.innerText = numGuesses;

  // hide the button
  startButton.classList.toggle('hidden');

  // update the record
  let str = localStorage.getItem("record-low-score");
  if (!str)
    str = '--';
  lowScore.innerText = str;
}

// when the DOM loads
let shuffledColors = [];
startGame();