const Gameboard = (function () {
  const gameboard = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];

  const getGameboard = () => [...gameboard];

  let emptyCells = gameboard.length;

  /**
   *
   * @param {number} cellNum
   * @param {string} marker
   */
  function fillGameboardCell(cellNum, marker) {
    if (
      cellNum <= gameboard.length &&
      gameboard[cellNum - 1] === '-' &&
      emptyCells > 0
    ) {
      gameboard[cellNum - 1] = marker;
      emptyCells--;
    }
  }

  const getEmptyCells = () => emptyCells;

  function renderGameboard() {
    let currentRow = '';
    gameboard.forEach((cell, i) => {
      currentRow += cell + ' ';

      if (i === 0 || i === 1) {
        return;
      }

      if ((i + 1) % 3 === 0) {
        currentRow += '\n';
      }
    });

    console.log(currentRow);
  }

  return { getGameboard, fillGameboardCell, renderGameboard, getEmptyCells };
})();

Gameboard.renderGameboard();

function Player(name, marker, isActive) {
  let isActivePlayer = isActive;

  const getActiveStatus = () => isActivePlayer;

  const toggleActiveStatus = () => {
    isActivePlayer = !isActivePlayer;
  };

  return {
    name,
    marker,
    getActiveStatus,
    toggleActiveStatus,
  };
}

const playerOne = Player('Player One', 'X', true);
const playerTwo = Player('Player Two', 'O', false);

const GameController = (function () {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let isFinished = false;

  // const getPlayerInput = (marker) => {
  //   const cellNum = +prompt('Please enter a number from 1 to 9');
  //   return { cellNum, marker };
  // };

  function checkWin() {
    let isWin = false;
    let winMarker = null;
    const markers = ['X', 'O'];

    wins.forEach((winArr) => {
      const [a, b, c] = winArr;

      const filtGameboard = Gameboard.getGameboard().filter((cell, index) => {
        return index === a || index === b || index === c;
      });

      markers.forEach((marker) => {
        if (filtGameboard.every((item) => item === marker)) {
          isWin = true;
          winMarker = filtGameboard[0];
        }
      });
    });

    return { isWin, winMarker };
  }

  /**
   * @param {string} winMarker
   * @param {array} playerMarkers
   * @returns {string} Announcement of the winner
   */
  function declareResult(winMarker, playerMarkers) {
    const [playerOneMarker, playerTwoMarker] = playerMarkers;

    if (winMarker === playerOneMarker) {
      console.log(`${playerOne.name} wins!`);
    } else if (winMarker === playerTwoMarker) {
      console.log(`${playerTwo.name} wins!`);
    } else {
      console.log("It's a draw!");
    }
  }

  /**
   * @param {array} players
   * @returns {object} Active player object
   */
  function getActivePlayer(players) {
    return players.find((player) => player.getActiveStatus() === true);
  }

  /**
   * @param {array} players
   */
  function toggleActivePlayer(players) {
    players.forEach((player) => {
      player.toggleActiveStatus();
    });
  }

  function playRound() {
    const activePlayer = getActivePlayer([playerOne, playerTwo]);
    const playerInput = getPlayerInput(activePlayer.marker);
    Gameboard.fillGameboardCell(playerInput.cellNum, playerInput.marker);
    Gameboard.renderGameboard();
    toggleActivePlayer([playerOne, playerTwo]);
  }

  function playGame() {
    while (!isFinished) {
      if (checkWin().isWin === true || Gameboard.getEmptyCells() <= 0) {
        isFinished = true;
        break;
      }
      playRound();
    }

    declareResult(checkWin().winMarker, [playerOne.marker, playerTwo.marker]);
  }

  return { playGame };
})();

GameController.playGame();
