const Gameboard = (function () {
  const gameboard = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];

  const getGameboard = () => [...gameboard];

  let emptyCells = gameboard.length;

  /**
   *
   * @param {number} cellNum
   * @param {string} mark
   */
  function fillGameboardCell(cellNum, mark) {
    if (
      cellNum <= gameboard.length &&
      gameboard[cellNum - 1] === '-' &&
      emptyCells > 0
    ) {
      gameboard[cellNum - 1] = mark;
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

function Player(name, mark, isActive) {
  let isActivePlayer = isActive;

  const getActiveStatus = () => isActivePlayer;

  const toggleActiveStatus = () => {
    isActivePlayer = !isActivePlayer;
  };

  return {
    name,
    mark,
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

  const getPlayerInput = (mark) => {
    const cellNum = +prompt('Please enter a number from 1 to 9');
    return { cellNum, mark };
  };

  function checkWin() {
    let isWin = false;
    let winMark = null;
    const marks = ['X', 'O'];

    wins.forEach((winArr) => {
      const [a, b, c] = winArr;

      const filtGameboard = Gameboard.getGameboard().filter((cell, index) => {
        return index === a || index === b || index === c;
      });

      marks.forEach((mark) => {
        if (filtGameboard.every((item) => item === mark)) {
          isWin = true;
          winMark = filtGameboard[0];
        }
      });
    });

    return { isWin, winMark };
  }

  /**
   * @param {string} winMark
   * @param {array} playerMarks
   * @returns {string} Announcement of the winner
   */
  function declareResult(winMark, playerMarks) {
    const [playerOneMark, playerTwoMark] = playerMarks;

    if (winMark === playerOneMark) {
      console.log(`${playerOne.name} wins!`);
    } else if (winMark === playerTwoMark) {
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
    const playerInput = getPlayerInput(activePlayer.mark);
    Gameboard.fillGameboardCell(playerInput.cellNum, playerInput.mark);
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
      console.log(checkWin().isWin);
    }

    declareResult(checkWin().winMark, [playerOne.mark, playerTwo.mark]);
  }

  return { playGame };
})();

GameController.playGame();
