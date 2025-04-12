/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/*.d.ts",
    "!src/**/*.spec.{js,ts}",
    "!src/**/index.{js,ts}",
  ],
  coveragePathIgnorePatterns: [
    "node_modules",
    "dist",
    "src/database.ts",
  ],
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  preset: 'ts-jest/presets/default-esm', // importante!
  extensionsToTreatAsEsm: ['.ts'],
  
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1' // remove o `.js` nos imports durante teste
  },
};