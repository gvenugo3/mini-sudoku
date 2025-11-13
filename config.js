/**
 * 🎮 Mini Sudoku Configuration
 *
 * MODE OPTIONS:
 *
 * 'dev' (Default)
 * ---------------
 * - Clean sudoku game only
 * - No authentication required
 * - No dashboard sidebar
 * - Perfect for local development
 * - No Firebase setup needed
 *
 * 'production'
 * ------------
 * - Full-featured app
 * - User authentication (Email + Google)
 * - Statistics dashboard
 * - Game history tracking
 * - Cloud sync across devices
 * - Requires Firebase configuration
 *
 * TO SWITCH TO PRODUCTION MODE:
 * 1. Change MODE below to 'production'
 * 2. Configure firebase-config.js with your Firebase project credentials
 * 3. Refresh the app
 */

const CONFIG = {
  MODE: "production", // Change to 'production' to enable authentication and dashboard
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
