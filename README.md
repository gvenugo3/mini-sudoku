# 🎮 Mini Sudoku - 6×6 Puzzle Game

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)
![Firebase](https://img.shields.io/badge/Firebase-Optional-orange)

**A modern, responsive 6×6 Sudoku game with dual-mode architecture: simple local gameplay or full-featured cloud-powered experience.**

[Features](#-features) • [How to Play](#-how-to-play) • [Installation](#-installation--setup) • [Dev vs Prod](#-dev-vs-prod-mode-switching) • [Contributing](#-contributing)

</div>

---

## 📖 Project Info

**Mini Sudoku** is a lightweight, browser-based puzzle game that offers two distinct modes of operation:

- **🔧 Development Mode**: A clean, distraction-free Sudoku game that runs instantly with zero configuration
- **🚀 Production Mode**: Full-featured experience with user authentication, cloud statistics, and progress tracking

Built with vanilla JavaScript and Tailwind CSS v4, the game is designed to be easily deployable, highly customizable, and friendly to both players and developers. The 6×6 grid (instead of traditional 9×9) makes it perfect for quick gaming sessions while maintaining the classic Sudoku challenge.

### 🎯 Key Highlights

- **Zero Setup Required** - Clone and play immediately in dev mode
- **Dual-Mode Architecture** - Switch between local-only and cloud-powered with one variable
- **Modern UI/UX** - Beautiful gradients, dark mode, smooth animations, responsive design
- **Firebase Integration** - Optional authentication, cloud storage, and real-time sync
- **Mobile-Friendly** - Touch-optimized controls and responsive layout
- **Lightweight** - No heavy frameworks, pure vanilla JavaScript
- **Customizable** - Modular codebase, easy to extend and modify

---

## ✨ Features

### 🎲 Game Mechanics

- **Three Difficulty Levels**

  - **Easy**: 14 cells removed, perfect for beginners
  - **Medium**: 18 cells removed, balanced challenge
  - **Hard**: 22 cells removed, brain-teaser mode

- **Smart Puzzle Generation**

  - Backtracking algorithm ensures solvable puzzles
  - Randomized patterns for unique games
  - Proper 2×3 box validation

- **Real-Time Validation**

  - Instant feedback on incorrect moves
  - Visual highlighting of conflicts
  - Mistake counter to track errors

- **Game Actions**
  - **New Game**: Fresh puzzle with confirmation
  - **Check**: Validate current solution
  - **Hint**: Reveal one correct cell
  - **Solve**: Auto-complete puzzle (for learning)

### 👤 Player Features

- **Input Methods**

  - Click/tap to select cells
  - Keyboard input (1-6, Backspace, Delete)
  - Touch-optimized number pad for mobile
  - Erase button with visual feedback

- **Visual Feedback**

  - Cell selection highlighting
  - Initial cells marked with distinct styling
  - User-entered numbers in accent color
  - Proper 2×3 box borders with bold lines

- **Performance Tracking**

  - Built-in timer from game start
  - Mistake counter
  - Victory modal with statistics
  - Personal best times (Production mode)

- **Persistence** (Production Mode Only)
  - Game history across sessions
  - Cross-device progress sync
  - Win streaks and statistics
  - Comprehensive dashboard

### 🎨 User Experience

- **Modern Interface**

  - Clean, card-based layout
  - Beautiful gradient backgrounds
  - Smooth transitions and animations
  - Responsive design for all screen sizes

- **Dark Mode**

  - System-aware theme detection
  - Manual toggle available
  - Consistent styling across modes
  - Optimized for eye comfort

- **Toast Notifications**

  - Non-intrusive feedback messages
  - Color-coded by type (success, warning, error, info)
  - Auto-dismiss with configurable duration
  - Clean, modern design

- **Mobile Optimization**
  - Touch-friendly button sizes
  - Optimized number pad layout
  - Hamburger menu for dashboard (Production)
  - Viewport-aware sizing

### 🔧 Dev and Prod Mode

#### Development Mode (Default)

- **What You Get**:

  - ✅ Full Sudoku game functionality
  - ✅ All difficulty levels
  - ✅ Timer and mistakes tracking
  - ✅ Number pad and keyboard input
  - ✅ Theme toggle (light/dark)
  - ✅ Victory modal
  - ✅ Toast notifications

- **What's Excluded**:

  - ❌ User authentication
  - ❌ Dashboard sidebar
  - ❌ Statistics tracking
  - ❌ Game history
  - ❌ Cloud synchronization
  - ❌ Firebase dependency

- **Use Cases**:
  - Local development and testing
  - Quick gameplay without setup
  - Offline environments
  - Privacy-focused usage
  - Learning and customization

#### Production Mode (Optional)

- **Additional Features**:

  - ✅ Email/Password authentication
  - ✅ Google OAuth sign-in
  - ✅ User profile with avatar
  - ✅ Statistics dashboard (games played, win rate, streaks)
  - ✅ Game history with timestamps
  - ✅ Best times per difficulty
  - ✅ Cross-device sync via Firebase
  - ✅ Firestore security rules
  - ✅ Mobile sidebar with overlay

- **Requirements**:
  - Firebase project setup
  - `firebase-config.js` configuration
  - Authentication enabled in Firebase Console
  - Firestore database created

---

## 🎯 How to Play

### The Rules

Mini Sudoku follows classic Sudoku rules on a 6×6 grid:

1. **Row Rule**: Each row must contain numbers 1-6 with no repeats
2. **Column Rule**: Each column must contain numbers 1-6 with no repeats
3. **Box Rule**: Each 2×3 box must contain numbers 1-6 with no repeats

**Goal**: Fill all empty cells following these three rules to complete the puzzle!

### Controls & Input

| Action             | Method                                        |
| ------------------ | --------------------------------------------- |
| **Select Cell**    | Click/tap any empty or user-filled cell       |
| **Enter Number**   | Type 1-6 on keyboard OR tap number pad button |
| **Erase Number**   | Press Backspace/Delete OR tap ❌ button       |
| **New Game**       | Click "New Game" button (with confirmation)   |
| **Check Solution** | Click "Check" to validate current progress    |
| **Get Hint**       | Click "Hint" to reveal one correct cell       |
| **View Solution**  | Click "Solve" to auto-complete (ends game)    |

### Visual Indicators

- **Gray Cells**: Initial puzzle numbers (cannot be changed)
- **Blue/Indigo Numbers**: Your entries (can be edited)
- **Highlighted Cell**: Currently selected cell (blue background)
- **Bold Lines**: 2×3 box boundaries
- **Timer**: Elapsed time since game start (top bar)
- **Mistakes**: Count of incorrect moves (top bar)

### Game Flow

1. Start a new game (select difficulty)
2. Click a cell to select it
3. Enter a number (1-6)
4. Repeat until all cells filled
5. Game auto-validates on completion
6. Victory modal shows your time and mistakes!

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher) - For npm and build tools
- **Git** - For cloning the repository
- **Modern Browser** - Chrome, Firefox, Safari, or Edge
- **Python 3** (optional) - For local HTTP server (or use alternatives)

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mini-sudoku.git
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

#### 3. Build CSS

```bash
npm run build:css:prod
```

This compiles Tailwind CSS with all necessary utility classes into `dist/output.css`.

**Alternative** (watch mode for development):

```bash
npm run build:css
```

#### 4. Start Local Server

**Option A: Python 3 (Built-in)**

```bash
npm start
# Or manually:
python3 -m http.server 8000
```

**Option B: Node.js http-server**

```bash
npx http-server -p 8000
```

**Option C: VS Code Live Server**

- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

#### 5. Open in Browser

Navigate to:

```
http://localhost:8000
```

**That's it!** The game runs in **Development Mode** by default. No Firebase setup needed! 🎉

### Verify Installation

You should see:

- ✅ Mini Sudoku game loads
- ✅ Console message: "🔧 Running in DEV mode - Auth and Dashboard disabled"
- ✅ Game centered on screen (no sidebar)
- ✅ All game functions work (new game, check, hint, solve)
- ✅ Theme toggle works

---

## 🧪 Dev and Testing

### Development Commands

```bash
# Install dependencies
npm install

# Build CSS (production)
npm run build:css:prod

# Build CSS (watch mode for development)
npm run build:css

# Start local server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Project Structure

```
mini-sudoku/
├── src/
│   └── input.css              # Tailwind source CSS
├── dist/
│   └── output.css             # Compiled CSS output
├── __tests__/
│   └── sudoku.test.js         # Jest unit tests
├── config.js                  # Mode configuration (dev/production)
├── index.html                 # Main HTML file
├── app.js                     # Game controller & UI logic
├── sudoku.js                  # Puzzle generation & validation
├── auth.js                    # Firebase authentication manager
├── toast.js                   # Toast notification system
├── firebase-config.js         # Firebase credentials (create from template)
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── package.json               # Dependencies and scripts
├── .gitignore                 # Git ignore rules
├── CHANGELOG.md               # Version history
└── README.md                  # This file
```

### Testing

The project uses **Jest** for unit testing.

#### Run All Tests

```bash
npm test
```

#### Watch Mode (Auto-rerun on changes)

```bash
npm run test:watch
```

#### Test Coverage

Current tests cover:

- ✅ Puzzle generation algorithms
- ✅ Board validation logic
- ✅ Move legality checking
- ✅ Solution verification

#### Writing Tests

Add tests in `__tests__/` directory:

```javascript
// Example test
describe("Sudoku Validation", () => {
  test("should detect invalid rows", () => {
    const sudoku = new Sudoku();
    // Test implementation
  });
});
```

### Debugging

#### Browser Console

- **Dev Mode**: `🔧 Running in DEV mode - Auth and Dashboard disabled`
- **Prod Mode**: `🚀 Running in PRODUCTION mode - Full features enabled`

#### Common Issues

**CSS not loading?**

```bash
npm run build:css:prod
```

**Port 8000 already in use?**

```bash
# Find and kill process
lsof -ti:8000 | xargs kill
# Or use different port
python3 -m http.server 3000
```

**Firebase errors in dev mode?**

- This is expected! Dev mode skips Firebase initialization
- Check console for "🔧 Dev mode: Skipping Firebase initialization"

### Code Style

- **JavaScript**: ES6+ features, modular design
- **Indentation**: 2 spaces
- **Comments**: JSDoc style for functions
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **CSS**: Tailwind utility classes, minimal custom CSS

---

## 🔄 Dev vs Prod Mode Switching

The app uses a simple configuration system to toggle between development and production modes.

### Current Mode: Development (Default)

By default, the app runs in **development mode**, which provides a clean Sudoku game without any authentication or cloud features.

### Switching to Production Mode

#### Step 1: Edit Configuration

Open `config.js` and change the MODE variable:

```javascript
const CONFIG = {
  MODE: "production", // Changed from 'dev'
};
```

#### Step 2: Create Firebase Configuration

**2a. Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard
4. Add a web app to your project

**2b. Enable Services**

1. **Authentication**:

   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional)

2. **Firestore**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location

**2c. Get Configuration**

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Click the web app
4. Copy the Firebase configuration object

**2d. Create `firebase-config.js`**

Create a new file named `firebase-config.js` in the root directory:

```javascript
/**
 * Firebase Configuration
 *
 * Get these credentials from:
 * Firebase Console → Project Settings → General → Your apps → Web app
 *
 * SECURITY: This file is gitignored. Never commit credentials to version control.
 */

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID", // Optional
};
```

Replace all `YOUR_*` values with your actual Firebase credentials.

#### Step 3: Configure Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

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

Click "Publish" to save the rules.

#### Step 4: Refresh Application

Hard refresh your browser:

- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + F5`

