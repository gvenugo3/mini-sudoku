/**
 * Sudoku Game Logic for 6x6 grid
 * Grid is divided into six 2x3 boxes
 */
export class Sudoku {
  constructor() {
    this.board = this.createEmptyBoard();
    this.solution = null;
    this.initialBoard = null;
  }

  /**
   * Creates an empty 6x6 board filled with zeros
   */
  createEmptyBoard() {
    return Array(6).fill(0).map(() => Array(6).fill(0));
  }

  /**
   * Checks if placing a number at a position is valid
   * @param {number} row - Row index (0-5)
   * @param {number} col - Column index (0-5)
   * @param {number} num - Number to place (1-6)
   * @returns {boolean} - True if placement is valid
   */
  isValidPlacement(row, col, num) {
    // Check row
    for (let c = 0; c < 6; c++) {
      if (c !== col && this.board[row][c] === num) {
        return false;
      }
    }

    // Check column
    for (let r = 0; r < 6; r++) {
      if (r !== row && this.board[r][col] === num) {
        return false;
      }
    }

    // Check 2x3 box
    const boxRowStart = Math.floor(row / 2) * 2;
    const boxColStart = Math.floor(col / 3) * 3;

    for (let r = boxRowStart; r < boxRowStart + 2; r++) {
      for (let c = boxColStart; c < boxColStart + 3; c++) {
        if ((r !== row || c !== col) && this.board[r][c] === num) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Validates if the entire board is correct
   * @returns {boolean} - True if board is valid and complete
   */
  isValidBoard() {
    // Check all cells are filled
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }
      }
    }

    // Check all rows
    for (let row = 0; row < 6; row++) {
      const seen = new Set();
      for (let col = 0; col < 6; col++) {
        const num = this.board[row][col];
        if (num < 1 || num > 6 || seen.has(num)) {
          return false;
        }
        seen.add(num);
      }
    }

    // Check all columns
    for (let col = 0; col < 6; col++) {
      const seen = new Set();
      for (let row = 0; row < 6; row++) {
        const num = this.board[row][col];
        if (num < 1 || num > 6 || seen.has(num)) {
          return false;
        }
        seen.add(num);
      }
    }

    // Check all 2x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 2; boxCol++) {
        const seen = new Set();
        const startRow = boxRow * 2;
        const startCol = boxCol * 3;

        for (let r = startRow; r < startRow + 2; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
            const num = this.board[r][c];
            if (num < 1 || num > 6 || seen.has(num)) {
              return false;
            }
            seen.add(num);
          }
        }
      }
    }

    return true;
  }

  /**
   * Finds the first empty cell in the board
   * @returns {Array|null} - [row, col] of empty cell or null if none
   */
  findEmptyCell() {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (this.board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  /**
   * Solves the current board using backtracking
   * @returns {boolean} - True if puzzle was solved
   */
  solve() {
    const emptyCell = this.findEmptyCell();

    if (!emptyCell) {
      return true; // Board is complete
    }

    const [row, col] = emptyCell;

    // Try numbers 1-6
    for (let num = 1; num <= 6; num++) {
      if (this.isValidPlacement(row, col, num)) {
        this.board[row][col] = num;

        if (this.solve()) {
          return true;
        }

        // Backtrack
        this.board[row][col] = 0;
      }
    }

    return false; // No solution found
  }

  /**
   * Generates a complete valid Sudoku board
   * @returns {Array} - Complete 6x6 board
   */
  generateCompleteBoard() {
    this.board = this.createEmptyBoard();
    this.fillBoard();
    return JSON.parse(JSON.stringify(this.board));
  }

  /**
   * Fills the board with a valid solution using randomization
   * @returns {boolean} - True if successfully filled
   */
  fillBoard() {
    const emptyCell = this.findEmptyCell();

    if (!emptyCell) {
      return true; // Board is complete
    }

    const [row, col] = emptyCell;

    // Try numbers in random order
    const numbers = this.shuffle([1, 2, 3, 4, 5, 6]);

    for (const num of numbers) {
      if (this.isValidPlacement(row, col, num)) {
        this.board[row][col] = num;

        if (this.fillBoard()) {
          return true;
        }

        // Backtrack
        this.board[row][col] = 0;
      }
    }

    return false;
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} - Shuffled array
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Generates a puzzle by removing numbers from a complete board
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   * @returns {Array} - Puzzle board with some cells empty
   */
  generatePuzzle(difficulty = 'medium') {
    // Generate complete board
    const completeBoard = this.generateCompleteBoard();
    this.solution = JSON.parse(JSON.stringify(completeBoard));
    this.board = JSON.parse(JSON.stringify(completeBoard));

    // Determine number of cells to remove based on difficulty
    let cellsToRemove;
    switch (difficulty) {
      case 'easy':
        cellsToRemove = 14; // ~39% empty
        break;
      case 'medium':
        cellsToRemove = 18; // ~50% empty
        break;
      case 'hard':
        cellsToRemove = 22; // ~61% empty
        break;
      default:
        cellsToRemove = 18;
    }

    // Remove cells randomly
    const positions = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        positions.push([i, j]);
      }
    }

    const shuffledPositions = this.shuffle(positions);

    for (let i = 0; i < cellsToRemove && i < shuffledPositions.length; i++) {
      const [row, col] = shuffledPositions[i];
      this.board[row][col] = 0;
    }

    this.initialBoard = JSON.parse(JSON.stringify(this.board));
    return JSON.parse(JSON.stringify(this.board));
  }

  /**
   * Gets a hint by revealing one empty cell
   * @returns {Object|null} - {row, col, value} or null if no empty cells
   */
  getHint() {
    if (!this.solution) {
      // If no solution exists, solve current board to get one
      const tempBoard = JSON.parse(JSON.stringify(this.board));
      if (this.solve()) {
        this.solution = JSON.parse(JSON.stringify(this.board));
        this.board = tempBoard;
      } else {
        return null;
      }
    }

    // Find all empty cells
    const emptyCells = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    // Return random empty cell with its solution value
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    return {
      row,
      col,
      value: this.solution[row][col]
    };
  }

  /**
   * Checks if current board matches solution
   * @returns {boolean} - True if current state is correct (may be incomplete)
   */
  isCurrentStateValid() {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const value = this.board[row][col];
        if (value !== 0 && !this.isValidPlacement(row, col, value)) {
          return false;
        }
      }
    }
    return true;
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sudoku;
}
