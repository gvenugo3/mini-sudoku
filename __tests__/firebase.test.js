// Firebase Integration Tests
// Tests for auth.js with mocked Firebase services

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

// Mock firebase-config
jest.mock('../firebase-config.js', () => ({
  default: { name: '[DEFAULT]' }
}));

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

describe('Firebase Authentication Integration', () => {
  let authManager;
  let mockAuth;
  let mockDb;
  let mockUser;
  let authStateCallback;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup window.APP_MODE
    global.window.APP_MODE = 'production';

    // Setup mock auth
    mockAuth = {};
    mockDb = {};
    mockUser = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    // Setup Firebase function mocks
    getAuth.mockReturnValue(mockAuth);
    getFirestore.mockReturnValue(mockDb);

    // Capture the onAuthStateChanged callback
    onAuthStateChanged.mockImplementation((auth, callback) => {
      authStateCallback = callback;
      return jest.fn(); // Unsubscribe function
    });

    // Clear module cache to reinitialize authManager
    delete require.cache[require.resolve('../auth.js')];

    // Import fresh instance
    authManager = require('../auth.js').default;
  });

  describe('Initialization', () => {
    test('should initialize Firebase when configured', () => {
      expect(getAuth).toHaveBeenCalled();
      expect(getFirestore).toHaveBeenCalled();
      expect(authManager.isConfigured).toBe(true);
    });

    test('should return error when Firebase not configured in dev mode', async () => {
      // In dev mode, authManager.isConfigured would be false
      // Manually set it to test error handling
      const originalConfigured = authManager.isConfigured;
      authManager.isConfigured = false;

      const result = await authManager.signUp('test@example.com', 'password123', 'Test User');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Firebase not configured');

      // Restore
      authManager.isConfigured = originalConfigured;
    });
  });

  describe('Sign Up', () => {
    test('should successfully create new user account', async () => {
      authManager.isConfigured = true;

      const mockUserCredential = { user: mockUser };
      createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
      updateProfile.mockResolvedValue(undefined);
      setDoc.mockResolvedValue(undefined);
      doc.mockReturnValue('userDocRef');

      const result = await authManager.signUp('test@example.com', 'password123', 'Test User');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
    });

    test('should update user display name', async () => {
      authManager.isConfigured = true;

      const mockUserCredential = { user: mockUser };
      createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
      updateProfile.mockResolvedValue(undefined);
      setDoc.mockResolvedValue(undefined);
      doc.mockReturnValue('userDocRef');

      await authManager.signUp('test@example.com', 'password123', 'Test User');

      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: 'Test User',
      });
    });

    test('should create user document in Firestore', async () => {
      authManager.isConfigured = true;

      const mockUserCredential = { user: mockUser };
      createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
      updateProfile.mockResolvedValue(undefined);
      setDoc.mockResolvedValue(undefined);
      doc.mockReturnValue('userDocRef');

      await authManager.signUp('test@example.com', 'password123', 'Test User');

      expect(doc).toHaveBeenCalledWith(mockDb, 'users', mockUser.uid);
      expect(setDoc).toHaveBeenCalledWith(
        'userDocRef',
        expect.objectContaining({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: 'Test User',
          stats: expect.objectContaining({
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
          }),
        })
      );
    });

    test('should handle sign up errors', async () => {
      authManager.isConfigured = true;

      createUserWithEmailAndPassword.mockRejectedValue(
        new Error('Email already in use')
      );

      const result = await authManager.signUp('test@example.com', 'password123', 'Test User');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already in use');
    });

    test('should return error when Firebase not configured', async () => {
      authManager.isConfigured = false;

      const result = await authManager.signUp('test@example.com', 'password123', 'Test User');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Firebase not configured');
    });
  });

  describe('Sign In', () => {
    test('should successfully sign in user with email and password', async () => {
      authManager.isConfigured = true;

      const mockUserCredential = { user: mockUser };
      signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      const result = await authManager.signIn('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
    });

    test('should handle sign in errors', async () => {
      authManager.isConfigured = true;

      signInWithEmailAndPassword.mockRejectedValue(
        new Error('Invalid credentials')
      );

      const result = await authManager.signIn('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    test('should return error when Firebase not configured', async () => {
      authManager.isConfigured = false;

      const result = await authManager.signIn('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Firebase not configured');
    });
  });

  describe('Google Sign In', () => {
    test('should successfully sign in with Google', async () => {
      authManager.isConfigured = true;

      const mockUserCredential = { user: mockUser };
      signInWithPopup.mockResolvedValue(mockUserCredential);

      const mockDocRef = {};
      const mockDocSnapshot = { exists: () => false };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);
      setDoc.mockResolvedValue(undefined);

      const result = await authManager.signInWithGoogle();

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(signInWithPopup).toHaveBeenCalledWith(
        mockAuth,
        expect.any(Object)
      );
    });

    test('should create user document if not exists', async () => {
      authManager.isConfigured = true;

      const mockUserCredential = { user: mockUser };
      signInWithPopup.mockResolvedValue(mockUserCredential);

      const mockDocRef = {};
      const mockDocSnapshot = { exists: () => false };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);
      setDoc.mockResolvedValue(undefined);

      await authManager.signInWithGoogle();

      expect(setDoc).toHaveBeenCalled();
    });

    test('should not create user document if already exists', async () => {
      authManager.isConfigured = true;

      const mockUserCredential = { user: mockUser };
      signInWithPopup.mockResolvedValue(mockUserCredential);

      const mockDocRef = {};
      const mockDocSnapshot = { exists: () => true };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);
      setDoc.mockResolvedValue(undefined);

      jest.clearAllMocks();
      authManager.isConfigured = true; // Re-set after clear
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);

      await authManager.signInWithGoogle();

      expect(setDoc).not.toHaveBeenCalled();
    });

    test('should handle Google sign in errors', async () => {
      authManager.isConfigured = true;

      signInWithPopup.mockRejectedValue(new Error('Popup closed'));

      const result = await authManager.signInWithGoogle();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Popup closed');
    });
  });

  describe('Sign Out', () => {
    test('should successfully sign out user', async () => {
      authManager.isConfigured = true;

      signOut.mockResolvedValue(undefined);

      const result = await authManager.signOut();

      expect(result.success).toBe(true);
      expect(signOut).toHaveBeenCalledWith(mockAuth);
    });

    test('should handle sign out errors', async () => {
      authManager.isConfigured = true;

      signOut.mockRejectedValue(new Error('Sign out failed'));

      const result = await authManager.signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sign out failed');
    });
  });

  describe('User Stats Management', () => {
    beforeEach(() => {
      // Setup current user
      authManager.currentUser = mockUser;
    });

    test('should fetch user statistics', async () => {
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      const mockStats = {
        gamesPlayed: 5,
        gamesWon: 3,
        currentStreak: 2,
      };

      const mockDocRef = {};
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({ stats: mockStats }),
      };

      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);

      const result = await authManager.getUserStats();

      expect(result).toEqual(mockStats);
      expect(doc).toHaveBeenCalledWith(mockDb, 'users', mockUser.uid);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    });

    test('should return null when user document does not exist', async () => {
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      const mockDocRef = {};
      const mockDocSnapshot = {
        exists: () => false,
      };

      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);

      const result = await authManager.getUserStats();

      expect(result).toBeNull();
    });

    test('should update stats after winning game', async () => {
      // Make sure authManager is configured and has current user
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      const currentStats = {
        gamesPlayed: 5,
        gamesWon: 3,
        totalTime: 600,
        totalMistakes: 10,
        currentStreak: 2,
        bestStreak: 3,
        bestTimes: { easy: 30, medium: 45, hard: 60 },
      };

      const mockDocRef = {};
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({ stats: currentStats }),
      };

      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);
      updateDoc.mockResolvedValue(undefined);

      const gameData = {
        difficulty: 'medium',
        time: 50,
        mistakes: 2,
        won: true,
      };

      const result = await authManager.updateUserStats(gameData);

      expect(result.success).toBe(true);
      expect(result.stats.gamesPlayed).toBe(6);
      expect(result.stats.gamesWon).toBe(4);
      expect(result.stats.currentStreak).toBe(3);
      expect(result.stats.bestTimes.medium).toBe(45); // Best time unchanged
      expect(updateDoc).toHaveBeenCalled();
    });

    test('should update best time when beating previous record', async () => {
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      const currentStats = {
        gamesPlayed: 5,
        gamesWon: 3,
        totalTime: 600,
        totalMistakes: 10,
        currentStreak: 2,
        bestStreak: 3,
        bestTimes: { easy: 30, medium: 50, hard: 60 },
      };

      const mockDocRef = {};
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({ stats: currentStats }),
      };

      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);
      updateDoc.mockResolvedValue(undefined);

      const gameData = {
        difficulty: 'medium',
        time: 40,
        mistakes: 0,
        won: true,
      };

      const result = await authManager.updateUserStats(gameData);

      expect(result.stats.bestTimes.medium).toBe(40);
    });

    test('should reset streak on loss', async () => {
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      const currentStats = {
        gamesPlayed: 5,
        gamesWon: 3,
        currentStreak: 2,
        bestStreak: 3,
        totalTime: 600,
        totalMistakes: 10,
        bestTimes: { easy: 30, medium: 50, hard: 60 },
      };

      const mockDocRef = {};
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({ stats: currentStats }),
      };

      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnapshot);
      updateDoc.mockResolvedValue(undefined);

      const gameData = {
        difficulty: 'hard',
        time: 120,
        mistakes: 5,
        won: false,
      };

      const result = await authManager.updateUserStats(gameData);

      expect(result.stats.currentStreak).toBe(0);
      expect(result.stats.bestStreak).toBe(3); // Unchanged
    });
  });

  describe('Game History', () => {
    beforeEach(() => {
      authManager.currentUser = mockUser;
    });

    test('should save game to history', async () => {
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      const mockCollectionRef = {};
      const mockDocRef = { id: 'game123' };

      collection.mockReturnValue(mockCollectionRef);
      addDoc.mockResolvedValue(mockDocRef);

      const gameData = {
        difficulty: 'medium',
        time: 120,
        mistakes: 2,
        won: true,
      };

      const result = await authManager.saveGameToHistory(gameData);

      expect(result.success).toBe(true);
      expect(collection).toHaveBeenCalledWith(
        mockDb,
        'users',
        mockUser.uid,
        'games'
      );
      expect(addDoc).toHaveBeenCalledWith(
        mockCollectionRef,
        expect.objectContaining({
          difficulty: 'medium',
          time: 120,
          mistakes: 2,
          completed: true,
        })
      );
    });

    test('should fetch game history', async () => {
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      const mockGames = [
        {
          id: 'game1',
          difficulty: 'easy',
          time: 60,
          mistakes: 1,
          completed: true,
        },
        {
          id: 'game2',
          difficulty: 'medium',
          time: 120,
          mistakes: 2,
          completed: true,
        },
      ];

      const mockCollectionRef = {};
      const mockQueryRef = {};
      const mockDocSnapshots = mockGames.map((game) => ({
        id: game.id,
        data: () => ({ ...game }),
      }));

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockDocSnapshots.forEach((doc) => {
            callback(doc);
          });
        }),
      };

      collection.mockReturnValue(mockCollectionRef);
      query.mockReturnValue(mockQueryRef);
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await authManager.getGameHistory(10);

      expect(result.length).toBe(2);
      expect(result[0].difficulty).toBe('easy');
      expect(result[1].difficulty).toBe('medium');
      expect(getDocs).toHaveBeenCalledWith(mockQueryRef);
    });

    test('should return empty array when no games found', async () => {
      const mockCollectionRef = {};
      const mockQueryRef = {};

      const mockQuerySnapshot = {
        forEach: jest.fn(),
      };

      collection.mockReturnValue(mockCollectionRef);
      query.mockReturnValue(mockQueryRef);
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await authManager.getGameHistory(10);

      expect(result).toEqual([]);
    });

    test('should handle game history fetch errors', async () => {
      collection.mockReturnValue({});
      query.mockReturnValue({});
      getDocs.mockRejectedValue(new Error('Fetch failed'));

      const result = await authManager.getGameHistory(10);

      expect(result).toEqual([]);
    });
  });

  describe('Leaderboard', () => {
    test('should fetch leaderboard', async () => {
      authManager.isConfigured = true;

      const mockLeaderboardData = [
        {
          id: 'user1',
          data: () => ({
            displayName: 'Alice',
            stats: { gamesWon: 10, gamesPlayed: 12 },
          }),
        },
        {
          id: 'user2',
          data: () => ({
            displayName: 'Bob',
            stats: { gamesWon: 8, gamesPlayed: 10 },
          }),
        },
      ];

      const mockCollectionRef = {};
      const mockQueryRef = {};

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockLeaderboardData.forEach((user) => {
            callback(user);
          });
        }),
      };

      collection.mockReturnValue(mockCollectionRef);
      query.mockReturnValue(mockQueryRef);
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await authManager.getLeaderboard(10);

      expect(result.length).toBe(2);
      expect(result[0].displayName).toBe('Alice');
      expect(result[0].gamesWon).toBe(10);
    });

    test('should calculate win rate in leaderboard', async () => {
      authManager.isConfigured = true;

      const mockLeaderboardData = [
        {
          id: 'user1',
          data: () => ({
            displayName: 'Alice',
            stats: { gamesWon: 10, gamesPlayed: 20 },
          }),
        },
      ];

      const mockCollectionRef = {};
      const mockQueryRef = {};

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockLeaderboardData.forEach((user) => {
            callback(user);
          });
        }),
      };

      collection.mockReturnValue(mockCollectionRef);
      query.mockReturnValue(mockQueryRef);
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await authManager.getLeaderboard(10);

      expect(result[0].winRate).toBe('50.0');
    });
  });

  describe('Auth State Management', () => {
    test('should track current user', () => {
      authStateCallback(mockUser);

      expect(authManager.currentUser).toEqual(mockUser);
    });

    test('should check if user is authenticated', () => {
      authManager.currentUser = mockUser;

      expect(authManager.isAuthenticated()).toBe(true);
    });

    test('should return false when user not authenticated', () => {
      authManager.currentUser = null;

      expect(authManager.isAuthenticated()).toBe(false);
    });

    test('should get current user', () => {
      authManager.currentUser = mockUser;

      const user = authManager.getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    test('should notify callbacks on auth state change', () => {
      const callback = jest.fn();
      authManager.onAuthChange(callback);

      authStateCallback(mockUser);

      expect(callback).toHaveBeenCalledWith(mockUser);
    });

    test('should support multiple auth change callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      authManager.onAuthChange(callback1);
      authManager.onAuthChange(callback2);

      authStateCallback(mockUser);

      expect(callback1).toHaveBeenCalledWith(mockUser);
      expect(callback2).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      authManager.currentUser = mockUser;
    });

    test('should handle network errors gracefully', async () => {
      getDoc.mockRejectedValue(new Error('Network error'));
      doc.mockReturnValue({});

      const result = await authManager.getUserStats();

      expect(result).toBeNull();
    });

    test('should handle Firestore permission errors', async () => {
      authManager.isConfigured = true;
      authManager.currentUser = mockUser;

      updateDoc.mockRejectedValue(new Error('Permission denied'));
      doc.mockReturnValue({});
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          stats: {
            gamesPlayed: 0,
            gamesWon: 0,
            totalTime: 0,
            totalMistakes: 0,
            currentStreak: 0,
            bestStreak: 0,
            bestTimes: {},
          },
        }),
      });

      const result = await authManager.updateUserStats({
        difficulty: 'easy',
        time: 30,
        mistakes: 0,
        won: true,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Permission denied');
    });

    test('should return empty array when leaderboard fetch fails', async () => {
      authManager.isConfigured = true;

      collection.mockReturnValue({});
      query.mockReturnValue({});
      getDocs.mockRejectedValue(new Error('Leaderboard fetch failed'));

      const result = await authManager.getLeaderboard(10);

      expect(result).toEqual([]);
    });
  });
});
