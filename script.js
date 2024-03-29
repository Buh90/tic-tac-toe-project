const game = (function () {
  //DOM selectors
  const aiModeBtn = document.querySelector("#AI-mode");
  const friendModeBtn = document.querySelector("#friend-mode");
  const startGameBtn = document.querySelector("#start-game");
  const gameField = document.querySelector(".game-field");
  const gameGrid = document.querySelector(".game-grid");
  const modal = document.querySelector("#dialog");
  const restartGameBtn = document.querySelector(".restart-game");
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let gameMode;

  //Functions
  startGameBtn.addEventListener("click", function () {
    if (this.textContent === "PLAY") {
      this.textContent = "RESTART";
      openField();
    } else {
      resetGame();
    }
  });
  restartGameBtn.addEventListener("click", resetGame);

  function openField() {
    friendModeBtn.setAttribute("disabled", true);
    aiModeBtn.setAttribute("disabled", true);
    aiModeBtn.checked === true
      ? (game.gameMode = "AI")
      : (game.gameMode = "friend");
    gameField.classList.add("open");
    if (gameGrid.innerHTML === "") {
      for (let i = 1; i < 10; i++) {
        const card = document.createElement("div");
        card.setAttribute("data-card", i);
        card.classList.add("cell");
        gameGrid.appendChild(card);
      }
    }
    initGame();
  }

  function resetGame() {
    friendModeBtn.removeAttribute("disabled");
    aiModeBtn.removeAttribute("disabled");
    gameGrid.innerHTML = "";
    gameGrid.removeAttribute("inert");
    gameField.classList.remove("open");
    modal.close();
    startGameBtn.textContent = "PLAY";
  }

  return { gameGrid, gameMode, modal, winningCombinations };
})();

function initGame() {
  let checkerArray = [null, null, null, null, null, null, null, null, null];
  let turnChecker = 1;
  let cells = Array.from(game.gameGrid.childNodes);

  for (cell of cells) {
    cell.addEventListener("click", function eventHandler() {
      if (turnChecker % 2 === 1) {
        this.classList.add("x");
        checkerArray[this.getAttribute("data-card") - 1] = "x";
        if (checkWinner(checkerArray, cells)) {
          delay(1000).then(() => game.modal.showModal());
          return;
        }
        if (turnChecker >= 9) {
          delay(2000).then(() => game.modal.showModal());
        }
        turnChecker++;
        if (game.gameMode === "AI" && turnChecker < 9) {
          playComputerTurn(checkerArray, cells, turnChecker);
        }
      } else {
        this.classList.add("o");
        checkerArray[this.getAttribute("data-card") - 1] = "o";
        if (checkWinner(checkerArray, cells)) {
          delay(2000).then(() => game.modal.showModal());
          return;
        }
        turnChecker++;
      }
      this.removeEventListener("click", eventHandler);
    });
  }
}

async function playComputerTurn(checkerArray, cells, turnChecker) {
  let computerChoice = getPCChoice(checkerArray, turnChecker);
  game.gameGrid.setAttribute("inert", true);
  await delay(1000);
  cells[computerChoice].click();
  game.gameGrid.removeAttribute("inert");

  return checkerArray;
}

function checkWinner(checkerArray, cells) {
  let isWinner = false;
  const winner = document.querySelector("#dialog > p");

  for (combination of game.winningCombinations) {
    if (
      checkerArray[combination[0]] === checkerArray[combination[1]] &&
      checkerArray[combination[1]] === checkerArray[combination[2]] &&
      checkerArray[combination[0]] !== null
    ) {
      isWinner = true;
      game.gameGrid.setAttribute("inert", true);
      for (let i = 0; i < 3; i++) {
        cells[combination[i]].classList.add("winner");
      }
      if (cells[combination[0]].classList.contains("x")) {
        winner.textContent = "Player 1 win!";
      } else if (game.gameMode === "AI") {
        winner.textContent = "Computer win!";
      } else {
        winner.textContent = "Player 2 win!";
      }
      break;
    }
  }
  if (isWinner === false && checkerArray.every((value) => value !== null)) {
    winner.textContent = "DRAW!";
  }
  return isWinner;
}

function getPCChoice(checkerArray, turnChecker) {
  let choice;

  if (turnChecker === 2) {
    if (checkerArray[4] === "x") {
      let possibleValue = [0, 2, 6, 8];
      choice = possibleValue[Math.floor(Math.random() * 4)];
    } else {
      choice = 4;
    }
  }

  if (attackPriority("o")) {
    return choice;
  } else if (attackPriority("x")) {
    return choice;
  } else {
    while (checkerArray[choice] !== null) {
      choice = Math.floor(Math.random() * 9);
    }
    return choice;
  }

  function attackPriority(sign) {
    for (combination of game.winningCombinations) {
      let counter = 0;
      for (let i = 0; i < 3; i++) {
        if (checkerArray[combination[i]] === sign) {
          ++counter;
        }
        if (counter === 2) {
          for (let j = 0; j < 3; j++) {
            if (checkerArray[combination[j]] === null) {
              choice = combination[j];
              return choice;
            }
          }
        }
      }
    }
  }
}

function delay(ms) {
  return new Promise((playFunction) => setTimeout(playFunction, ms));
}
