import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialListCount } from './MaterialListCount'

describe('MaterialListCount', () => {
  it('renders a plain trailing count value', () => {
    const { container } = render(<MaterialListCount aria-label="2 placed" value={2} />)
    const count = container.querySelector('.material-list-count')

    expect(count).toBeInTheDocument()
    expect(count).toHaveTextContent('2')
    expect(count).not.toHaveClass('material-badge')
  })

  it('formats large values without badge capping', () => {
    const { getByText } = render(<MaterialListCount value={1000} />)

    expect(getByText('1,000')).toBeInTheDocument()
  })

  it('hides zero counts unless explicitly shown', () => {
    const { container, rerender } = render(<MaterialListCount value={0} />)

    expect(container.querySelector('.material-list-count')).not.toBeInTheDocument()

    rerender(<MaterialListCount showZero value={0} />)
    expect(container.querySelector('.material-list-count')).toHaveTextContent('0')
  })
})
