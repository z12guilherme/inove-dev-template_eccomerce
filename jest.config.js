const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Fornece o caminho para o seu aplicativo Next.js para carregar next.config.js e .env no ambiente de teste
  dir: './',
});

// Adicione qualquer configuração personalizada a ser passada para o Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

// exportado dessa forma para garantir que o next/jest carregue a configuração async
module.exports = createJestConfig(customJestConfig);