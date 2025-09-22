const Gameboard = (function () {
  const gameboard = ['', '', '', '', '', '', '', '', ''];

  const getGameboard = () => [...gameboard];

  let emptyCells = gameboard.reduce((count, cell) => {
    return !cell ? ++count : count;
  }, 0);

  const gameboardCells = document.querySelectorAll('.cell');

  const updateEmptyCells = () => {
    emptyCells = gameboard.reduce((count, cell) => {
      return !cell ? ++count : count;
    }, 0);
  };

  /**
   *
   * @param {number} cellNum
   * @param {string} marker
   */
  function fillGameboardCell(cellNum, marker) {
    if (
      cellNum <= gameboard.length &&
      gameboard[cellNum] === '' &&
      emptyCells > 0
    ) {
      gameboard[cellNum] = marker;
      updateEmptyCells();
    }
  }

  const getEmptyCells = () => emptyCells;

  function renderGameboard() {
    gameboard.forEach((cell, i) => {
      gameboardCells[i].textContent = cell;
    });
  }

  function clearGameboard() {
    for (let i = 0; i < gameboard.length; i++) {
      gameboard[i] = '';
    }
    updateEmptyCells();
  }

  return {
    getGameboard,
    fillGameboardCell,
    renderGameboard,
    getEmptyCells,
    clearGameboard,
  };
})();

function Player(name, marker, isActive) {
  let isActivePlayer = isActive;

  const getActiveStatus = () => isActivePlayer;

  const toggleActiveStatus = () => {
    isActivePlayer = !isActivePlayer;
  };

  function clearNames() {
    playerOne.changeName('Player One');
    playerTwo.changeName('Player Two');
  }

  const clearActiveStatus = () => {
    if (playerTwo.getActiveStatus()) {
      playerTwo.toggleActiveStatus();
      playerOne.toggleActiveStatus();
    }
  };

  const getName = () => name;

  const changeName = (newName) => (name = newName);

  const getMarker = () => marker;

  return {
    getActiveStatus,
    toggleActiveStatus,
    getName,
    changeName,
    getMarker,
    clearNames,
    clearActiveStatus,
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

  const getFinishedStatus = () => isFinished;

  const resetFinishedStatus = () => (isFinished = false);

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
      return `${playerOne.getName()} wins!`;
    } else if (winMarker === playerTwoMarker) {
      return `${playerTwo.getName()} wins!`;
    } else {
      return "It's a draw!";
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

  function playRound(index) {
    const activePlayer = getActivePlayer([playerOne, playerTwo]);
    const playerInput = activePlayer.getMarker();
    Gameboard.fillGameboardCell(index, playerInput);
    Gameboard.renderGameboard();
    toggleActivePlayer([playerOne, playerTwo]);
  }

  function endGame() {
    if (checkWin().isWin === true || Gameboard.getEmptyCells() <= 0) {
      isFinished = true;
      const result = declareResult(checkWin().winMarker, [
        playerOne.getMarker(),
        playerTwo.getMarker(),
      ]);
      Display.displayResult(result);
    }
  }

  return {
    endGame,
    getActivePlayer,
    declareResult,
    playRound,
    getFinishedStatus,
    resetFinishedStatus,
  };
})();

const Display = (function () {
  const playerNames = document.querySelectorAll('.player-name');
  const playerNameSpans = document.querySelectorAll('.player-name span');
  const playerInputs = document.querySelectorAll('.player-name-input');
  const btnStart = document.querySelector('#btn-start');
  const btnRestart = document.querySelector('#btn-restart');
  const gameboard = document.querySelector('.gameboard');
  const gameboardCells = document.querySelectorAll('.cell');
  const playerTurn = document.querySelector('.player-turn');
  const gameResultEl = document.querySelector('.game-result');

  function hideElements(...elems) {
    elems.forEach((elem) => elem.classList.add('hide'));
  }
  function showElements(...elems) {
    elems.forEach((elem) => elem.classList.remove('hide'));
  }
  function displayPlayerTurn() {
    const activePlayer = GameController.getActivePlayer([playerOne, playerTwo]);
    playerTurn.textContent = `${activePlayer.getName()}'s turn`;
  }
  function displayResult(result) {
    gameResultEl.textContent = result;
    showElements(gameResultEl, btnRestart);
    hideElements(playerTurn);
  }
  function clearInputs() {
    playerInputs.forEach((el) => {
      const input = el.querySelector('input');
      input.value = '';
    });
  }
  function clearTextContent(...elems) {
    elems.forEach((elem) => (elem.textContent = ''));
  }

  playerInputs.forEach((input) => {
    input.addEventListener('click', function (e) {
      if (e.target.classList.contains('btn')) {
        const input = this.querySelector('input');
        const inputNum = input.dataset.nameNum;
        const inputValue = input.value;
        if (inputValue) {
          showElements(playerNames[inputNum - 1]);
          playerNameSpans[inputNum - 1].textContent = inputValue;
          if (inputNum === '1') {
            playerOne.changeName(inputValue);
          } else {
            playerTwo.changeName(inputValue);
          }
          hideElements(this);
        }
      }
    });
  });

  btnStart.addEventListener('click', function () {
    const haveNames = [...playerNameSpans].every((span) => span.textContent);
    if (haveNames) {
      hideElements(this);
      showElements(gameboard, playerTurn);
      displayPlayerTurn();
    }
  });

  gameboardCells.forEach(function (cell, index) {
    cell.addEventListener('click', function () {
      if (!GameController.getFinishedStatus()) {
        GameController.playRound(index);
        displayPlayerTurn();
        GameController.endGame();
      }
    });
  });

  btnRestart.addEventListener('click', function () {
    Gameboard.clearGameboard();
    playerOne.clearNames();
    playerOne.clearActiveStatus();
    GameController.resetFinishedStatus();
    clearInputs();
    hideElements(
      ...playerNames,
      btnRestart,
      gameboard,
      playerTurn,
      gameResultEl
    );
    showElements(...playerInputs, btnStart);
    clearTextContent(...playerNameSpans, ...gameboardCells);
  });

  return { displayResult };
})();
