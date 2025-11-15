/**
 * Mini Sudoku Game Application with Firebase Integration
 * Handles UI interactions, game state, and cloud synchronization
 */

import { Sudoku } from './sudoku.js';
import authManager from './auth.js';
import toast from './toast.js';

class SudokuGame {
  constructor() {
    this.sudoku = new Sudoku();
    this.selectedCell = null;
    this.mistakes = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isGameComplete = false;
    this.currentDifficulty = 'medium';
    this.gameStartTime = null;
    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    this.initializeElements();
    this.attachEventListeners();
    this.setupTheme();
    this.setupAuth();
    this.startNewGame();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    // Game elements
    this.gridElement = document.getElementById('sudoku-grid');
    this.difficultySelect = document.getElementById('difficulty');
    this.timerDisplay = document.getElementById('timer');
    this.mistakesDisplay = document.getElementById('mistakes');
    
    // Control buttons
    this.newGameBtn = document.getElementById('new-game-btn');
    this.checkBtn = document.getElementById('check-btn');
    this.hintBtn = document.getElementById('hint-btn');
    this.solveBtn = document.getElementById('solve-btn');
    
    // Number pad
    this.numberPad = document.getElementById('number-pad');
    this.eraseBtn = document.getElementById('erase-btn');
    
    // Victory modal
    this.victoryModal = document.getElementById('victory-modal');
    this.playAgainBtn = document.getElementById('play-again-btn');
    this.finalTimeDisplay = document.getElementById('final-time');
    this.finalMistakesDisplay = document.getElementById('final-mistakes');
    
    // Auth elements
    this.authModal = document.getElementById('auth-modal');
    this.showAuthBtn = document.getElementById('show-auth-btn');
    this.closeAuthModalBtn = document.getElementById('close-auth-modal');
    this.signInForm = document.getElementById('signin-form');
    this.signUpForm = document.getElementById('signup-form');
    this.toggleAuthFormBtn = document.getElementById('toggle-auth-form');
    this.googleSignInBtn = document.getElementById('google-signin-btn');
    this.signOutBtn = document.getElementById('signout-btn');
    
    // User profile elements
    this.userProfileGuest = document.getElementById('user-profile-guest');
    this.userProfileAuth = document.getElementById('user-profile-authenticated');
    this.userAvatar = document.getElementById('user-avatar');
    this.userDisplayName = document.getElementById('user-display-name');
    this.userEmail = document.getElementById('user-email');
    
    // Stats elements
    this.statsCard = document.getElementById('stats-card');
    this.historyCard = document.getElementById('history-card');
    this.historyList = document.getElementById('history-list');
    
    // Theme toggle
    this.themeToggle = document.getElementById('theme-toggle');
  }