Check the console for:

```
🚀 Running in PRODUCTION mode - Full features enabled
✅ Firebase initialized successfully
```

### Production Mode Verification

After switching, verify these features work:

- ✅ Dashboard sidebar appears on left (desktop) or hamburger menu (mobile)
- ✅ "Sign In to Save Progress" button visible
- ✅ Click sign-in button opens authentication modal
- ✅ Email/Password sign-up and sign-in work
- ✅ Google OAuth sign-in works (if enabled)
- ✅ After login, dashboard shows statistics
- ✅ Game history populates after completing games
- ✅ Sign out works correctly

### Switching Back to Dev Mode

To return to development mode:

1. Open `config.js`
2. Change `MODE: "production"` to `MODE: "dev"`
3. Refresh browser

The dashboard and authentication will be hidden again.

### Mode Comparison Table

| Feature               | Dev Mode                | Prod Mode   |
| --------------------- | ----------------------- | ----------- |
| **Sudoku Game**       | ✅ Full                 | ✅ Full     |
| **Timer & Mistakes**  | ✅ Yes                  | ✅ Yes      |
| **Theme Toggle**      | ✅ Yes                  | ✅ Yes      |
| **Number Pad**        | ✅ Yes                  | ✅ Yes      |
| **Authentication**    | ❌ No                   | ✅ Yes      |
| **Dashboard**         | ❌ No                   | ✅ Yes      |
| **Statistics**        | ❌ No                   | ✅ Yes      |
| **Game History**      | ❌ No                   | ✅ Yes      |
| **Cloud Sync**        | ❌ No                   | ✅ Yes      |
| **Firebase Setup**    | ❌ Not Required         | ✅ Required |
| **Internet Required** | ❌ No (offline-capable) | ✅ Yes      |

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

