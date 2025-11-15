/**
 * Firebase Authentication Module
 * Handles user authentication and session management
 */

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Import the initialized Firebase app
import app from "./firebase-config.js";

class AuthManager {
  constructor() {
    this.isConfigured = false;
    this.currentUser = null;
    this.onAuthChangeCallbacks = [];

    // Skip Firebase initialization in dev mode
    if (typeof window !== "undefined" && window.APP_MODE === "dev") {
      console.log("🔧 Dev mode: Skipping Firebase initialization");
      return;
    }

    // Use the imported Firebase app
    try {
      this.app = app;
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.isConfigured = true;

      // Listen to auth state changes
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        this.onAuthChangeCallbacks.forEach((callback) => callback(user));
      });

      console.log("✅ Firebase initialized successfully");
    } catch (error) {
      // Firebase app not initialized or initialization failed
      console.warn("⚠️ Firebase not initialized:", error.message);
      console.log("App will run in local-only mode");
      console.log("Make sure .env.local has proper Firebase credentials");
    }
  }

  /**
   * Register callback for auth state changes
   */
  onAuthChange(callback) {
    this.onAuthChangeCallbacks.push(callback);
  }

  /**
   * Sign up with email and password
   */
  async signUp(email, password, displayName) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: "Firebase not configured. See SETUP_GUIDE.md",
      };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Create user document in Firestore
      await this.createUserDocument(userCredential.user);

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: "Firebase not configured. See SETUP_GUIDE.md",
      };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    if (!this.isConfigured) {
      return {
        success: false,
        error: "Firebase not configured. See SETUP_GUIDE.md",
      };
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);

      // Check if user document exists, if not create it
      const userDoc = await getDoc(
        doc(this.db, "users", userCredential.user.uid)
      );
      if (!userDoc.exists()) {
        await this.createUserDocument(userCredential.user);
      }

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    if (!this.isConfigured) {
      return { success: false, error: "Firebase not configured" };
    }
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create user document in Firestore
   */
  async createUserDocument(user) {
    const userRef = doc(this.db, "users", user.uid);

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Anonymous",
      createdAt: serverTimestamp(),
      stats: {
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
      },
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    if (!this.isConfigured || !this.currentUser) return null;

    try {
      const userRef = doc(this.db, "users", this.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data().stats;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  }

  /**
   * Update user statistics after game completion
   */
  async updateUserStats(gameData) {
    if (!this.isConfigured || !this.currentUser) return;

    try {
      const userRef = doc(this.db, "users", this.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentStats = userDoc.data().stats;
        const won = gameData.won;

        const updatedStats = {
          gamesPlayed: currentStats.gamesPlayed + 1,
          gamesWon: won ? currentStats.gamesWon + 1 : currentStats.gamesWon,
          totalTime: currentStats.totalTime + gameData.time,
          totalMistakes: currentStats.totalMistakes + gameData.mistakes,
          currentStreak: won ? currentStats.currentStreak + 1 : 0,
          bestStreak: won
            ? Math.max(currentStats.currentStreak + 1, currentStats.bestStreak)
            : currentStats.bestStreak,
          bestTimes: {
            ...currentStats.bestTimes,
          },
        };

        // Update best time for difficulty
        const difficulty = gameData.difficulty;
        if (won && gameData.time > 0) {
          if (
            !updatedStats.bestTimes[difficulty] ||
            gameData.time < updatedStats.bestTimes[difficulty]
          ) {
            updatedStats.bestTimes[difficulty] = gameData.time;
          }
        }

        await updateDoc(userRef, { stats: updatedStats });
        return { success: true, stats: updatedStats };
      }
    } catch (error) {
      console.error("Error updating user stats:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save game to history
   */
  async saveGameToHistory(gameData) {
    if (!this.isConfigured || !this.currentUser) return;

    try {
      const gamesRef = collection(
        this.db,
        "users",
        this.currentUser.uid,
        "games"
      );

      await addDoc(gamesRef, {
        difficulty: gameData.difficulty,
        time: gameData.time,
        mistakes: gameData.mistakes,
        completed: gameData.won,
        timestamp: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error saving game:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get game history
   */
  async getGameHistory(limitCount = 10) {
    if (!this.isConfigured || !this.currentUser) return [];

    try {
      const gamesRef = collection(
        this.db,
        "users",
        this.currentUser.uid,
        "games"
      );
      const q = query(
        gamesRef,
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      const games = [];
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() });
      });

      return games;
    } catch (error) {
      console.error("Error fetching game history:", error);
      return [];
    }
  }

  /**
   * Get leaderboard (top players by wins)
   */
  async getLeaderboard(limitCount = 10) {
    if (!this.isConfigured) return [];
    try {
      const usersRef = collection(this.db, "users");
      const q = query(
        usersRef,
        orderBy("stats.gamesWon", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      const leaderboard = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboard.push({
          uid: doc.id,
          displayName: data.displayName,
          gamesWon: data.stats.gamesWon,
          gamesPlayed: data.stats.gamesPlayed,
          winRate:
            data.stats.gamesPlayed > 0
              ? ((data.stats.gamesWon / data.stats.gamesPlayed) * 100).toFixed(
                  1
                )
              : 0,
        });
      });

      return leaderboard;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }
}

// Create singleton instance
const authManager = new AuthManager();
export default authManager;
