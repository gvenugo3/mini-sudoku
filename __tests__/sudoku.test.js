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

    test('should return null for hint when puzzle is complete', () => {
      const completePuzzle = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = JSON.parse(JSON.stringify(completePuzzle));
      sudoku.solution = JSON.parse(JSON.stringify(completePuzzle));
      const hint = sudoku.getHint();
      expect(hint).toBeNull();
    });

    test('should shuffle array randomly', () => {
      const original = [1, 2, 3, 4, 5, 6];
      const shuffled = sudoku.shuffle(original);

      // Should have same elements
      expect(shuffled.sort()).toEqual(original.sort());

      // Should be same length
      expect(shuffled.length).toBe(original.length);

      // Original array should not be modified
      expect(original).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test('should create empty board', () => {
      const board = sudoku.createEmptyBoard();
      expect(board.length).toBe(6);
      expect(board[0].length).toBe(6);

      // All cells should be 0
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          expect(board[i][j]).toBe(0);
        }
      }
    });
  });

  describe('Current State Validation', () => {
    test('should validate partial board with correct entries', () => {
      const partialBoard = [
        [1, 2, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = partialBoard;
      expect(sudoku.isCurrentStateValid()).toBe(true);
    });

    test('should invalidate partial board with conflicts', () => {
      const invalidPartialBoard = [
        [1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = invalidPartialBoard;
      expect(sudoku.isCurrentStateValid()).toBe(false);
    });

    test('should validate empty board', () => {
      const emptyBoard = sudoku.createEmptyBoard();
      sudoku.board = emptyBoard;
      expect(sudoku.isCurrentStateValid()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle box boundary validations correctly', () => {
      const board = [
        [1, 2, 3, 0, 0, 0],
        [4, 5, 6, 0, 0, 0],
        [0, 0, 0, 1, 2, 3],
        [0, 0, 0, 4, 5, 6],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      sudoku.board = board;

      // Cannot place 1 in position [0,3] (same row as another 1)
      expect(sudoku.isValidPlacement(0, 3, 1)).toBe(false);

      // Can place 2 in position [4,0] (valid placement)
      expect(sudoku.isValidPlacement(4, 0, 2)).toBe(true);
    });

    test('should validate placement at same position correctly', () => {
      const board = sudoku.createEmptyBoard();
      board[0][0] = 1;
      sudoku.board = board;

      // Should allow placing 1 at same position (for validation)
      expect(sudoku.isValidPlacement(0, 0, 1)).toBe(true);
    });

    test('should check all 2x3 boxes correctly', () => {
      const board = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = board;

      // isValidBoard should check all 6 boxes (3 rows × 2 cols of boxes)
      expect(sudoku.isValidBoard()).toBe(true);
    });

    test('should detect invalid box in bottom-right', () => {
      const invalidBoard = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 1]  // Duplicate 1 in bottom-right box
      ];
      sudoku.board = invalidBoard;
      expect(sudoku.isValidBoard()).toBe(false);
    });

    test('should handle incomplete board in isValidBoard', () => {
      const incompleteBoard = [
        [1, 2, 3, 4, 5, 0],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = incompleteBoard;
      expect(sudoku.isValidBoard()).toBe(false);
    });

    test('should detect out of range numbers', () => {
      const invalidRangeBoard = [
        [1, 2, 3, 4, 5, 7],  // 7 is out of range
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 1],
        [3, 1, 2, 6, 4, 5],
        [6, 4, 5, 3, 1, 2]
      ];
      sudoku.board = invalidRangeBoard;
      expect(sudoku.isValidBoard()).toBe(false);
    });
  });
});
