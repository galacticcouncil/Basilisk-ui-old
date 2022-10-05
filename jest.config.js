const esModules = ['@polkadot'].join('|')

module.exports = {
  // preset: 'jest-playwright-preset',
  testRegex: './*\\.test\\.ts$',
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
    [`(${esModules}).+\\.js$`]: 'ts-jest'
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  setupFiles: ['<rootDir>/jest.env.js'],
  coverageReporters: [
    'clover',
    'json',
    'lcov',
    ['text', { skipFull: true }],
    'jest-junit'
  ],
  coverageDirectory: './coverage/unit-tests/report',
  reporters: ['jest-junit'],
  testPathIgnorePatterns: ['./*.stories.test.ts$'],
  transformIgnorePatterns: ['node_modules/(?!@polkadot)/']
}
