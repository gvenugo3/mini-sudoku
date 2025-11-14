/**
 * 🎮 Mini Sudoku Configuration
 *
 * ⚠️ DEPRECATED: This file is now auto-generated from .env
 *
 * To change the app mode:
 * 1. Edit .env file and set VITE_APP_MODE=dev or VITE_APP_MODE=production
 * 2. Run: npm run build:config
 * 3. Restart the app
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
 */

// Import APP_MODE from generated config
import { APP_MODE } from './firebase-config.js';

const CONFIG = {
  MODE: APP_MODE, // Auto-loaded from .env via firebase-config.js
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}

// Set global APP_MODE for browser
if (typeof window !== 'undefined') {
  window.APP_MODE = APP_MODE;
  console.log(`🎯 App Mode: ${APP_MODE}`);
}
