/**
 * Stats Manager
 * Handles statistics persistence for both Dev (localStorage) and Prod (Firebase) modes.
 */

import authManager from "../auth";

class StatsManager {
  constructor() {
    this.STORAGE_KEY = "mini_sudoku_stats";
    this.HISTORY_KEY = "mini_sudoku_history";
  }

  /**
   * Get current user stats
   */
  async getStats() {
    // If authenticated in prod, use Firebase
    if (authManager.isAuthenticated()) {
      return await authManager.getUserStats();
    }

    // Otherwise use localStorage
    const stats = localStorage.getItem(this.STORAGE_KEY);
    return stats ? JSON.parse(stats) : this.getEmptyStats();
  }

  /**
   * Get empty stats object
   */
  getEmptyStats() {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalTime: 0,
      totalMistakes: 0,
      currentStreak: 0,
      bestStreak: 0,
      bestTimes: {
        easy: null,
        medium: null,
        hard: null,
      },
      achievements: [], // New: Array of unlocked achievement IDs
    };
  }

  /**
   * Update stats after a game
   * @param {Object} gameResult - { difficulty, time, mistakes, won }
   */
  async updateStats(gameResult) {
    // If authenticated, let AuthManager handle it (it syncs to Firestore)
    if (authManager.isAuthenticated()) {
      const result = await authManager.updateUserStats(gameResult);
      if (result && result.success) {
        // Check for new achievements (local logic for now, could be moved to cloud function)
        await this.checkAchievements(result.stats);
        return result.stats;
      }
      return null;
    }

    // Local Storage Logic
    const currentStats = await this.getStats();
    const won = gameResult.won;

    const updatedStats = {
      ...currentStats,
      gamesPlayed: currentStats.gamesPlayed + 1,
      gamesWon: won ? currentStats.gamesWon + 1 : currentStats.gamesWon,
      totalTime: currentStats.totalTime + gameResult.time,
      totalMistakes: currentStats.totalMistakes + gameResult.mistakes,
      currentStreak: won ? currentStats.currentStreak + 1 : 0,
      bestStreak: won
        ? Math.max(currentStats.currentStreak + 1, currentStats.bestStreak)
        : currentStats.bestStreak,
      bestTimes: { ...currentStats.bestTimes },
    };

    // Update best time
    if (won && gameResult.time > 0) {
      const diff = gameResult.difficulty;
      if (
        !updatedStats.bestTimes[diff] ||
        gameResult.time < updatedStats.bestTimes[diff]
      ) {
        updatedStats.bestTimes[diff] = gameResult.time;
      }
    }

    // Check achievements
    this.checkAchievements(updatedStats);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedStats));
    return updatedStats;
  }

  /**
   * Check and unlock achievements
   */
  async checkAchievements(stats) {
    const newAchievements = [];
    const currentAchievements = stats.achievements || [];

    // Define Achievements
    const achievementsList = [
      { id: "first_win", name: "First Victory", check: (s) => s.gamesWon >= 1 },
      { id: "streak_5", name: "On Fire", check: (s) => s.currentStreak >= 5 },
      {
        id: "speedster",
        name: "Speedster",
        check: (s) => s.bestTimes.easy && s.bestTimes.easy < 60,
      }, // < 1 min easy
      { id: "master", name: "Sudoku Master", check: (s) => s.gamesWon >= 50 },
    ];

    achievementsList.forEach((ach) => {
      if (!currentAchievements.includes(ach.id) && ach.check(stats)) {
        newAchievements.push(ach.id);
        // Show toast for new achievement? (handled by UI)
        console.log(`🏆 Achievement Unlocked: ${ach.name}`);
      }
    });

    if (newAchievements.length > 0) {
      stats.achievements = [...currentAchievements, ...newAchievements];
      // If local, save again
      if (!authManager.isAuthenticated()) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
      } else {
        // For auth, save to Firestore
        await authManager.saveUserStats(stats);
      }
      return true; // Changes made
    }
    return false; // No changes
  }

  /**
   * Sync achievements for existing users
   * Backfills achievements based on history/stats
   */
  async syncAchievements() {
    const stats = await this.getStats();
    if (stats) {
      await this.checkAchievements(stats);
    }
  }

  /**
   * Save game to history
   */
  async saveGameToHistory(gameData) {
    if (authManager.isAuthenticated()) {
      return await authManager.saveGameToHistory(gameData);
    }

    const history = await this.getGameHistory(50); // Keep last 50 locally
    const newGame = {
      ...gameData,
      timestamp: Date.now(), // Local timestamp
      completed: gameData.won,
    };

    history.unshift(newGame);
    if (history.length > 50) history.pop();

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    return { success: true };
  }

  /**
   * Get game history
   */
  async getGameHistory(limitCount = 10) {
    if (authManager.isAuthenticated()) {
      return await authManager.getGameHistory(limitCount);
    }

    const history = localStorage.getItem(this.HISTORY_KEY);
    const parsedHistory = history ? JSON.parse(history) : [];
    return parsedHistory.slice(0, limitCount);
  }
}

const statsManager = new StatsManager();
export default statsManager;
