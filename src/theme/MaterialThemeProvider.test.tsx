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

  it('can apply the standard motion scheme without changing component APIs', () => {
    render(
      <MaterialThemeProvider
        motionScheme="standard"
        seed={{ primary: '#6750a4' }}
        data-testid="standard-theme"
      >
        <span>Content</span>
      </MaterialThemeProvider>,
    )

    expect(screen.getByTestId('standard-theme')).toHaveAttribute(
      'data-motion-scheme',
      'standard',
    )
  })

  it('applies configurable typography without changing the color theme', () => {
    render(
      <MaterialThemeProvider
        seed={{ primary: '#6750a4' }}
        typography={{
          brandFontFamily: 'Example Display',
          plainFontFamily: 'Example Text',
          weights: { medium: 550 },
          styles: { bodyLarge: { letterSpacing: '0.75px' } },
        }}
        data-testid="typography-theme"
      >
        <span>Content</span>
      </MaterialThemeProvider>,
    )

    const theme = screen.getByTestId('typography-theme')
    expect(theme.style.getPropertyValue('--md-ref-typeface-brand')).toBe('Example Display')
    expect(theme.style.getPropertyValue('--md-ref-typeface-plain')).toBe('Example Text')
    expect(theme.style.getPropertyValue('--md-ref-typeface-weight-medium')).toBe('550')
    expect(theme.style.getPropertyValue('--md-sys-typescale-body-large-tracking')).toBe(
      '0.75px',
    )
  })
})
