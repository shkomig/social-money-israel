export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Allow Tailwind/V4 at-rules like @theme & @import "tailwindcss"
    'at-rule-no-unknown': null,
    // Allow string import notation for Tailwind
    'import-notation': null,
  },
  ignoreFiles: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
}
