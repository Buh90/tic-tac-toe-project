const game = (function () {
  //DOM selectors
  const aiModeBtn = document.querySelector("#AI-mode");
  const friendModeBtn = document.querySelector("#friend-mode");
  const startGameBtn = document.querySelector("#start-game");
  const gameField = document.querySelector(".game-field");
  const gameGrid = document.querySelector(".game-grid");
  let gameMode;

  //Functions
  startGameBtn.addEventListener("click", openField);

  function openField() {
    friendModeBtn.setAttribute("disabled", true);
    aiModeBtn.setAttribute("disabled", true);
    startGameBtn.setAttribute("disabled", true);
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
  return { gameGrid, gameMode };
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
          return;
        }
        turnChecker++;
        if (game.gameMode === "AI" && turnChecker < 9) {
          playComputerTurn(checkerArray, cells);
        }
      } else {
        this.classList.add("o");
        checkerArray[this.getAttribute("data-card") - 1] = "o";
        if (checkWinner(checkerArray, cells)) {
          return;
        }
        turnChecker++;
      }
      this.removeEventListener("click", eventHandler);
    });
  }
}

function playComputerTurn(checkerArray, cells) {
  let computerChoice = Math.floor(Math.random() * 9);
  while (checkerArray[computerChoice] !== null) {
    computerChoice = Math.floor(Math.random() * 9);
  }
  cells[computerChoice].click();

  return checkerArray;
}

function checkWinner(checkerArray, cells) {
  let isWinner = false;
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
  for (combination of winningCombinations) {
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
      break;
    }
  }
  return isWinner;
}
