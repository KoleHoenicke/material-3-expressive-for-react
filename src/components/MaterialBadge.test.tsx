import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialBadge } from './MaterialBadge'

describe('MaterialBadge', () => {
  it('renders the large count badge by default', () => {
    const { container } = render(<MaterialBadge aria-label="7 placed" value={7} />)
    const badge = container.querySelector('.material-badge')

    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('material-badge--large')
    expect(badge).toHaveClass('material-badge--tone-error')
    expect(badge).toHaveTextContent('7')
  })

  it('caps numeric counts to the Material max label length', () => {
    const { getByText } = render(<MaterialBadge value={1000} />)

    expect(getByText('999+')).toBeInTheDocument()
  })

  it('hides zero counts unless explicitly shown', () => {
    const { container, rerender } = render(<MaterialBadge value={0} />)

    expect(container.querySelector('.material-badge')).not.toBeInTheDocument()

    rerender(<MaterialBadge showZero value={0} />)
    expect(container.querySelector('.material-badge')).toHaveTextContent('0')
  })

  it('renders the small dot variant without label text', () => {
    const { container } = render(<MaterialBadge aria-label="New activity" variant="small" />)
    const badge = container.querySelector('.material-badge')

    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('material-badge--small')
    expect(badge).toHaveTextContent('')
  })
})
