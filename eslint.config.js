const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  {
    ignores: ['.expo/**', 'android/**', 'coverage/**', 'ios/**', 'node_modules/**'],
  },
  expoConfig,
  {
    rules: {
      'import/order': [
        'warn',
        {
          alphabetize: { order: 'asc' },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
        },
      ],
    },
  },
]);
