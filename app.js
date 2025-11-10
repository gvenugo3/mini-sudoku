/**
 * Mini Sudoku Game Application
 * Handles UI interactions and game state
 */

class SudokuGame {
  constructor() {
    this.sudoku = new Sudoku();
    this.selectedCell = null;
    this.mistakes = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isGameComplete = false;

    this.initializeElements();
    this.attachEventListeners();
    this.startNewGame();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    this.gridElement = document.getElementById('sudoku-grid');
    this.difficultySelect = document.getElementById('difficulty');
    this.timerDisplay = document.getElementById('timer');
    this.mistakesDisplay = document.getElementById('mistakes');
    this.newGameBtn = document.getElementById('new-game-btn');
    this.checkBtn = document.getElementById('check-btn');
    this.hintBtn = document.getElementById('hint-btn');
    this.solveBtn = document.getElementById('solve-btn');
    this.victoryMessage = document.getElementById('victory-message');
    this.playAgainBtn = document.getElementById('play-again-btn');
    this.finalTimeDisplay = document.getElementById('final-time');
  }

  /**
   * Attach event listeners to UI elements
   */
  attachEventListeners() {
    this.newGameBtn.addEventListener('click', () => this.startNewGame());
    this.checkBtn.addEventListener('click', () => this.checkSolution());
    this.hintBtn.addEventListener('click', () => this.showHint());
    this.solveBtn.addEventListener('click', () => this.solvePuzzle());
    this.playAgainBtn.addEventListener('click', () => {
      this.hideVictoryMessage();
      this.startNewGame();
    });

    // Keyboard input for numbers
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  /**
   * Starts a new game with selected difficulty
   */
  startNewGame() {
    this.isGameComplete = false;
    this.mistakes = 0;
    this.updateMistakesDisplay();
    this.stopTimer();
    this.timer = 0;
    this.updateTimerDisplay();

    const difficulty = this.difficultySelect.value;
    this.sudoku.generatePuzzle(difficulty);
    this.renderGrid();
    this.startTimer();
  }

  /**
   * Renders the Sudoku grid
   */
  renderGrid() {
    this.gridElement.innerHTML = '';

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;

        // Add box borders for 2x3 boxes
        if (col % 3 === 0 && col !== 0) {
          cell.classList.add('box-left-border');
        }
        if (row % 2 === 0 && row !== 0) {
          cell.classList.add('box-top-border');
        }

        const value = this.sudoku.board[row][col];

        if (value !== 0) {
          cell.textContent = value;

          // Mark initial cells as non-editable
          if (this.sudoku.initialBoard[row][col] !== 0) {
            cell.classList.add('initial');
          } else {
            cell.classList.add('user-input');
          }
        } else {
          cell.classList.add('empty');
        }

        cell.addEventListener('click', () => this.selectCell(row, col));

        this.gridElement.appendChild(cell);
      }
    }
  }

  /**
   * Selects a cell in the grid
   */
  selectCell(row, col) {
    if (this.isGameComplete) return;

    // Don't allow selecting initial cells
    if (this.sudoku.initialBoard[row][col] !== 0) {
      return;
    }

    // Remove previous selection
    const cells = this.gridElement.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('selected'));

    // Add selection to clicked cell
    const cellIndex = row * 6 + col;
    cells[cellIndex].classList.add('selected');

    this.selectedCell = { row, col };
  }

  /**
   * Handles keyboard input for placing numbers
   */
  handleKeyPress(e) {
    if (this.isGameComplete || !this.selectedCell) return;

    const { row, col } = this.selectedCell;

    // Don't allow editing initial cells
    if (this.sudoku.initialBoard[row][col] !== 0) {
      return;
    }

    if (e.key >= '1' && e.key <= '6') {
      const num = parseInt(e.key);
      this.placeNumber(row, col, num);
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      this.placeNumber(row, col, 0);
    }
  }

  /**
   * Places a number in a cell
   */
  placeNumber(row, col, num) {
    // Check if placement is valid
    const previousValue = this.sudoku.board[row][col];
    this.sudoku.board[row][col] = num;

    // Check if this move is correct
    if (num !== 0 && this.sudoku.solution[row][col] !== num) {
      this.mistakes++;
      this.updateMistakesDisplay();

      // Visual feedback for incorrect move
      const cellIndex = row * 6 + col;
      const cells = this.gridElement.querySelectorAll('.cell');
      cells[cellIndex].classList.add('incorrect');

      setTimeout(() => {
        cells[cellIndex].classList.remove('incorrect');
      }, 500);
    }

    this.renderGrid();

    // Re-select the cell
    const cellIndex = row * 6 + col;
    const cells = this.gridElement.querySelectorAll('.cell');
    cells[cellIndex].classList.add('selected');
    this.selectedCell = { row, col };

    // Check if puzzle is complete
    this.checkCompletion();
  }

  /**
   * Checks if the puzzle is complete and correct
   */
  checkCompletion() {
    // Check if all cells are filled
    let allFilled = true;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (this.sudoku.board[row][col] === 0) {
          allFilled = false;
          break;
        }
      }
      if (!allFilled) break;
    }

    if (allFilled && this.sudoku.isValidBoard()) {
      this.handleVictory();
    }
  }

  /**
   * Handles victory state
   */
  handleVictory() {
    this.isGameComplete = true;
    this.stopTimer();
    this.finalTimeDisplay.textContent = this.formatTime(this.timer);
    this.showVictoryMessage();
  }

  /**
   * Shows victory message
   */
  showVictoryMessage() {
    this.victoryMessage.classList.remove('hidden');
  }

  /**
   * Hides victory message
   */
  hideVictoryMessage() {
    this.victoryMessage.classList.add('hidden');
  }

  /**
   * Checks the current solution
   */
  checkSolution() {
    if (this.isGameComplete) return;

    const isValid = this.sudoku.isValidBoard();

    if (isValid) {
      alert('Congratulations! Your solution is correct!');
      this.handleVictory();
    } else {
      // Check if all cells are filled
      let allFilled = true;
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          if (this.sudoku.board[row][col] === 0) {
            allFilled = false;
            break;
          }
        }
        if (!allFilled) break;
      }

      if (allFilled) {
        alert('Some cells are incorrect. Keep trying!');
      } else {
        alert('The puzzle is not complete yet. Keep going!');
      }
    }
  }

  /**
   * Shows a hint by revealing one cell
   */
  showHint() {
    if (this.isGameComplete) return;

    const hint = this.sudoku.getHint();

    if (!hint) {
      alert('No hints available - the puzzle is complete!');
      return;
    }

    const { row, col, value } = hint;
    this.placeNumber(row, col, value);

    // Highlight the hint cell
    const cellIndex = row * 6 + col;
    const cells = this.gridElement.querySelectorAll('.cell');
    cells[cellIndex].classList.add('hint');

    setTimeout(() => {
      cells[cellIndex].classList.remove('hint');
    }, 1000);
  }

  /**
   * Solves the entire puzzle
   */
  solvePuzzle() {
    if (this.isGameComplete) return;

    if (confirm('Are you sure you want to solve the puzzle?')) {
      this.sudoku.board = JSON.parse(JSON.stringify(this.sudoku.solution));
      this.renderGrid();
      this.handleVictory();
    }
  }

  /**
   * Starts the timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimerDisplay();
    }, 1000);
  }

  /**
   * Stops the timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Updates timer display
   */
  updateTimerDisplay() {
    this.timerDisplay.textContent = this.formatTime(this.timer);
  }

  /**
   * Formats time in MM:SS format
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Updates mistakes display
   */
  updateMistakesDisplay() {
    this.mistakesDisplay.textContent = this.mistakes;
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SudokuGame();
});
