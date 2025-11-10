// Tests for Sudoku game logic
const Sudoku = require('../sudoku.js');

describe('Sudoku Game Logic', () => {
  let sudoku;

  beforeEach(() => {
    sudoku = new Sudoku();
  });

  describe('Board Validation', () => {
    test('should validate correct placement in row', () => {
      const board = [
        [1, 2, 3, 4, 5, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = board;
      expect(sudoku.isValidPlacement(0, 5, 6)).toBe(true);
      expect(sudoku.isValidPlacement(0, 5, 1)).toBe(false);
    });

    test('should validate correct placement in column', () => {
      const board = [
        [1, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = board;
      expect(sudoku.isValidPlacement(5, 0, 6)).toBe(true);
      expect(sudoku.isValidPlacement(5, 0, 1)).toBe(false);
    });

    test('should validate correct placement in 2x3 box', () => {
      const board = [
        [1, 2, 0, 0, 0, 0],
        [3, 4, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = board;
      // Top-left box already has 1,2,3,4 so can place 5 or 6
      expect(sudoku.isValidPlacement(0, 2, 5)).toBe(true);
      expect(sudoku.isValidPlacement(0, 2, 1)).toBe(false);
    });

    test('should identify valid complete board', () => {
      const validBoard = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = validBoard;
      expect(sudoku.isValidBoard()).toBe(true);
    });

    test('should identify invalid complete board', () => {
      const invalidBoard = [
        [1, 1, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = invalidBoard;
      expect(sudoku.isValidBoard()).toBe(false);
    });
  });

  describe('Puzzle Solving', () => {
    test('should solve a simple puzzle', () => {
      const puzzle = [
        [0, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = JSON.parse(JSON.stringify(puzzle));
      expect(sudoku.solve()).toBe(true);
      expect(sudoku.board[0][0]).toBe(1);
      expect(sudoku.isValidBoard()).toBe(true);
    });

    test('should not solve an impossible puzzle', () => {
      const impossiblePuzzle = [
        [1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = JSON.parse(JSON.stringify(impossiblePuzzle));
      expect(sudoku.solve()).toBe(false);
    });

    test('should solve a medium difficulty puzzle', () => {
      const puzzle = [
        [0, 0, 3, 0, 5, 0],
        [4, 0, 0, 1, 0, 3],
        [0, 3, 1, 0, 0, 4],
        [5, 0, 0, 2, 0, 0],
        [0, 1, 2, 0, 4, 0],
        [6, 0, 0, 3, 0, 2]
      ];
      sudoku.board = JSON.parse(JSON.stringify(puzzle));
      expect(sudoku.solve()).toBe(true);
      expect(sudoku.isValidBoard()).toBe(true);
    });
  });

  describe('Puzzle Generation', () => {
    test('should generate a valid complete board', () => {
      const board = sudoku.generateCompleteBoard();
      sudoku.board = board;
      expect(sudoku.isValidBoard()).toBe(true);
      // Check all cells are filled
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          expect(board[i][j]).toBeGreaterThanOrEqual(1);
          expect(board[i][j]).toBeLessThanOrEqual(6);
        }
      }
    });

    test('should generate puzzle with correct difficulty', () => {
      const easyPuzzle = sudoku.generatePuzzle('easy');
      const mediumPuzzle = sudoku.generatePuzzle('medium');
      const hardPuzzle = sudoku.generatePuzzle('hard');

      const countEmptyCells = (board) => {
        let count = 0;
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 6; j++) {
            if (board[i][j] === 0) count++;
          }
        }
        return count;
      };

      const easyEmpty = countEmptyCells(easyPuzzle);
      const mediumEmpty = countEmptyCells(mediumPuzzle);
      const hardEmpty = countEmptyCells(hardPuzzle);

      expect(easyEmpty).toBeLessThan(mediumEmpty);
      expect(mediumEmpty).toBeLessThan(hardEmpty);

      // Easy should have roughly 12-16 empty cells
      expect(easyEmpty).toBeGreaterThanOrEqual(10);
      expect(easyEmpty).toBeLessThanOrEqual(18);

      // Hard should have roughly 20-24 empty cells
      expect(hardEmpty).toBeGreaterThanOrEqual(18);
      expect(hardEmpty).toBeLessThanOrEqual(26);
    });

    test('should generate solvable puzzle', () => {
      const puzzle = sudoku.generatePuzzle('medium');
      const solver = new Sudoku();
      solver.board = JSON.parse(JSON.stringify(puzzle));
      expect(solver.solve()).toBe(true);
    });
  });

  describe('Helper Methods', () => {
    test('should find empty cell', () => {
      const board = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 0, 1, 2, 3],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = board;
      const emptyCell = sudoku.findEmptyCell();
      expect(emptyCell).toEqual([1, 2]);
    });

    test('should return null when no empty cell exists', () => {
      const board = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = board;
      expect(sudoku.findEmptyCell()).toBeNull();
    });

    test('should get hint for empty cell', () => {
      const puzzle = [
        [0, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = JSON.parse(JSON.stringify(puzzle));
      const hint = sudoku.getHint();
      expect(hint).not.toBeNull();
      expect(hint.row).toBe(0);
      expect(hint.col).toBe(0);
      expect(hint.value).toBe(1);
    });
  });
});
