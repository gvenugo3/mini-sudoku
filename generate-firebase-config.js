/**
 * Build Script: Generate firebase-config.js from environment variables
 *
 * This script reads Firebase credentials from .env file and generates
 * firebase-config.js for the browser application.
 *
 * Usage: node generate-firebase-config.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');

  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env file not found. Skipping Firebase config generation.');
    console.log('ℹ️  Create a .env file from .env.example to enable Firebase features.');
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) {
      return;
    }

    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();

    if (key && value) {
      envVars[key.trim()] = value;
    }
  });

  return envVars;
}

// Generate firebase-config.js file
function generateFirebaseConfig() {
  const env = loadEnvFile();

  if (!env) {
    // Create a placeholder config for dev mode
    const placeholderConfig = `/**
 * Application & Firebase Configuration (Placeholder)
 *
 * To enable Firebase features:
 * 1. Copy .env.example to .env
 * 2. Fill in your Firebase credentials
 * 3. Run: npm run build:config
 */

// App Mode Configuration (defaults to 'dev')
export const APP_MODE = "dev";

// Firebase Configuration
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Set global APP_MODE for browser compatibility
if (typeof window !== 'undefined') {
  window.APP_MODE = APP_MODE;
  console.log(\`🎯 App Mode: \${APP_MODE}\`);
}
`;

    fs.writeFileSync(path.join(__dirname, 'firebase-config.js'), placeholderConfig);
    console.log('✅ Created placeholder firebase-config.js (dev mode ready)');
    return;
  }

  // Validate required variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(varName => !env[varName] || env[varName].includes('your_'));

  if (missingVars.length > 0) {
    console.warn('⚠️  Missing or incomplete Firebase environment variables:');
    missingVars.forEach(varName => console.warn(`   - ${varName}`));
    console.log('ℹ️  Fill in your .env file with actual Firebase credentials.');
    console.log('ℹ️  Creating placeholder config for now...\n');
  }

  // Get app mode (default to 'dev')
  const appMode = env.VITE_APP_MODE || 'dev';

  // Validate app mode
  if (appMode !== 'dev' && appMode !== 'production') {
    console.warn(`⚠️  Invalid VITE_APP_MODE: "${appMode}". Using "dev" instead.`);
  }

  // Generate the config file
  const configContent = `/**
 * Application & Firebase Configuration
 *
 * 🤖 AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * This file is generated from .env by running: npm run build:config
 *
 * To update configuration:
 * 1. Edit the .env file
 * 2. Run: npm run build:config
 */

// App Mode Configuration
export const APP_MODE = "${appMode}";

// Firebase Configuration
export const firebaseConfig = {
  apiKey: "${env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY'}",
  authDomain: "${env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com'}",
  projectId: "${env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID'}",
  storageBucket: "${env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com'}",
  messagingSenderId: "${env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID'}",
  appId: "${env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID'}",
  measurementId: "${env.VITE_FIREBASE_MEASUREMENT_ID || 'YOUR_MEASUREMENT_ID'}"
};

// Set global APP_MODE for browser compatibility
if (typeof window !== 'undefined') {
  window.APP_MODE = APP_MODE;
  console.log(\`🎯 App Mode: \${APP_MODE}\`);
}
`;

  fs.writeFileSync(path.join(__dirname, 'firebase-config.js'), configContent);

  if (missingVars.length === 0) {
    console.log('✅ Successfully generated firebase-config.js from .env');
    console.log(`🎯 App Mode: ${appMode}`);
    console.log('🔥 Firebase credentials loaded and ready!');
  } else {
    console.log('✅ Generated firebase-config.js (with placeholders)');
    console.log(`🎯 App Mode: ${appMode}`);
  }
}

// Run the script
try {
  generateFirebaseConfig();
} catch (error) {
  console.error('❌ Error generating Firebase config:', error.message);
  process.exit(1);
}
