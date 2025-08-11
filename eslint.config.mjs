import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/build/**'] },
  js.configs.recommended,
  // TypeScript ESLint recommended (no type-aware rules to simplify setup)
  ...tseslint.configs.recommended,
]
