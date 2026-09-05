import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  MaterialListSelectionIcon,
  MaterialListTrailingAction,
} from './MaterialListTrailingAction'

describe('MaterialListTrailingAction', () => {
  it('renders a standard icon button by default', () => {
    const { getByRole } = render(
      <MaterialListTrailingAction aria-label="Open options">
        <span>more_vert</span>
      </MaterialListTrailingAction>,
    )
    const button = getByRole('button', { name: 'Open options' })

    expect(button).toHaveClass('material-list-trailing-action')
    expect(button).toHaveClass('material-list-trailing-action--standard')
    expect(button).toHaveAttribute('data-material-list-trailing-action-variant', 'standard')
    expect(button).not.toHaveClass('material-list-trailing-action--filled-tonal')
  })

  it('exposes active and tonal state without changing semantics', () => {
    const { getByRole } = render(
      <MaterialListTrailingAction active aria-label="Choose skin" variant="filled-tonal">
        <span>palette</span>
      </MaterialListTrailingAction>,
    )
    const button = getByRole('button', { name: 'Choose skin' })

    expect(button).toHaveClass('material-list-trailing-action--active')
    expect(button).toHaveClass('material-list-trailing-action--filled-tonal')
    expect(button).toHaveAttribute('data-material-list-trailing-action-active', 'true')
  })
})

describe('MaterialListSelectionIcon', () => {
  it('renders a non-interactive trailing selection icon', () => {
    const { container } = render(
      <MaterialListSelectionIcon>
        <span>check</span>
      </MaterialListSelectionIcon>,
    )
    const icon = container.querySelector('.material-list-selection-icon')

    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })
})