  /**
   * Attach event listeners to UI elements
   */
  attachEventListeners() {
    // Game controls
    this.newGameBtn.addEventListener('click', () => this.confirmNewGame());
    this.checkBtn.addEventListener('click', () => this.checkSolution());
    this.hintBtn.addEventListener('click', () => this.showHint());
    this.solveBtn.addEventListener('click', () => this.solvePuzzle());
    this.playAgainBtn.addEventListener('click', () => {
      this.hideVictoryModal();
      this.startNewGame();
    });

    // Difficulty change with confirmation
    this.difficultySelect.addEventListener('change', (e) => {
      if (this.timer > 0 && !this.isGameComplete) {
        const confirmed = confirm('Changing difficulty will start a new game. Continue?');
        if (!confirmed) {
          this.difficultySelect.value = this.currentDifficulty;
          return;
        }
      }
      this.currentDifficulty = e.target.value;
      this.startNewGame();
    });

    // Number pad
    document.querySelectorAll('.number-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const num = parseInt(btn.dataset.number);
        this.handleNumberInput(num);
      });
    });

    this.eraseBtn.addEventListener('click', () => {
      this.handleNumberInput(0);
    });

    // Keyboard input
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Auth modal
    this.showAuthBtn.addEventListener('click', () => this.showAuthModal());
    this.closeAuthModalBtn.addEventListener('click', () => this.hideAuthModal());
    this.authModal.addEventListener('click', (e) => {
      if (e.target === this.authModal) {
        this.hideAuthModal();
      }
    });

    // Auth forms
    this.signInForm.addEventListener('submit', (e) => this.handleSignIn(e));
    this.signUpForm.addEventListener('submit', (e) => this.handleSignUp(e));
    this.toggleAuthFormBtn.addEventListener('click', () => this.toggleAuthForm());
    this.googleSignInBtn.addEventListener('click', () => this.handleGoogleSignIn());
    this.signOutBtn.addEventListener('click', () => this.handleSignOut());

    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  /**
   * Setup theme based on localStorage
   */
  setupTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      toast.success('Dark mode enabled');
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('Light mode enabled');
    }
  }

  /**
   * Setup Firebase authentication
   */
  setupAuth() {
    // Skip auth setup in dev mode
    if (window.APP_MODE === 'dev') {
      console.log('🔧 Dev mode: Skipping authentication setup');
      return;
    }
    
    authManager.onAuthChange((user) => {
      if (user) {
        this.onUserSignedIn(user);
      } else {
        this.onUserSignedOut();
      }
    });
  }

  /**
   * Handle user signed in
   */
  async onUserSignedIn(user) {
    this.userProfileGuest.classList.add('hidden');
    this.userProfileAuth.classList.remove('hidden');
    
    // Update user info
    const initials = user.displayName 
      ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
      : user.email[0].toUpperCase();
    
    this.userAvatar.textContent = initials;
    this.userDisplayName.textContent = user.displayName || 'User';
    this.userEmail.textContent = user.email;
    
    // Show stats and history
    this.statsCard.classList.remove('hidden');
    this.historyCard.classList.remove('hidden');
    
    // Load user stats
    await this.loadUserStats();
    await this.loadGameHistory();
    
    toast.success(`Welcome back, ${user.displayName || 'User'}!`);
  }

  /**
   * Handle user signed out
   */
  onUserSignedOut() {
    this.userProfileGuest.classList.remove('hidden');
    this.userProfileAuth.classList.add('hidden');
    this.statsCard.classList.add('hidden');
    this.historyCard.classList.add('hidden');
  }

  /**
   * Load user statistics
   */
  async loadUserStats() {
    const stats = await authManager.getUserStats();
    if (stats) {
      document.getElementById('stat-games-played').textContent = stats.gamesPlayed;
      document.getElementById('stat-games-won').textContent = stats.gamesWon;
      
      const winRate = stats.gamesPlayed > 0 
        ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1) 
        : 0;
      document.getElementById('stat-win-rate').textContent = `${winRate}%`;
      document.getElementById('stat-streak').textContent = stats.currentStreak;
      
      // Best times
      document.getElementById('best-time-easy').textContent = 
        stats.bestTimes.easy ? this.formatTime(stats.bestTimes.easy) : '--:--';
      document.getElementById('best-time-medium').textContent = 
        stats.bestTimes.medium ? this.formatTime(stats.bestTimes.medium) : '--:--';
      document.getElementById('best-time-hard').textContent = 
        stats.bestTimes.hard ? this.formatTime(stats.bestTimes.hard) : '--:--';
    }
  }

  /**
   * Load game history
   */
  async loadGameHistory() {
    const games = await authManager.getGameHistory(5);
    
    if (games.length === 0) {
      this.historyList.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No games played yet</p>';
      return;
    }
    
    this.historyList.innerHTML = games.map(game => `
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full ${game.completed ? 'bg-green-500' : 'bg-gray-400'}"></div>
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white capitalize">${game.difficulty}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">${this.formatTime(game.time)} • ${game.mistakes} mistakes</p>
          </div>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ${game.timestamp ? new Date(game.timestamp.seconds * 1000).toLocaleDateString() : 'Recently'}
        </span>
      </div>
    `).join('');
  }

  /**
   * Show auth modal
   */
  showAuthModal() {
    // Check if Firebase is configured
    if (!authManager.isConfigured) {
      toast.warning('Firebase is not configured. See SETUP_GUIDE.md to enable authentication.', 5000);
      return;
    }
    this.authModal.classList.remove('hidden');
  }

  /**
   * Hide auth modal
   */
  hideAuthModal() {
    this.authModal.classList.add('hidden');
  }

  /**
   * Toggle between sign in and sign up forms
   */
  toggleAuthForm() {
    const isSignIn = !this.signInForm.classList.contains('hidden');
    
    if (isSignIn) {
      this.signInForm.classList.add('hidden');
      this.signUpForm.classList.remove('hidden');
      document.getElementById('auth-modal-title').textContent = 'Sign Up';
      this.toggleAuthFormBtn.textContent = 'Already have an account? Sign in';
    } else {
      this.signInForm.classList.remove('hidden');
      this.signUpForm.classList.add('hidden');
      document.getElementById('auth-modal-title').textContent = 'Sign In';
      this.toggleAuthFormBtn.textContent = "Don't have an account? Sign up";
    }
  }

  /**
   * Handle sign in
   */
  async handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    const result = await authManager.signIn(email, password);
    
    if (result.success) {
      this.hideAuthModal();
      this.signInForm.reset();
    } else {
      toast.error(result.error);
    }
  }

  /**
   * Handle sign up
   */
  async handleSignUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    const result = await authManager.signUp(email, password, name);
    
    if (result.success) {
      this.hideAuthModal();
      this.signUpForm.reset();
      toast.success('Account created successfully!');
    } else {
      toast.error(result.error);
    }
  }

  /**
   * Handle Google sign in
   */
  async handleGoogleSignIn() {
    const result = await authManager.signInWithGoogle();
    
    if (result.success) {
      this.hideAuthModal();
    } else {
      toast.error(result.error);
    }
  }

  /**
   * Handle sign out
   */
  async handleSignOut() {
    const confirmed = confirm('Are you sure you want to sign out?');
    if (!confirmed) return;
    
    const result = await authManager.signOut();
    
    if (result.success) {
      toast.info('Signed out successfully');
    } else {
      toast.error(result.error);
    }
  }

  /**
   * Confirm new game if game is in progress
   */
  confirmNewGame() {
    if (this.timer > 0 && !this.isGameComplete) {
      const confirmed = confirm('Start a new game? Your current progress will be lost.');
      if (!confirmed) return;
    }
    this.startNewGame();
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
    this.selectedCell = null;

    const difficulty = this.difficultySelect.value;
    this.currentDifficulty = difficulty;
    this.sudoku.generatePuzzle(difficulty);
    this.renderGrid();
    this.startTimer();
    this.gameStartTime = Date.now();
    
    toast.info(`New ${difficulty} game started!`);
  }

  /**
   * Renders the Sudoku grid with Tailwind classes
   */
  renderGrid() {
    this.gridElement.innerHTML = '';

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const cell = document.createElement('div');
        cell.className = 'bg-white dark:bg-gray-700 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold cursor-pointer transition-all select-none relative aspect-square min-w-0 min-h-0 w-full h-full';
        cell.dataset.row = row;
        cell.dataset.col = col;

        // Add box borders for 2x3 boxes
        if (col % 3 === 0 && col !== 0) {
          cell.classList.add('border-l-[3px]', 'border-l-gray-800', 'dark:border-l-gray-500');
        }
        if (row % 2 === 0 && row !== 0) {
          cell.classList.add('border-t-[3px]', 'border-t-gray-800', 'dark:border-t-gray-500');
        }

        const value = this.sudoku.board[row][col];

        if (value !== 0) {
          cell.textContent = value;

          // Mark initial cells as non-editable
          if (this.sudoku.initialBoard[row][col] !== 0) {
            cell.classList.add('bg-gray-100', 'dark:bg-gray-600', 'text-gray-900', 'dark:text-gray-100', 'cursor-default', 'font-extrabold');
            cell.dataset.initial = 'true';
          } else {
            cell.classList.add('text-indigo-600', 'dark:text-indigo-400');
            cell.dataset.initial = 'false';
          }
        } else {
          cell.dataset.initial = 'false';
        }

        // Hover effect only for non-initial cells
        if (this.sudoku.initialBoard[row][col] === 0) {
          cell.classList.add('hover:bg-gray-50', 'dark:hover:bg-gray-600');
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
    const cells = this.gridElement.querySelectorAll('div');
    cells.forEach(cell => {
      cell.classList.remove('bg-blue-50', 'dark:bg-blue-900', 'ring-2', 'ring-inset', 'ring-indigo-500', 'dark:ring-indigo-400');
    });

    // Add selection to clicked cell
    const cellIndex = row * 6 + col;
    cells[cellIndex].classList.add('bg-blue-50', 'dark:bg-blue-900', 'ring-2', 'ring-inset', 'ring-indigo-500', 'dark:ring-indigo-400');

    this.selectedCell = { row, col };
  }

  /**
   * Handle number input from number pad
   */
  handleNumberInput(num) {
    if (this.isGameComplete || !this.selectedCell) {
      if (!this.selectedCell) {
        toast.warning('Please select a cell first');
      }
      return;
    }

    const { row, col } = this.selectedCell;

    // Don't allow editing initial cells
    if (this.sudoku.initialBoard[row][col] !== 0) {
      return;
    }

    this.placeNumber(row, col, num);
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
    // Store previous value
    const previousValue = this.sudoku.board[row][col];
    this.sudoku.board[row][col] = num;

    // Check if this move is correct (only if not erasing)
    if (num !== 0 && this.sudoku.solution[row][col] !== num) {
      this.mistakes++;
      this.updateMistakesDisplay();

      // Visual feedback for incorrect move
      const cellIndex = row * 6 + col;
      const cells = this.gridElement.querySelectorAll('div');
      cells[cellIndex].classList.add('bg-red-50', 'dark:bg-red-900', 'animate-shake');

      setTimeout(() => {
        cells[cellIndex].classList.remove('bg-red-50', 'dark:bg-red-900', 'animate-shake');
      }, 500);
      
      toast.error('Incorrect number!');
    }

    this.renderGrid();

    // Re-select the cell
    const cellIndex = row * 6 + col;
    const cells = this.gridElement.querySelectorAll('div');
    cells[cellIndex].classList.add('bg-blue-50', 'dark:bg-blue-900', 'ring-2', 'ring-inset', 'ring-indigo-500', 'dark:ring-indigo-400');
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
  async handleVictory() {
    this.isGameComplete = true;
    this.stopTimer();
    
    // Update final stats in modal
    this.finalTimeDisplay.textContent = this.formatTime(this.timer);
    this.finalMistakesDisplay.textContent = this.mistakes;
    
    // Show victory modal
    this.showVictoryModal();
    
    // Save to Firebase if authenticated
    if (authManager.isAuthenticated()) {
      const gameData = {
        difficulty: this.currentDifficulty,
        time: this.timer,
        mistakes: this.mistakes,
        won: true
      };
      
      await authManager.updateUserStats(gameData);
      await authManager.saveGameToHistory(gameData);
      await this.loadUserStats();
      await this.loadGameHistory();
    }
    
    toast.success('Congratulations! You solved the puzzle!');
  }

  /**
   * Shows victory modal
   */
  showVictoryModal() {
    this.victoryModal.classList.remove('hidden');
  }

  /**
   * Hides victory modal
   */
  hideVictoryModal() {
    this.victoryModal.classList.add('hidden');
  }

  /**
   * Checks the current solution
   */
  checkSolution() {
    if (this.isGameComplete) return;

    const isValid = this.sudoku.isValidBoard();

    if (isValid) {
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
        toast.error('Some cells are incorrect. Keep trying!');
      } else {
        toast.info('The puzzle is not complete yet. Keep going!');
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
      toast.info('No hints available - the puzzle is complete!');
      return;
    }

    const { row, col, value } = hint;
    this.placeNumber(row, col, value);

    // Highlight the hint cell
    const cellIndex = row * 6 + col;
    const cells = this.gridElement.querySelectorAll('div');
    cells[cellIndex].classList.add('bg-green-100', 'dark:bg-green-900', 'animate-pulse-soft');

    setTimeout(() => {
      cells[cellIndex].classList.remove('bg-green-100', 'dark:bg-green-900', 'animate-pulse-soft');
    }, 1000);
    
    toast.success('Hint revealed!');
  }

  /**
   * Solves the entire puzzle
   */
  solvePuzzle() {
    if (this.isGameComplete) return;

    const confirmed = confirm('Are you sure you want to solve the puzzle?');
    if (!confirmed) return;

      this.sudoku.board = JSON.parse(JSON.stringify(this.sudoku.solution));
      this.renderGrid();
      this.handleVictory();
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
