module.exports = {
  testEnvironment: 'node',
  collectCoverage: false,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/tests/**/*.test.(js|ts)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};