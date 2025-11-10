module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['*.js', '!jest.config.js'],
  coveragePathIgnorePatterns: ['/node_modules/', 'jest.config.js']
};