**Example**:

```
Title: Timer doesn't reset on new game

Steps:
1. Start a game in Medium difficulty
2. Wait 30 seconds
3. Click "New Game" and confirm
4. Timer shows 00:30 instead of 00:00

Environment: Chrome 120, macOS, Dev Mode
```

#### 2. Suggest Features

Have an idea? Open an issue with:

- **Feature description**: What you want added
- **Use case**: Why it's useful
- **Possible implementation**: Ideas on how to build it (optional)

#### 3. Submit Pull Requests

**Process**:

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
   npm run build:css:prod
   npm test
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

**JavaScript**:

- Use ES6+ features (arrow functions, destructuring, etc.)
- 2-space indentation
- camelCase for variables/functions
- PascalCase for classes
- Descriptive variable names
- Add JSDoc comments for functions

**Example**:

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

**HTML/CSS**:

- Use Tailwind utility classes
- Semantic HTML5 tags
- Accessible markup (ARIA labels where needed)
- Mobile-first responsive design

**Git Commits**:

- Clear, concise commit messages
- Use conventional commit format
- One logical change per commit
- Reference issue numbers when applicable

#### Testing

- Write tests for new features
- Ensure existing tests pass
- Test in multiple browsers
- Test in both dev and prod modes
- Test responsive behavior on mobile

