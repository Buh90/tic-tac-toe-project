const initGame = (function () {
  //DOM selectors
  const aiModeBtn = document.querySelector("#AI-mode");
  const friendModeBtn = document.querySelector("#friend-mode");
  const startGameBtn = document.querySelector("#start-game");
  const gameField = document.querySelector(".game-field");
  const gameGrid = document.querySelector(".game-grid");

  //Functions
  startGameBtn.addEventListener("click", startGame);

  function startGame() {
    //aiModeBtn.checked === true ? console.log("AI") : console.log("Friend");
    gameField.classList.add("open");
    if (gameGrid.innerHTML === "") {
      for (let i = 1; i < 10; i++) {
        const card = document.createElement("div");
        card.setAttribute("data-card", i);
        card.classList.add("cell");
        gameGrid.appendChild(card);
      }
    }

    playGame();
  }
  return { gameGrid };
})();

function playGame() {
  let checkerArray = [null, null, null, null, null, null, null, null, null];
  let turnChecker = 1;
  let cells = Array.from(initGame.gameGrid.childNodes);
  for (cell of cells) {
    cell.addEventListener(
      "click",
      function () {
        if (turnChecker % 2 === 1) {
          this.classList.add("x");
          checkerArray[this.getAttribute("data-card") - 1] = "x";
        } else {
          this.classList.add("o");
          checkerArray[this.getAttribute("data-card") - 1] = "o";
        }
        turnChecker++;
        console.log(checkerArray);
      },
      { once: true }
    );
  }
}
