module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/tests/**/*.test.(js|ts)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};