#### Documentation

- Update README.md if adding features
- Add JSDoc comments for new functions
- Update CHANGELOG.md for version changes
- Include code examples where helpful

### Areas for Contribution

**Good First Issues**:

- 🎨 UI improvements (colors, spacing, animations)
- 📝 Documentation enhancements
- 🐛 Bug fixes
- ♿ Accessibility improvements
- 🌐 Internationalization (i18n)

**Feature Ideas**:

- 🔊 Sound effects and music
- 🏆 Achievement system
- 📊 Global leaderboard
- 📅 Daily challenges
- 🔗 Puzzle sharing (export/import)
- ↩️ Undo/Redo functionality
- 💡 Hint explanations (why this number?)
- 👥 Multiplayer challenges
- 🎨 Theme customization
- 📱 PWA support (offline gameplay)

### Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Give credit where due
- Focus on the code, not the person
- Help others learn and grow

### Questions?

- Open a discussion on GitHub
- Comment on relevant issues
- Check existing documentation first

**Thank you for contributing!** 🙏

---

## 🚀 Future Enhancements

### Planned Features

#### 🎮 Gameplay

- [ ] **Undo/Redo System**

  - Step backward/forward through moves
  - Visual history of changes
  - Keyboard shortcuts (Ctrl+Z / Ctrl+Y)

- [ ] **Advanced Hints**

  - Explain why a number goes in a cell
  - Highlight conflicting cells
  - Progressive hint system (easy → hard)

- [ ] **Puzzle Import/Export**

  - Share puzzles with friends
  - Custom puzzle creation
  - QR code generation for sharing

- [ ] **Difficulty Customization**
  - User-defined difficulty (10-30 cells removed)
  - Puzzle complexity rating
  - Pattern-based generation options

#### 🏆 Achievements & Progression

- [ ] **Achievement System**

  - Unlock badges for milestones
  - Special achievements (speed runs, no mistakes, etc.)
  - Progress tracking dashboard

- [ ] **Daily Challenges**

  - One puzzle per day for all users
  - Global completion statistics
  - Special rewards for streaks

- [ ] **Global Leaderboard**
  - Best times per difficulty
  - Weekly/monthly rankings
  - Friends-only leaderboards

#### 🎨 Customization

- [ ] **Theme Gallery**

  - Multiple color schemes
  - Custom theme creator
  - Import/export themes

- [ ] **Grid Size Options**

  - 4×4 (beginner mode)
  - 9×9 (classic Sudoku)
  - 12×12 (expert mode)

- [ ] **Sound & Music**
  - Optional sound effects
  - Background music
  - Customizable audio settings
  - Volume controls

