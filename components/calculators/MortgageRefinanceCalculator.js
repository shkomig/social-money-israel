// This file intentionally re-exports the TSX implementation.
// Some build environments (e.g., Netlify) may resolve the .js file first
// when using extension-less imports. Re-exporting ensures the correct
// client component is used and prevents "Element type is invalid" errors.

export { default } from './MortgageRefinanceCalculator.tsx'
export * from './MortgageRefinanceCalculator.tsx'