import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialText } from './MaterialText'

describe('MaterialText', () => {
  it('uses the body large role by default without imposing heading semantics', () => {
    render(<MaterialText>Readable body copy</MaterialText>)

    const text = screen.getByText('Readable body copy')
    expect(text.tagName).toBe('SPAN')
    expect(text).toHaveClass('material-text')
    expect(text).toHaveAttribute('data-material-typography', 'bodyLarge')
    expect(text.style.getPropertyValue('--md-text-size')).toBe(
      'var(--md-sys-typescale-body-large-size)',
    )
  })

  it('keeps semantic HTML independent from the visual role', () => {
    render(
      <MaterialText as="h2" id="section-title" variant="displaySmall">
        Library
      </MaterialText>,
    )

    const heading = screen.getByRole('heading', { level: 2, name: 'Library' })
    expect(heading).toHaveAttribute('id', 'section-title')
    expect(heading).toHaveAttribute('data-material-typography', 'displaySmall')
  })

  it('selects the Expressive emphasized counterpart from a baseline role', () => {
    render(
      <MaterialText emphasized variant="titleMedium">
        Important title
      </MaterialText>,
    )

    const text = screen.getByText('Important title')
    expect(text).toHaveAttribute('data-material-typography', 'titleMediumEmphasized')
    expect(text.style.getPropertyValue('--md-text-weight')).toBe(
      'var(--md-sys-typescale-title-medium-emphasized-weight)',
    )
  })

  it('accepts an emphasized role directly without duplicating its suffix', () => {
    render(
      <MaterialText emphasized variant="labelLargeEmphasized">
        Save
      </MaterialText>,
    )

    expect(screen.getByText('Save')).toHaveAttribute(
      'data-material-typography',
      'labelLargeEmphasized',
    )
  })

  it('passes native attributes and applies explicit text overrides last', () => {
    render(
      <MaterialText
        as="p"
        aria-describedby="details"
        color="rebeccapurple"
        fontSize="18px"
        fontVariationSettings="'wght' 620"
        style={{ letterSpacing: '1px' }}
      >
        Configurable text
      </MaterialText>,
    )

    const text = screen.getByText('Configurable text')
    expect(text).toHaveAttribute('aria-describedby', 'details')
    expect(text.style.color).toBe('rebeccapurple')
    expect(text.style.fontSize).toBe('18px')
    expect(text.style.fontVariationSettings).toBe("'wght' 620")
    expect(text.style.letterSpacing).toBe('1px')
  })

  it('normalizes line limits and exposes wrapping and overflow behavior to CSS', () => {
    const { rerender } = render(
      <MaterialText maxLines={2.8} minLines={4} overflow="ellipsis" softWrap={false}>
        Limited copy
      </MaterialText>,
    )

    const text = screen.getByText('Limited copy')
    expect(text).toHaveAttribute('data-max-lines', '2')
    expect(text).toHaveAttribute('data-min-lines', '2')
    expect(text).toHaveAttribute('data-overflow', 'ellipsis')
    expect(text).toHaveAttribute('data-soft-wrap', 'false')
    expect(text.style.getPropertyValue('--md-text-max-lines')).toBe('2')
    expect(text.style.minBlockSize).toBe('2lh')

    rerender(<MaterialText maxLines={Number.NaN}>Unlimited copy</MaterialText>)
    expect(screen.getByText('Unlimited copy')).not.toHaveAttribute('data-max-lines')
  })

  it('maps every baseline and emphasized data role to the complete text properties', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/components/MaterialText.css'), 'utf8')

    expect(css.match(/\[data-material-typography='[^']+'\] \{/g)).toHaveLength(30)
    expect(css).toContain("[data-material-typography='bodyLargeEmphasized']")
    expect(css).toContain('--md-text-features: var(--md-sys-typescale-body-large-emphasized-font-feature-settings, normal)')
    expect(css).toContain('--md-text-variations: var(--md-sys-typescale-body-large-emphasized-font-variation-settings, normal)')
  })
})
