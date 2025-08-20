import React from 'react'
import { render, screen } from '@testing-library/react'

test('early repayment placeholder test', () => {
  // simple smoke assertion; component tests are handled in other suites
  render(<div>early repayment</div>)
  expect(screen.getByText(/early repayment/)).toBeInTheDocument()
})
