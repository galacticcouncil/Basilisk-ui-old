module.exports = {
  preset: 'jest-playwright-preset',
  testRegex: './*\\.test\\.ts$',
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  setupFiles: ["<rootDir>/jest.env.js"],
}