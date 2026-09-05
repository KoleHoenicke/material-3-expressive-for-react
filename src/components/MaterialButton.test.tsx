import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialButton } from './MaterialButton'

describe('MaterialButton', () => {
  it('uses the small filled button configuration by default', () => {
    render(<MaterialButton>Save</MaterialButton>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('data-size', 'small')
    expect(button).toHaveAttribute('data-shape', 'round')
    expect(button).toHaveAttribute('data-variant', 'filled')
    expect(button).not.toHaveAttribute('aria-pressed')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('exposes toggle selection through native button semantics', () => {
    render(
      <MaterialButton selected toggle variant="tonal">
        Favorite
      </MaterialButton>,
    )

    const button = screen.getByRole('button', { name: 'Favorite' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-selected', 'true')
    expect(button).toHaveClass('material-button--selected', 'material-button--toggle')
  })

  it('uses radio semantics when composed into a single-select group', () => {
    render(
      <MaterialButton role="radio" selected toggle>
        Board
      </MaterialButton>,
    )

    const button = screen.getByRole('radio', { name: 'Board' })
    expect(button).toHaveAttribute('aria-checked', 'true')
    expect(button).not.toHaveAttribute('aria-pressed')
  })
})
