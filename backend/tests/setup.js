// Setup global test configuration
global.console = {
  ...console,
  // Silence console.log during tests
  log: jest.fn(),
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};