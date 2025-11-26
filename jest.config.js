export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/test/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/test/**',
    '!src/seed/**',
    '!src/generated/**',
    '!src/docs/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  // Configurações para evitar que os testes fiquem travados
  testTimeout: 30000,
  detectOpenHandles: true,
  forceExit: true,
  // Executar testes sequencialmente para evitar sobrecarga
  maxWorkers: 1
};
