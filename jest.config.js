module.exports = {
  preset: 'jest-playwright-preset',
  testRegex: './*\\.test\\.ts$',
  setupFilesAfterEnv: ['./setup.js'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  setupFiles: ["<rootDir>/jest.env.js"],
}