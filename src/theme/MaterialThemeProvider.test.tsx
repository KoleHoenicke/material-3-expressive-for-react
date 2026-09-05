import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialThemeProvider } from './MaterialThemeProvider'

describe('MaterialThemeProvider', () => {
  it('applies generated color variables and expressive motion to its subtree', () => {
    render(
      <MaterialThemeProvider mode="dark" seed={{ primary: '#6750a4' }} data-testid="theme">
        <span>Content</span>
      </MaterialThemeProvider>,
    )

    const theme = screen.getByTestId('theme')
    expect(theme).toHaveClass('material-react-root')
    expect(theme).toHaveAttribute('data-color-scheme', 'dark')
    expect(theme).toHaveAttribute('data-motion-scheme', 'expressive')
    expect(theme.style.getPropertyValue('--md-sys-color-primary')).toMatch(/^#[0-9a-f]{6}$/)
  })
})
