import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommunityHub from '@/components/community/CommunityHub'

describe('CommunityHub', () => {
  test('renders main community hub elements', () => {
    render(<CommunityHub />)
    
    // Check for main header - using actual text from component
    expect(screen.getByText('קהילת שאלות ותשובות פיננסיות')).toBeInTheDocument()
    
    // Check for description
    expect(screen.getByText('קבל עזרה מהקהילה ומומחים בנושאים פיננסיים בישראל')).toBeInTheDocument()
  })

  test('renders statistics display', () => {
    render(<CommunityHub />)
    
    // Should have statistics section
    expect(screen.getByText('שאלות בקהילה')).toBeInTheDocument()
    expect(screen.getByText('תשובות ניתנו')).toBeInTheDocument()
  })

  test('renders ask question button', () => {
    render(<CommunityHub />)
    
    // Should have ask question button
    expect(screen.getByText('שאל שאלה חדשה')).toBeInTheDocument()
  })

  test('has proper RTL direction', () => {
    render(<CommunityHub />)
    
    const container = document.querySelector('[dir="rtl"]')
    expect(container).toBeInTheDocument()
  })
})
