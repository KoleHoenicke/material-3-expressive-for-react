import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import {
  MaterialDivider,
  MaterialHorizontalDivider,
  MaterialVerticalDivider,
} from './MaterialDivider'

const componentCss = readFileSync(
  resolve(process.cwd(), 'src/components/MaterialDivider.css'),
  'utf8',
)

describe('MaterialDivider', () => {
  it('renders the regular horizontal Material divider by default', () => {
    const { container } = render(<MaterialDivider data-testid="divider" />)
    const divider = screen.getByTestId('divider')

    expect(divider).toHaveClass('material-divider')
    expect(divider).toHaveAttribute('data-material-divider', '')
    expect(divider).toHaveAttribute('data-orientation', 'horizontal')
    expect(divider).toHaveAttribute('data-variant', 'regular')
    expect(container.querySelector('[role="separator"]')).not.toBeInTheDocument()
  })

  it('adds separator semantics only when requested', () => {
    const { rerender } = render(
      <MaterialDivider aria-label="End of navigation" role="separator" />,
    )

    expect(screen.getByRole('separator', { name: 'End of navigation' })).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    )

    rerender(
      <MaterialDivider
        aria-label="End of navigation"
        orientation="vertical"
        role="separator"
      />,
    )
    expect(screen.getByRole('separator', { name: 'End of navigation' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    )
  })

  it('supports symmetric, one-sided, and custom logical insets', () => {
    const { rerender } = render(<MaterialDivider data-testid="divider" inset />)
    const divider = screen.getByTestId('divider')

    expect(divider).toHaveStyle({
      '--md-divider-inset-end': 'var(--md-divider-inset-size, 16px)',
      '--md-divider-inset-start': 'var(--md-divider-inset-size, 16px)',
    })

    rerender(
      <MaterialDivider
        data-testid="divider"
        inset
        insetEnd={false}
        insetStart={24}
      />,
    )
    expect(divider).toHaveStyle({
      '--md-divider-inset-end': '0px',
      '--md-divider-inset-start': '24px',
    })
  })

  it('maps component props and public CSS properties without losing consumer styles', () => {
    render(
      <MaterialDivider
        color="rgb(12, 34, 56)"
        data-testid="divider"
        style={{ '--md-divider-inset-size': '20px', opacity: 0.5 }}
        thickness={3}
      />,
    )

    expect(screen.getByTestId('divider')).toHaveStyle({
      '--md-divider-color': 'rgb(12, 34, 56)',
      '--md-divider-inset-size': '20px',
      '--md-divider-thickness': '3px',
      opacity: '0.5',
    })
  })

  it('offers Android-style horizontal and vertical component names', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(
      <>
        <MaterialHorizontalDivider className="horizontal" variant="heavy" />
        <MaterialVerticalDivider className="vertical" ref={ref} />
      </>,
    )

    expect(container.querySelector('.horizontal')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    )
    expect(container.querySelector('.horizontal')).toHaveAttribute('data-variant', 'heavy')
    expect(ref.current).toHaveAttribute('data-orientation', 'vertical')
  })

  it('pins the current Material geometry, color role, and forced-color behavior', () => {
    expect(componentCss).toContain('--md-divider-color: var(--md-sys-color-outline-variant)')
    expect(componentCss).toContain('--md-divider-thickness: 1px')
    expect(componentCss).toContain('--md-divider-heavy-thickness: 8px')
    expect(componentCss).toContain('--md-divider-inset-size: 16px')
    expect(componentCss).toMatch(
      /\[data-orientation='vertical'\][^{]*\{[^}]*padding-block-start:[^}]*padding-block-end:/s,
    )
    expect(componentCss).toMatch(/@media \(forced-colors: active\)[\s\S]*CanvasText/)
  })
})
