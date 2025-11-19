# 🎮 Mini Sudoku - 6×6 Puzzle Game

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)
![Firebase](https://img.shields.io/badge/Firebase-Optional-orange)

**A modern, responsive 6×6 Sudoku game with dual-mode architecture: simple local gameplay or full-featured cloud-powered experience.**

</div>

---

## 📖 Project Info

**Mini Sudoku** is a lightweight, browser-based puzzle game that offers two distinct modes of operation:

- **🔧 Development Mode**: A clean, distraction-free Sudoku game that runs instantly with zero configuration
- **🚀 Production Mode**: Full-featured experience with user authentication, cloud statistics, and progress tracking

Built with vanilla JavaScript and Tailwind CSS v4, the game is designed to be easily deployable, highly customizable, and friendly to both players and developers. The 6×6 grid (instead of traditional 9×9) makes it perfect for quick gaming sessions while maintaining the classic Sudoku challenge.

### 🎯 Key Highlights

- **Zero Setup Required** - Clone and play immediately in dev mode
- **Dual-Mode Architecture** - Switch between local-only and cloud-powered with one environment variable
- **Modern UI/UX** - Beautiful gradients, dark mode, smooth animations, responsive design
- **Firebase Integration** - Optional authentication, cloud storage, and real-time sync
- **Mobile-Friendly** - Touch-optimized controls and responsive layout
- **Lightweight** - No heavy frameworks, pure vanilla JavaScript
- **Customizable** - Modular codebase, easy to extend and modify

---

## 🎲 Game Mechanics

### Difficulty Levels

- **Easy**: 14 cells removed (~39% empty), perfect for beginners
- **Medium**: 18 cells removed (~50% empty), balanced challenge
- **Hard**: 22 cells removed (~61% empty), brain-teaser mode

### Puzzle Generation

- Backtracking algorithm ensures solvable puzzles
- Randomized patterns for unique games
- Proper 2×3 box validation (6 boxes total in 6×6 grid)

### Game Rules

Mini Sudoku follows classic Sudoku rules on a 6×6 grid:

1. **Row Rule**: Each row must contain numbers 1-6 with no repeats
2. **Column Rule**: Each column must contain numbers 1-6 with no repeats
3. **Box Rule**: Each 2×3 box must contain numbers 1-6 with no repeats

### Game Features

- **Real-Time Validation** - Instant feedback on incorrect moves with visual highlighting
- **Timer** - Tracks elapsed time from game start
- **Mistake Counter** - Tracks number of incorrect moves
- **Game Actions**:
  - **New Game**: Start fresh puzzle with confirmation
  - **Check**: Validate current solution
  - **Hint**: Reveal one correct cell
  - **Solve**: Auto-complete puzzle (for learning)
- **Input Methods**:
  - Click/tap to select cells
  - Keyboard input (1-6, Backspace, Delete)
  - Touch-optimized number pad for mobile
  - Erase button with visual feedback
- **Visual Feedback**:
  - Cell selection highlighting
  - Initial cells marked with distinct styling
  - User-entered numbers in accent color
  - Proper 2×3 box borders with bold lines
- **Victory Modal** - Shows completion time and mistakes

### Production Mode Features

- **User Authentication** - Email/Password and Google OAuth sign-in
- **Statistics Dashboard** - Games played, win rate, streaks, best times
- **Game History** - Track all completed games with timestamps
- **Cross-Device Sync** - Progress saved to Firebase Firestore
- **User Profile** - Display name, avatar, and email

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher) - For npm and Vite
- **Git** - For cloning the repository
- **Modern Browser** - Chrome, Firefox, Safari, or Edge

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/gvenugo3/mini-sudoku
cd mini-sudoku
```

#### 2. Install Dependencies

```bash
npm install
```

This installs:

- Tailwind CSS v4
- PostCSS and Autoprefixer
- Jest (for testing)
- Firebase SDK
- Vite (development server)

#### 3. Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:8000` and open automatically in your browser.

**That's it!** The game runs in **Development Mode** by default. No Firebase setup needed! 🎉

### Development Mode (Default)

By default, the app runs in **development mode**, which provides:

- ✅ Full Sudoku game functionality
- ✅ All difficulty levels (Easy, Medium, Hard)
- ✅ Timer and mistakes tracking
- ✅ Number pad and keyboard input
- ✅ Theme toggle (light/dark)
- ✅ Victory modal
- ✅ Toast notifications
- ❌ No authentication required
- ❌ No dashboard or statistics
- ❌ No Firebase dependency

### Production Mode Setup

