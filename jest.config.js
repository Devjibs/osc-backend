export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    globalSetup: './tests/setupTestDB.ts',
  };
  