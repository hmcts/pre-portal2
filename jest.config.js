module.exports = {
  roots: ['<rootDir>/src/test/unit', '<rootDir>/src/test/routes'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coveragePathIgnorePatterns: ['/src/main/modules/properties-volume/*', '/src/main/assets/js/*'],
  testPathIgnorePatterns: ['.helper.ts'],
};