(To track your progress)

> **💡 Quick Start:** Don't want to go through the complete setup? Try the [live demo](https://mini-sudoku-seven.vercel.app/) to see all features in action!

Enable full features with Firebase integration:

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard
4. Add a web app to your project

#### Step 2: Enable Firebase Services

**2a. Enable Authentication**

1. Go to **Authentication** → **Sign-in method**
2. Enable **"Email/Password"**
3. Enable **"Google"** (optional, for Google sign-in)

**2b. Create Firestore Database**

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Start in **production mode**
4. Choose a location (e.g., `us-central1`)

**2c. Configure Firestore Security Rules**

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data: authenticated users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Game history: users can only access their own games
    match /users/{userId}/games/{gameId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"** to save the rules.

**2d. Get Firebase Credentials**

1. Go to **Project Settings** → **General**
2. Scroll to **"Your apps"**
3. Click your **Web app**
4. Copy the **configuration values**

#### Step 3: Configure Environment Variables

1. **Create `.env.local` file** in the project root:

```bash
# Application Mode: 'dev' or 'production'
VITE_APP_MODE=production

# Firebase Configuration (Required for production mode)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. **Replace placeholders** with your actual Firebase credentials

**⚠️ Security Notes:**

- `.env.local` is in `.gitignore` - your credentials are safe
- NEVER commit credentials to version control
- Firebase credentials stay in `.env.local` ONLY

#### Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C), then:
npm run dev
```

**Check the console:**

```
🚀 Running in PRODUCTION mode
🔥 Firebase app initialized
✅ Firebase initialized successfully
```

**Hard refresh browser:**

- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + F5`

#### Step 5: Verify Production Mode

After switching, verify these features work:

- ✅ Dashboard sidebar appears (desktop) or hamburger menu (mobile)
- ✅ "Sign In to Save Progress" button visible
- ✅ Authentication modal opens
- ✅ Email/Password sign-up and sign-in work
- ✅ Google OAuth sign-in works (if enabled)
- ✅ Dashboard shows statistics after login
- ✅ Game history populates after completing games
- ✅ Sign out works correctly

---

## 🔄 Dev vs Prod Mode Switching

The app uses **Vite environment variables** to switch between development and production modes.

### Configuration Workflow

**⚠️ IMPORTANT: All configuration is in `.env.local` file!**

1. **Edit `.env.local`** - Change `VITE_APP_MODE` value
2. **Restart dev server** - Stop (`Ctrl+C`) and run `npm run dev` again
3. **Vite reads the environment** - Injects variables at build time

**All configuration in ONE file:** `.env.local`

### Quick Reference

| File                 | Purpose                        | Edit?                  |
| -------------------- | ------------------------------ | ---------------------- |
| `.env.local`         | Your environment variables     | ✅ **YES** - Edit this |
| `firebase-config.js` | Firebase init (reads from env) | ❌ No - Auto-reads env |
| `vite.config.js`     | Vite bundler config            | ❌ No - Unless needed  |

### How It Works

```
.env.local (you edit this)
    ↓
Vite reads environment variables
    ↓
import.meta.env.VITE_APP_MODE available in code
    ↓
UI adjusts based on mode
```

### Switching to Production Mode

1. **Edit `.env.local`** and set:

```env
VITE_APP_MODE=production

# Add your Firebase credentials
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... (all other Firebase config)
```

2. **Restart dev server:**

```bash
npm run dev
```

3. **Hard refresh browser** (`Cmd + Shift + R` or `Ctrl + Shift + F5`)

### Switching Back to Dev Mode

1. **Edit `.env.local`** and change:

```env
VITE_APP_MODE=dev
```

2. **Restart dev server:**

```bash
npm run dev
```

3. **Hard refresh browser**

**Console should show:**

```
🔧 Running in DEV mode
🔧 Dev mode: Skipping Firebase initialization
```

The dashboard and authentication will be completely hidden.

**⚠️ Remember:** Restart the dev server whenever you change `.env.local`!

### Mode Comparison

| Feature               | Dev Mode                    | Prod Mode               |
| --------------------- | --------------------------- | ----------------------- |
| **Sudoku Game**       | ✅ Full screen, centered    | ✅ Full                 |
| **Timer & Mistakes**  | ✅ Yes                      | ✅ Yes                  |
| **Theme Toggle**      | ✅ Yes                      | ✅ Yes                  |
| **Number Pad**        | ✅ Yes                      | ✅ Yes                  |
| **Layout**            | 🎮 Game only, full viewport | 📊 Game + Dashboard     |
| **Authentication**    | ❌ No                       | ✅ Email + Google OAuth |
| **Dashboard**         | ❌ Hidden                   | ✅ Sidebar with stats   |
| **Statistics**        | ❌ No                       | ✅ Yes                  |
| **Game History**      | ❌ No                       | ✅ Yes                  |
| **Cloud Sync**        | ❌ No                       | ✅ Yes                  |
| **Firebase Required** | ❌ No setup needed          | ✅ Yes (in .env.local)  |
| **Setup Time**        | ⚡ Instant (30 seconds)     | ⏱️ 5-10 min             |

### Environment Variables Reference

**All variables go in `.env.local` file:**

```env
# Required: App Mode
VITE_APP_MODE=dev                                    # or 'production'

# Required for Production Mode: Firebase Credentials
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important Notes:**

- All variables must have `VITE_` prefix to be accessible in the browser
- Restart dev server after changing `.env.local`
- `.env.local` is gitignored - safe for credentials
- Never commit credentials to version control

### Common Issues

**Firebase errors in dev mode?**

- This is expected! Dev mode skips Firebase initialization
- Check console for "🔧 Dev mode: Skipping Firebase initialization"

**Port 8000 already in use?**

```bash
# Find and kill process
lsof -ti:8000 | xargs kill
# Or change port in vite.config.js
```

**Google sign-in not working?**

- Ensure domain is added to Firebase Console → Authentication → Settings → Authorized domains
- Enable Google provider in Firebase Console → Authentication → Sign-in method
- Check browser console for specific error messages

---

## 🤝 Contributing

Contributions are **welcome and appreciated**! Whether you're fixing bugs, adding features, improving documentation, or reporting issues, your help makes this project better.

### How to Contribute

#### 1. Report Bugs

Found a bug? Please open an issue with:

- **Clear title**: Describe the issue briefly
- **Steps to reproduce**: How to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, dev/prod mode
- **Screenshots**: If applicable

#### 2. Suggest Features

Have an idea? Open an issue with:

- **Feature description**: What you want added
- **Use case**: Why it's useful
- **Possible implementation**: Ideas on how to build it (optional)

#### 3. Submit Pull Requests

**Process:**

1. **Fork** the repository
2. **Clone** your fork

   ```bash
   git clone https://github.com/YOUR_USERNAME/mini-sudoku.git
   cd mini-sudoku
   ```

3. **Create a branch** for your feature

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**

   - Follow the code style guidelines below
   - Write/update tests if needed
   - Update documentation if needed

5. **Test your changes**

   ```bash
   npm test
   npm run dev
   # Test manually in browser
   ```

6. **Commit** with a clear message

   ```bash
   git add .
   git commit -m "feat: Add amazing feature"
   ```

   Use conventional commits:

   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Code style (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance

7. **Push** to your fork

   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes clearly

### Development Guidelines

#### Code Style

**JavaScript:**

- Use ES6+ features (arrow functions, destructuring, etc.)
- 2-space indentation
- camelCase for variables/functions
- PascalCase for classes
- Descriptive variable names
- Add JSDoc comments for functions

**Example:**

```javascript
/**
 * Validates if a number placement is legal
 * @param {number} row - Row index (0-5)
 * @param {number} col - Column index (0-5)
 * @param {number} num - Number to place (1-6)
 * @returns {boolean} True if placement is valid
 */
function isValidMove(row, col, num) {
  // Implementation
}
```

**HTML/CSS:**

- Use Tailwind utility classes
- Semantic HTML5 tags
- Accessible markup (ARIA labels where needed)
- Mobile-first responsive design

**Git Commits:**

- Clear, concise commit messages
- Use conventional commit format
- One logical change per commit
- Reference issue numbers when applicable

#### Testing

- Write tests for new features
- Ensure existing tests pass (`npm test`)
- Test in multiple browsers
- Test in both dev and prod modes
- Test responsive behavior on mobile

#### Documentation

- Update README.md if adding features
- Add JSDoc comments for new functions
- Include code examples where helpful

### Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Give credit where due
- Focus on the code, not the person
- Help others learn and grow

**Thank you for contributing!** 🙏

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Mini Sudoku Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

### Inspiration

- **Classic Sudoku** - The timeless puzzle game that inspired this project
- **[LinkedIn](https://www.linkedin.com/)** - For professional networking and learning resources

---

<div align="center">

**Made with ❤️ and ☕**

**Enjoy the game? Give it a ⭐!**

_Version 2.1.0 - Last Updated: November 2024_

</div>
