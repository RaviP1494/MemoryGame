const gameContainer = document.getElementById("game");

// const COLORS = [
//   "red",
//   "blue",
//   "green",
//   "orange",
//   "purple",
//   "red",
//   "blue",
//   "green",
//   "orange",
//   "purple"
// ];

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

//let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(tiles) {
  for (let tile of tiles) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    //newDiv.classList.add(color);
    newDiv.setAttribute('data-color', tile.color);
    newDiv.setAttribute('data-id', tile.id);
    newDiv.style.color = 'white';
    newDiv.innerText = tile.id;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let selectedSquare;
let wait;
let matchCount;
let guessCount;
// TODO: Implement this function!
function handleCardClick(event) {
  let clickedSquare = event.target;
  if (!wait) {
    guessCount++;
    document.querySelector('#guessCount').innerText = `Guess count: ${guessCount}`;
    updateHighScore();
    //if no square is selected
    if (!selectedSquare) {
      clickedSquare.style.backgroundColor = clickedSquare.dataset.color;
      selectedSquare = clickedSquare;
    }
    //if a match
    else if (selectedSquare.dataset.id === clickedSquare.dataset.id) {
      clickedSquare.style.backgroundColor = clickedSquare.dataset.color;
      selectedSquare.removeEventListener("click", handleCardClick);
      clickedSquare.removeEventListener("click", handleCardClick);
      selectedSquare = undefined;
      matchCount++;
      if (matchCount === (squares.length / 2)) {
        endGame();
      }
    }
    //if not a match
    else {
      clickedSquare.style.backgroundColor = clickedSquare.dataset.color;
      wait = true;
      setTimeout(function () {
        selectedSquare.style.backgroundColor = 'white';
        clickedSquare.style.backgroundColor = 'white';
        selectedSquare = undefined;
        wait = false;
      }, 1000);
    }
  }
}

//used to start or restart game, depending on firstRun
function restart(e) {
  e.preventDefault();
  let guessCountElement = document.querySelector('#guessCount');
  guessCountElement.innerText = 'Guess count: 0';
  squares = [];
  startForm.remove();
  guessCount = 0;
  matchCount = 0;
  if (!firstRun) {
    let allSquares = gameContainer.querySelectorAll('div');
    for (let square of allSquares) {
      square.remove();
    }
  }
  else {
    firstRun = false;
    startForm.querySelector('button').innerText = 'Restart!';
    guessCountElement.classList.remove("invisible");
  }
  numPairs = e.target.querySelector('#numPairs').value;
  createDivsForColors(shuffle(createSquaresArray(numPairs)));
}

function endGame() {
  document.body.append(startForm);
  document.querySelector('#guessCount').textContent = `Congratulations! You won with a total of ${guessCount} guesses!`;
  let highScores = JSON.parse(localStorage.getItem(`high-scores`));
  if (!highScores) {
    highScores = {};
  }
  if (!highScores[numPairs] || highScores[numPairs] > guessCount) {
    highScores[numPairs] = guessCount;
    localStorage.setItem(`high-scores`, JSON.stringify(highScores));
  }
  updateHighScore();
}

function updateHighScore() {
  let highScoreElement = document.querySelector('#highScore');
  let scoreElements = document.querySelectorAll('li');
  for (let listEl of scoreElements) {
    listEl.remove();
  }
  let highScores = JSON.parse(localStorage.getItem(`high-scores`));
  if (highScores) {
    for (let pairs in highScores) {
      let el = document.createElement('li');
      el.innerText = `The high score for ${pairs} pairs is ${highScores[pairs]} guesses.`;
      highScoreElement.append(el);
    }
  }
}

function createSquaresArray(n) {
  for (let i = 0; i < n; i++) {
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    let square = { id: i, color: `rgb(${r},${g},${b})` };
    let squareCopy = { id: i, color: `rgb(${r},${g},${b})` };
    squares.push(square);
    squares.push(squareCopy);
  }
  return squares;
}

// when the DOM loads
let firstRun = true;
let startForm = document.querySelector('form');
let squares;
let numPairs;
updateHighScore();
startForm.addEventListener('submit', restart);