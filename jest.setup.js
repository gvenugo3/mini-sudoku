// Jest setup file for test environment configuration

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.APP_MODE
global.window = global.window || {};
window.APP_MODE = 'dev';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Helper to create DOM elements for testing
global.createMockElement = (id, tag = 'div') => {
  const element = document.createElement(tag);
  element.id = id;
  document.body.appendChild(element);
  return element;
};

// Clean up DOM after each test
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
