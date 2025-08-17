import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/build/**', 'jest.setup.js', 'jest.config.js'] },
  js.configs.recommended,
  // TypeScript ESLint recommended (no type-aware rules to simplify setup)
  ...tseslint.configs.recommended,
  // Configuration for Jest test files
  {
    files: ['**/__tests__/**/*.{js,ts,tsx}', '**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    }
  }
]
