const Gameboard = new (class {
  #gameboard = ['', '', '', '', '', '', '', '', ''];
  #emptyCells = this.#gameboard.reduce((count, cell) => {
    return !cell ? ++count : count;
  }, 0);
  #gameboardCells = document.querySelectorAll('.cell');

  getGameboard() {
    return [...this.#gameboard];
  }

  #updateEmptyCells() {
    this.#emptyCells = this.#gameboard.reduce((count, cell) => {
      return !cell ? ++count : count;
    }, 0);
  }

  fillGameboardCell(cellNum, marker) {
    if (
      cellNum <= this.#gameboard.length &&
      this.#gameboard[cellNum] === '' &&
      this.#emptyCells > 0
    ) {
      this.#gameboard[cellNum] = marker;
      this.#updateEmptyCells();
    }
  }

  getEmptyCells() {
    return this.#emptyCells;
  }

  renderGameboard() {
    this.#gameboard.forEach((cell, i) => {
      this.#gameboardCells[i].textContent = cell;
    });
  }

  clearGameboard() {
    for (let i = 0; i < this.#gameboard.length; i++) {
      this.#gameboard[i] = '';
    }
    this.#updateEmptyCells();
  }
})();

class Player {
  #name;
  #marker;
  #isActivePlayer;
  constructor(name, marker, isActive) {
    this.#name = name;
    this.#marker = marker;
    this.#isActivePlayer = isActive;
  }

  getActiveStatus() {
    return this.#isActivePlayer;
  }

  toggleActiveStatus() {
    this.#isActivePlayer = !this.#isActivePlayer;
  }

  clearNames() {
    playerOne.changeName('Player One');
    playerTwo.changeName('Player Two');
  }

  clearActiveStatus() {
    if (playerTwo.getActiveStatus()) {
      playerTwo.toggleActiveStatus();
      playerOne.toggleActiveStatus();
    }
  }

  getName() {
    return this.#name;
  }

  changeName(newName) {
    this.#name = newName;
  }

  getMarker() {
    return this.#marker;
  }
}

const playerOne = new Player('Player One', 'X', true);
const playerTwo = new Player('Player Two', 'O', false);

const GameController = new (class {
  #wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  #isFinished = false;

  getFinishedStatus() {
    return this.#isFinished;
  }

  resetFinishedStatus() {
    this.#isFinished = false;
  }

  #checkWin() {
    let isWin = false;
    let winMarker = null;
    const markers = ['X', 'O'];

    this.#wins.forEach((winArr) => {
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

  declareResult(winMarker, playerMarkers) {
    const [playerOneMarker, playerTwoMarker] = playerMarkers;

    if (winMarker === playerOneMarker) {
      return `${playerOne.getName()} wins!`;
    } else if (winMarker === playerTwoMarker) {
      return `${playerTwo.getName()} wins!`;
    } else {
      return "It's a draw!";
    }
  }

  getActivePlayer(players) {
    return players.find((player) => player.getActiveStatus() === true);
  }

  #toggleActivePlayer(players) {
    players.forEach((player) => {
      player.toggleActiveStatus();
    });
  }

  playRound(index) {
    const activePlayer = this.getActivePlayer([playerOne, playerTwo]);
    const playerInput = activePlayer.getMarker();
    Gameboard.fillGameboardCell(index, playerInput);
    Gameboard.renderGameboard();
    this.#toggleActivePlayer([playerOne, playerTwo]);
  }

  endGame() {
    if (this.#checkWin().isWin === true || Gameboard.getEmptyCells() <= 0) {
      this.#isFinished = true;
      const result = this.declareResult(this.#checkWin().winMarker, [
        playerOne.getMarker(),
        playerTwo.getMarker(),
      ]);
      Display.displayResult(result);
    }
  }
})();

const Display = new (class {
  #playerNames = document.querySelectorAll('.player-name');
  #playerNameSpans = document.querySelectorAll('.player-name span');
  #playerInputs = document.querySelectorAll('.player-name-input');
  #btnStart = document.querySelector('#btn-start');
  #btnRestart = document.querySelector('#btn-restart');
  #gameboard = document.querySelector('.gameboard');
  #gameboardCells = document.querySelectorAll('.cell');
  #playerTurn = document.querySelector('.player-turn');
  #gameResultEl = document.querySelector('.game-result');

  #hideElements(...elems) {
    elems.forEach((elem) => elem.classList.add('hide'));
  }

  #showElements(...elems) {
    elems.forEach((elem) => elem.classList.remove('hide'));
  }

  #displayPlayerTurn() {
    const activePlayer = GameController.getActivePlayer([playerOne, playerTwo]);
    this.#playerTurn.textContent = `${activePlayer.getName()}'s turn`;
  }

  displayResult(result) {
    this.#gameResultEl.textContent = result;
    this.#showElements(this.#gameResultEl, this.#btnRestart);
    this.#hideElements(this.#playerTurn);
  }

  #clearInputs() {
    this.#playerInputs.forEach((el) => {
      const input = el.querySelector('input');
      input.value = '';
    });
  }

  #clearTextContent(...elems) {
    elems.forEach((elem) => (elem.textContent = ''));
  }

  bindEvents() {
    this.#playerInputs.forEach((input) => {
      input.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
          const inputField = input.querySelector('input');
          const inputNum = inputField.dataset.nameNum;
          const inputValue = inputField.value;
          if (inputValue) {
            this.#showElements(this.#playerNames[inputNum - 1]);
            this.#playerNameSpans[inputNum - 1].textContent = inputValue;
            if (inputNum === '1') {
              playerOne.changeName(inputValue);
            } else {
              playerTwo.changeName(inputValue);
            }
            this.#hideElements(input);
          }
        }
      });
    });

    this.#btnStart.addEventListener('click', () => {
      const haveNames = [...this.#playerNameSpans].every(
        (span) => span.textContent
      );
      if (haveNames) {
        this.#hideElements(this.#btnStart);
        this.#showElements(this.#gameboard, this.#playerTurn);
        this.#displayPlayerTurn();
      }
    });

    this.#gameboardCells.forEach((cell, index) => {
      cell.addEventListener('click', () => {
        if (!GameController.getFinishedStatus()) {
          GameController.playRound(index);
          this.#displayPlayerTurn();
          GameController.endGame();
        }
      });
    });

    this.#btnRestart.addEventListener('click', () => {
      Gameboard.clearGameboard();
      playerOne.clearNames();
      playerOne.clearActiveStatus();
      GameController.resetFinishedStatus();
      this.#clearInputs();
      this.#hideElements(
        ...this.#playerNames,
        this.#btnRestart,
        this.#gameboard,
        this.#playerTurn,
        this.#gameResultEl
      );
      this.#showElements(...this.#playerInputs, this.#btnStart);
      this.#clearTextContent(...this.#playerNameSpans, ...this.#gameboardCells);
    });
  }
})();

Display.bindEvents();
