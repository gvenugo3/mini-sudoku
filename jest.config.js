module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'sudoku.js',
    '!app.js',  // Exclude UI code from coverage (primarily DOM manipulation)
    '!jest.config.js',
    '!jest.setup.js',
    '!babel.config.js',
    '!firebase-config.js',
    '!auth.js',
    '!toast.js',
    '!vite.config.js'
  ],
  coveragePathIgnorePatterns: ['/node_modules/', 'dist/', 'dist-build/'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 95,
      statements: 95
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  collectCoverage: false, // Only collect when explicitly requested
  coverageReporters: ['text', 'lcov', 'html']
};
