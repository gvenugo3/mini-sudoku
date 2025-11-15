// Integration tests for complete game workflows

const Sudoku = require('../sudoku.js');

describe('Sudoku Integration Tests', () => {
  let sudoku;

  beforeEach(() => {
    sudoku = new Sudoku();
  });

  describe('Complete Game Flow', () => {
    test('should generate, solve, and validate puzzle end-to-end', () => {
      // 1. Generate a puzzle
      const puzzle = sudoku.generatePuzzle('easy');

      // Verify puzzle was generated
      expect(puzzle).toBeDefined();
      expect(puzzle.length).toBe(6);

      // Verify puzzle has empty cells
      let emptyCells = 0;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if (puzzle[i][j] === 0) emptyCells++;
        }
      }
      expect(emptyCells).toBeGreaterThan(0);

      // 2. Solve the puzzle
      const solved = sudoku.solve();

      // Verify puzzle was solved
      expect(solved).toBe(true);
      expect(sudoku.isValidBoard()).toBe(true);

      // 3. Verify solution has no empty cells
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          expect(sudoku.board[i][j]).toBeGreaterThanOrEqual(1);
          expect(sudoku.board[i][j]).toBeLessThanOrEqual(6);
        }
      }
    });

    test('should provide hints that lead to valid solution', () => {
      // Generate puzzle
      sudoku.generatePuzzle('medium');
      const initialBoard = JSON.parse(JSON.stringify(sudoku.board));

      // Get a hint
      const hint = sudoku.getHint();

      expect(hint).not.toBeNull();
      expect(hint.row).toBeGreaterThanOrEqual(0);
      expect(hint.row).toBeLessThan(6);
      expect(hint.col).toBeGreaterThanOrEqual(0);
      expect(hint.col).toBeLessThan(6);

      // Apply hint
      sudoku.board[hint.row][hint.col] = hint.value;

      // Verify board is still valid after hint
      expect(sudoku.isCurrentStateValid()).toBe(true);
    });

    test('should maintain puzzle invariants throughout solving', () => {
      // Generate puzzle
      sudoku.generatePuzzle('hard');
      const initialBoard = JSON.parse(JSON.stringify(sudoku.initialBoard));

      // Track that initial cells never change
      let attempts = 0;
      const maxAttempts = 100;

      while (attempts < maxAttempts) {
        const emptyCell = sudoku.findEmptyCell();
        if (!emptyCell) break;

        const [row, col] = emptyCell;

        // Try placing correct number
        const correctValue = sudoku.solution[row][col];
        sudoku.board[row][col] = correctValue;

        // Verify initial cells haven't changed
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 6; j++) {
            if (initialBoard[i][j] !== 0) {
              expect(sudoku.board[i][j]).toBe(initialBoard[i][j]);
            }
          }
        }

        attempts++;
      }
    });

    test('should generate different puzzles on each call', () => {
      const puzzle1 = sudoku.generatePuzzle('medium');
      const sudoku2 = new Sudoku();
      const puzzle2 = sudoku2.generatePuzzle('medium');

      // Puzzles should be different (very high probability)
      let differences = 0;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if (puzzle1[i][j] !== puzzle2[i][j]) {
            differences++;
          }
        }
      }

      // At least some cells should be different
      expect(differences).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle rapid hint requests', () => {
      sudoku.generatePuzzle('easy');

      let hintsGiven = 0;
      for (let i = 0; i < 36; i++) {
        const hint = sudoku.getHint();
        if (hint) {
          sudoku.board[hint.row][hint.col] = hint.value;
          hintsGiven++;
        }
      }

      // Should eventually give enough hints to complete puzzle
      expect(hintsGiven).toBeGreaterThan(0);
    });

    test('should validate complex board states', () => {
      // Start with partial valid board
      const partialBoard = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 5, 6, 4],
        [5, 6, 4, 2, 3, 0],
        [3, 1, 2, 6, 4, 0],
        [6, 4, 5, 3, 1, 0]
      ];

      sudoku.board = JSON.parse(JSON.stringify(partialBoard));

      // Should be valid (partial)
      expect(sudoku.isCurrentStateValid()).toBe(true);

      // Should not be complete
      expect(sudoku.isValidBoard()).toBe(false);

      // Should be able to solve
      expect(sudoku.solve()).toBe(true);
      expect(sudoku.isValidBoard()).toBe(true);
    });

    test('should handle mixed difficulty puzzles correctly', () => {
      const difficulties = ['easy', 'medium', 'hard'];
      const emptyCounts = [];

      for (const difficulty of difficulties) {
        const sudokuInstance = new Sudoku();
        const puzzle = sudokuInstance.generatePuzzle(difficulty);

        let emptyCount = 0;
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 6; j++) {
            if (puzzle[i][j] === 0) emptyCount++;
          }
        }

        emptyCounts.push(emptyCount);

        // All puzzles should be solvable
        expect(sudokuInstance.solve()).toBe(true);
        expect(sudokuInstance.isValidBoard()).toBe(true);
      }

      // Verify difficulty progression (easy < medium < hard empty cells)
      expect(emptyCounts[0]).toBeLessThanOrEqual(emptyCounts[1]);
      expect(emptyCounts[1]).toBeLessThanOrEqual(emptyCounts[2]);
    });
  });

  describe('Performance Tests', () => {
    test('should generate puzzle in reasonable time', () => {
      const startTime = Date.now();
      sudoku.generatePuzzle('hard');
      const endTime = Date.now();

      // Should complete in less than 5 seconds
      expect(endTime - startTime).toBeLessThan(5000);
    });

    test('should solve puzzle in reasonable time', () => {
      sudoku.generatePuzzle('hard');

      const startTime = Date.now();
      const solved = sudoku.solve();
      const endTime = Date.now();

      expect(solved).toBe(true);
      // Should complete in less than 2 seconds
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });

  describe('Data Integrity', () => {
    test('should not mutate solution when modifying board', () => {
      sudoku.generatePuzzle('medium');
      const originalSolution = JSON.parse(JSON.stringify(sudoku.solution));

      // Modify board
      sudoku.board[0][0] = 9;
      sudoku.board[1][1] = 9;

      // Solution should remain unchanged
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          expect(sudoku.solution[i][j]).toBe(originalSolution[i][j]);
        }
      }
    });

    test('should preserve initial board state', () => {
      sudoku.generatePuzzle('easy');
      const originalInitial = JSON.parse(JSON.stringify(sudoku.initialBoard));

      // Modify board
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if (sudoku.board[i][j] === 0) {
            sudoku.board[i][j] = 1;
          }
        }
      }

      // Initial board should remain unchanged
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          expect(sudoku.initialBoard[i][j]).toBe(originalInitial[i][j]);
        }
      }
    });
  });
});
