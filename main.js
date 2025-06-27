const gameboard = (function () {
  const gameCells = [];
  const player1 = {
    name: "Player 1",
    token: "x",
  };
  const player2 = {
    name: "Player 2",
    token: "o",
  };

  const resetGameCells = () => {
    for (let i = 0; i < 3; i++) {
      gameCells[i] = [];
      for (let j = 0; j < 3; j++) {
        gameCells[i].push(" ");
      }
    }
  };

  const updateGame = (i, j, playerToken) => {
    gameCells[i][j] = playerToken;
  };

  const isGameBoardFull = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameCells[i][j] === " ") {
          return false;
        }
      }
    }
    return true;
  };

  resetGameCells();
  return {
    resetGameCells,
    updateGame,
    isGameBoardFull,
    gameCells,
    player1,
    player2,
  };
})();

const gameBoardController = (function () {
  let currentPlayer = gameboard.player1;
  const placardDialog = document.getElementById("result-dialog");
  const restartButton = document.getElementById("restart-game-button");
  const placardMessage = document.getElementById("result-banner");
  const currentPlayerDisplay = document.getElementsByClassName(
    "current-player-display"
  )[0];

  const resetGame = () => {
    currentPlayer = gameboard.player1;
    showCurrentPlayer();
    gameboard.resetGameCells();
  };

  const switchPlayer = () => {
    currentPlayer =
      currentPlayer === gameboard.player1
        ? gameboard.player2
        : gameboard.player1;
    showCurrentPlayer();
  };

  const showCurrentPlayer = () => {
    currentPlayerDisplay.textContent = `It's your turn: ${currentPlayer.name}`;
  };
  showCurrentPlayer();

  const playByCurrentUser = (i, j, currentZone) => {
    currentZone.textContent = currentPlayer.token;
    gameboard.updateGame(i, j, currentPlayer.token);
    let wasThisAWinnerMove = checkIfCurrentGameBoardHasWinner();
    if (wasThisAWinnerMove) {
      showResultMessage(currentPlayer);
    } else {
      if (gameboard.isGameBoardFull()) {
        showResultMessage();
      } else {
        switchPlayer();
      }
    }
  };

  const showResultMessage = (winner) => {
    placardDialog.showModal();
    restartButton.addEventListener("click", () => {
      placardDialog.close();
      resetGame();
      uiController.resetUi();
    });
    placardMessage.textContent = winner
      ? `Congrats to the winner: ${winner.name}`
      : "It was a tie";
  };

  const checkIfCurrentGameBoardHasWinner = () => {
    const cells = gameboard.gameCells;
    //Check diagonal combinations
    let result = checkIfLineIsWinner([cells[0][0], cells[1][1], cells[2][2]]);
    if (result) return true;
    result = checkIfLineIsWinner([cells[0][2], cells[1][1], cells[2][0]]);
    if (result) return true;
    //Check vertical combinations
    result = checkIfLineIsWinner([cells[0][0], cells[1][0], cells[2][0]]);
    if (result) return true;
    result = checkIfLineIsWinner([cells[0][1], cells[1][1], cells[2][1]]);
    if (result) return true;
    result = checkIfLineIsWinner([cells[0][2], cells[1][2], cells[2][2]]);
    if (result) return true;
    //Check horizontal combinations
    result = checkIfLineIsWinner([cells[0][0], cells[0][1], cells[0][2]]);
    if (result) return true;
    result = checkIfLineIsWinner([cells[1][0], cells[1][1], cells[1][2]]);
    if (result) return true;
    result = checkIfLineIsWinner([cells[2][0], cells[2][1], cells[2][2]]);
    if (result) return true;
    return false;
  };

  const checkIfLineIsWinner = (line) => {
    let [a, b, c] = line;
    if (a !== " " && a === b && a === c) {
      return true;
    }
    return false;
  };

  return { playByCurrentUser, resetGame, currentPlayer };
})();

const uiController = (function () {
  const populateUiZonesWithBehavior = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let currentZone = document.getElementById(`zone-${i}-${j}`);
        currentZone.addEventListener("click", (_) => {
          if (
            currentZone.textContent !== "x" &&
            currentZone.textContent !== "o"
          ) {
            gameBoardController.playByCurrentUser(i, j, currentZone);
          }
        });
      }
    }
  };

  const resetUi = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let currentZone = document.getElementById(`zone-${i}-${j}`);
        currentZone.textContent = " ";
      }
    }
  };
  populateUiZonesWithBehavior();

  return { resetUi };
})();
