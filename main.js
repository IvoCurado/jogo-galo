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

  const resetGame = () => {
    currentPlayer = gameboard.player1;
    gameboard.resetGameCells();
  };

  const switchPlayer = () => {
    currentPlayer =
      currentPlayer === gameboard.player1
        ? gameboard.player2
        : gameboard.player1;
  };

  const playByCurrentUser = (i, j) => {
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
    console.log(
      winner ? `Congrats to the winner: ${winner.name}` : "It was a tie"
    );
    console.log(gameboard.gameCells);
  };

  const checkIfCurrentGameBoardHasWinner = () => {
    const cells = gameboard.gameCells;
    //Check diagonal combinations
    let result = checkIfLineIsWinner([cells[0][0], cells[1][1], cells[2][2]]);
    if (result) return true;
    result = checkIfLineIsWinner([cells[0][2], cells[1][1], cells[2][0]]);
    if (result) return true;
    //Check vertical combinations
    // TO implement
    //Check horizontal combinations
    for (let i = 0; i < 3; i++) {
      let [a, b, c] = cells[i];
      checkIfLineIsWinner(cells[i]);
      if (result) return true;
    }
    return false;
  };

  const checkIfLineIsWinner = (line) => {
    let [a, b, c] = line;
    if (a !== " " && a === b && a === c) {
      return true;
    }
    return false;
  };

  return { playByCurrentUser, resetGame };
})();

// gameBoardController.playByCurrentUser(0, 0);
// gameBoardController.playByCurrentUser(1, 1);
// gameBoardController.playByCurrentUser(0, 2);
// gameBoardController.playByCurrentUser(0, 1);
// gameBoardController.playByCurrentUser(0, 2);
// gameBoardController.playByCurrentUser(2, 1);
