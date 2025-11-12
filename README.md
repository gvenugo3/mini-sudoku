# Mini Sudoku

A modern, interactive 6×6 Sudoku puzzle game inspired by LinkedIn's Mini Sudoku. Built with vanilla JavaScript following Test-Driven Development principles.

## Features

### Game Mechanics
- **6×6 Grid**: Simplified Sudoku with six 2×3 boxes
- **Three Difficulty Levels**: Easy, Medium, and Hard
- **Smart Puzzle Generation**: Ensures all puzzles have unique solutions
- **Auto-Validation**: Real-time checking of moves

### Player Features
- **Timer**: Track how long it takes to solve each puzzle
- **Mistake Counter**: Keep track of incorrect moves
- **Hint System**: Get help when you're stuck
- **Solution Checker**: Verify your progress
- **Auto-Solve**: Reveal the complete solution
- **Keyboard Controls**: Quick number input with keyboard

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, colorful interface with smooth animations
- **Visual Feedback**: Immediate feedback for correct/incorrect moves
- **Victory Screen**: Celebrate your completion with time statistics

## How to Play

1. **Select Difficulty**: Choose Easy, Medium, or Hard from the dropdown
2. **Click New Game**: Start a fresh puzzle
3. **Select a Cell**: Click on any empty cell
4. **Enter a Number**: Press keys 1-6 to fill the cell
5. **Delete**: Press Backspace or Delete to clear a cell
6. **Complete the Puzzle**: Fill all cells following Sudoku rules

### Rules
- Each row must contain numbers 1-6 (no repeats)
- Each column must contain numbers 1-6 (no repeats)
- Each 2×3 box must contain numbers 1-6 (no repeats)

## Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (only for running tests)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/gvenugo3/mini-sudoku.git
   cd mini-sudoku
   ```

2. **Open the game**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000

     # Or use any other local server
     npx serve
     ```

3. **Start playing!**
   - Navigate to `http://localhost:8000` (if using a server)
   - Or just double-click `index.html`

## Development

### Running Tests

This project follows Test-Driven Development (TDD) with comprehensive unit tests.

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

**Test Coverage**: 14 tests covering:
- Board validation (rows, columns, 2×3 boxes)
- Puzzle solving algorithms
- Puzzle generation for different difficulties
- Helper methods and game logic

### Project Structure

```
mini-sudoku/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── sudoku.js           # Core game logic (Sudoku class)
├── app.js              # UI controller (SudokuGame class)
├── __tests__/
│   └── sudoku.test.js  # Jest unit tests
├── package.json        # Project dependencies
├── jest.config.js      # Jest configuration
└── README.md          # This file
```

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)**: Vanilla JS with classes and modules
- **Jest**: Testing framework
- **GitHub Pages**: Hosting (optional)

### Key Algorithms

1. **Backtracking Solver**: Efficiently solves puzzles using recursive backtracking
2. **Random Generation**: Creates valid complete boards with randomization
3. **Difficulty Calibration**: Removes appropriate number of cells based on difficulty
4. **Validation Logic**: Checks rows, columns, and 2×3 boxes in O(1) time

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

### Development Guidelines

1. Follow Test-Driven Development
2. Write tests for new features
3. Ensure all tests pass before submitting PRs
4. Follow the existing code style
5. Update documentation as needed

## Future Enhancements

Potential features for future versions:
- [ ] Daily challenge mode
- [ ] Streak tracking
- [ ] Leaderboards
- [ ] Multiple themes
- [ ] Undo/Redo functionality
- [ ] Save/Load game state
- [ ] Pencil marks for notes
- [ ] Sound effects
- [ ] Multiplayer mode

## License

MIT License - feel free to use this project for learning or building your own Sudoku game!

## Acknowledgments

- Inspired by LinkedIn's Mini Sudoku
- Built with Test-Driven Development principles
- Developed with Claude Code

---

**Enjoy playing Mini Sudoku!** If you find this project helpful, please consider giving it a star ⭐
