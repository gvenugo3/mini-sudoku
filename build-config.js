/**
 * ⚠️ DEPRECATED - NO LONGER USED
 *
 * This file is no longer needed with Vite setup.
 * Environment variables are now accessed directly via import.meta.env
 *
 * Build config.js from .env.local
 * Reads APP_MODE from .env.local and generates config.js
 */

const fs = require("fs");
const path = require("path");

// Read .env.local file
const envPath = path.join(__dirname, ".env.local");
let appMode = "dev"; // Default to dev

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const envLines = envContent.split("\n");

  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      // Handle both APP_MODE=value and APP_MODE = value (with spaces)
      const equalIndex = trimmed.indexOf("=");
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim();
        const value = trimmed
          .substring(equalIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");

        if (key === "APP_MODE") {
          if (value === "production" || value === "dev") {
            appMode = value;
          } else {
            console.warn(
              `⚠️  Invalid APP_MODE value: "${value}". Using default: dev`
            );
          }
          break;
        }
      }
    }
  }
} else {
  console.warn("⚠️  .env.local not found. Using default mode: dev");
}

// Generate config.js
const configContent = `/**
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
 * TO SWITCH MODE:
 * 1. Edit .env.local and set APP_MODE=dev or APP_MODE=production
 * 2. Run: npm run build:config
 * 3. Refresh the app
 *
 * ⚠️ AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * This file is generated from .env.local by running: npm run build:config
 */

const CONFIG = {
  MODE: "${appMode}", // Auto-generated from .env.local
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
`;

// Write config.js
fs.writeFileSync(path.join(__dirname, "config.js"), configContent, "utf8");
console.log(`✅ Generated config.js with MODE: ${appMode}`);
