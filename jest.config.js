module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/test-config/setup.js'],
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
      '*.js',
      '!*.test.js',
      '!jest.config.js',
      '!run-tests.js'
    ],
    coverageThreshold: {
      global: {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85
      }
    }
  };