#### 👥 Social Features

- [ ] **Multiplayer**

  - Race mode (same puzzle, fastest wins)
  - Co-op mode (solve together)
  - Asynchronous challenges

- [ ] **Friends System**

  - Add friends within the app
  - Compare statistics
  - Send challenges
  - Activity feed

- [ ] **Social Sharing**
  - Share victories on social media
  - Achievement sharing
  - Puzzle recommendations

#### 📱 Technical Improvements

- [ ] **Progressive Web App (PWA)**

  - Install as standalone app
  - Offline functionality
  - Push notifications for challenges

- [ ] **Performance Optimizations**

  - Lazy loading for dashboard
  - Service worker caching
  - Optimized bundle size

- [ ] **Internationalization (i18n)**

  - Multi-language support
  - Localized number formats
  - RTL language support

- [ ] **Accessibility Enhancements**
  - Screen reader improvements
  - Keyboard navigation enhancements
  - High contrast mode
  - Font size adjustments

#### 🤖 AI & Analytics

- [ ] **AI Opponent**

  - Solve puzzles step-by-step
  - Learn from player strategies
  - Difficulty-adaptive hints

- [ ] **Analytics Dashboard**
  - Detailed play patterns
  - Improvement metrics
  - Time-spent analysis
  - Error frequency tracking

### Community Suggestions

Have an idea? [Open an issue](https://github.com/YOUR_USERNAME/mini-sudoku/issues) with the `enhancement` label!

---

## 📝 License

This project is licensed under the **MIT License** - see below for details.

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

### What This Means

✅ **You CAN**:

- Use this project commercially
- Modify the source code
- Distribute your modifications
- Use it privately
- Sublicense the code

❌ **You CANNOT**:

- Hold the authors liable
- Use the authors' names for endorsement without permission

📋 **You MUST**:

- Include the copyright notice
- Include the license text

---

## 🙏 Acknowledgements

### Technologies & Libraries

- **[Tailwind CSS](https://tailwindcss.com/)** - For the amazing utility-first CSS framework that makes styling a breeze
- **[Firebase](https://firebase.google.com/)** - For providing robust backend services, authentication, and cloud storage
- **[Jest](https://jestjs.io/)** - For the powerful JavaScript testing framework
- **[PostCSS](https://postcss.org/)** - For CSS transformation and build pipeline
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - For making the web interactive

### Inspiration & Resources

- **Classic Sudoku** - The timeless puzzle game that inspired this project
- **Web Dev Community** - For countless tutorials, guides, and open-source examples
- **Stack Overflow** - For helping solve tricky implementation challenges
- **MDN Web Docs** - For comprehensive JavaScript and Web API documentation

### Special Thanks

- **Alpha Testers** - For providing valuable feedback during development
- **Contributors** - Everyone who has submitted pull requests, reported bugs, or suggested features
- **Players** - For playing the game and making this project worthwhile
- **You** - For checking out this project! 🎉

### Open Source

This project stands on the shoulders of giants. We're grateful to all open-source maintainers who make projects like this possible. Special recognition to:

- Tailwind Labs team for Tailwind CSS v4
- Firebase team at Google
- All npm package maintainers we depend on

### Support & Feedback

If you find this project helpful:

- ⭐ **Star the repository** on GitHub
- 🐦 **Share it** with friends and on social media
- 🐛 **Report bugs** to help improve it
- 💡 **Suggest features** to make it better
- 🤝 **Contribute code** to add new features

---

## 📧 Contact & Support

- **📂 Repository**: [GitHub](https://github.com/YOUR_USERNAME/mini-sudoku)
- **🐛 Bug Reports**: [Open an Issue](https://github.com/YOUR_USERNAME/mini-sudoku/issues/new?template=bug_report.md)
- **💡 Feature Requests**: [Open an Issue](https://github.com/YOUR_USERNAME/mini-sudoku/issues/new?template=feature_request.md)
- **📖 Documentation**: [View README](https://github.com/YOUR_USERNAME/mini-sudoku#readme)
- **📝 Changelog**: [CHANGELOG.md](./CHANGELOG.md)

---

<div align="center">

**Made with ❤️ and ☕**

**Enjoy the game? Give it a ⭐!**

[⬆ Back to Top](#-mini-sudoku---66-puzzle-game)

---

_Version 2.1.0 - Last Updated: November 2024_

</div>
