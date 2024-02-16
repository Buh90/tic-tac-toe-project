const game = (function () {
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
        card.innerHTML = `<p>Card n. ${i}</p>`;
        card.style.backgroundColor = `rgb(${25 * i},${25 * i},${25 * i})`;
        gameGrid.appendChild(card);
        card.addEventListener(
          "click",
          () => {
            console.log(card);
          },
          { once: true }
        );
      }
    }
  }
})();
