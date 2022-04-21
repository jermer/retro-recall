// get the game grid
const gameContainer = document.querySelector(".grid-container");

// get the score displays
const guessCounter = document.getElementById("num-guesses");
const lowScore = document.getElementById("low-score");

// get the button and connect the click listener
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

/** game controls **/

// current version has 8 matching pairs
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

// define the maximum number of matches
const maxMatches = COLORS.length / 2;

// temporarily accept or ignore user clicks
let pauseClicks = false;

// counters for number of matches and guesses made
let numMatches = 0;
let numGuesses = 0;

// placeholder to note whether any cards are currently showing
let prevCard = null;

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


/** build the cards and the game board **/

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div in the grid
    const newCell = document.createElement("div");
    newCell.classList.add("grid-cell");

    // call a function handleCardClick when a div is clicked on
    newCell.addEventListener("click", handleCardClick);

    // create a new card container for front and back
    const newCellInner = document.createElement("div");
    newCellInner.classList.add("grid-cell-inner");

    // create the card front
    const newCardFront = document.createElement("div");
    newCardFront.classList.add("flip-card-front");
    newCardFront.classList.add(color);
    const imgFront = document.createElement("img");
    imgFront.src = `img/${color}.png`;
    newCardFront.append(imgFront);

    // create the card back
    const newCardBack = document.createElement("div");
    newCardBack.classList.add("flip-card-back");
    const imgBack = document.createElement("img");
    imgBack.src = `img/card-back.png`;
    newCardBack.append(imgBack);

    // add all the elements to the page
    newCellInner.append(newCardFront, newCardBack);
    newCell.append(newCellInner);
    gameContainer.append(newCell);
  }
}


/** Respond to clicks **/

function handleCardClick(event) {

  // we temporarily disable clicking to improve gameplay
  if (pauseClicks) {
    return;
  }

  // clicks are caught by the image, but we want to act on the 
  // corresponding grid-cell-inner element (parent > parent)
  const currContainer = event.target.parentElement.parentElement;
  const currCard = currContainer.firstChild;
  //console.log("you just clicked", event.target);

  // ignore click if we clicked a card that's already face-up
  if (currContainer.classList.contains('flip-over')) {
    return;
  }

  currContainer.classList.toggle('flip-over');

  // if we don't have a face-up card yet, then this card is now face-up
  if (!prevCard) {
    prevCard = currCard;
    return;
  }

  // we're flipping over a second card
  numGuesses++;
  guessCounter.innerText = numGuesses;

  if (currCard.classList.value === prevCard.classList.value) {
    // there was a match :)
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
    // there was not a match :(
    let c1 = currCard;
    let c2 = prevCard;
    // pause clicks while cards reset
    pauseClicks = true;
    setTimeout(function () {
      c1.parentElement.classList.toggle('flip-over');
      c2.parentElement.classList.toggle('flip-over');
      pauseClicks = false;
    }, 1500);
    prevCard = null;
  }
}

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

/** when the DOM loads **/
let shuffledColors = [];
startGame();