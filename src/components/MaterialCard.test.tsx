import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MaterialCard } from './MaterialCard'

describe('MaterialCard', () => {
  it('renders a passive filled container without action semantics or a ripple', () => {
    render(<MaterialCard as="article">Forecast</MaterialCard>)

    const card = screen.getByText('Forecast').closest('[data-material-card]')
    expect(card).toHaveProperty('tagName', 'ARTICLE')
    expect(card).toHaveAttribute('data-variant', 'filled')
    expect(card).not.toHaveAttribute('data-interactive')
    expect(card?.querySelector('[data-material-ripple]')).not.toBeInTheDocument()
  })

  it('uses a native button and full-card ripple for an action', () => {
    const onClick = vi.fn()
    render(<MaterialCard onClick={onClick}>Open forecast</MaterialCard>)

    const card = screen.getByRole('button', { name: 'Open forecast' })
    fireEvent.click(card)

    expect(card).toHaveAttribute('type', 'button')
    expect(card).toHaveAttribute('data-interactive', 'true')
    expect(card.querySelector('[data-material-ripple]')).toBeInTheDocument()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('uses native link semantics and removes a disabled link from navigation', () => {
    const { rerender } = render(
      <MaterialCard href="/details" target="_blank">
        Trip details
      </MaterialCard>,
    )

    const card = screen.getByRole('link', { name: 'Trip details' })
    expect(card).toHaveAttribute('href', '/details')
    expect(card).toHaveAttribute('target', '_blank')

    rerender(
      <MaterialCard href="/details" disabled>
        Trip details
      </MaterialCard>,
    )

    const disabledCard = screen.getByText('Trip details').closest('a')
    expect(disabledCard).not.toHaveAttribute('href')
    expect(disabledCard).toHaveAttribute('aria-disabled', 'true')
    expect(disabledCard).toHaveAttribute('tabindex', '-1')
  })

  it('exposes a controlled Android-style checked state', () => {
    const onCheckedChange = vi.fn()
    render(
      <MaterialCard
        checkable
        checked
        checkedIcon={<span data-testid="selection-mark">Selected</span>}
        checkedIconPosition="bottom-start"
        onCheckedChange={onCheckedChange}
      >
        Select report
      </MaterialCard>,
    )

    const card = screen.getByRole('button', { name: 'Select report' })
    fireEvent.click(card)

    expect(card).toHaveAttribute('aria-pressed', 'true')
    expect(card).toHaveAttribute('data-checked', 'true')
    expect(screen.getByTestId('selection-mark').parentElement).toHaveAttribute(
      'data-position',
      'bottom-start',
    )
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  it('uses aria-checked for explicit checkbox and radio roles', () => {
    render(
      <MaterialCard role="checkbox" checkable checked>
        Include photos
      </MaterialCard>,
    )

    const card = screen.getByRole('checkbox', { name: 'Include photos' })
    expect(card).toHaveAttribute('aria-checked', 'true')
    expect(card).not.toHaveAttribute('aria-pressed')
  })

  it('does not activate or change a disabled checkable card', () => {
    const onClick = vi.fn()
    const onCheckedChange = vi.fn()
    render(
      <MaterialCard checkable disabled onClick={onClick} onCheckedChange={onCheckedChange}>
        Select report
      </MaterialCard>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Select report' }))

    expect(onClick).not.toHaveBeenCalled()
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('forwards drag lifecycle changes while keeping dragged state controlled', () => {
    const onDraggedChange = vi.fn()
    const { rerender } = render(
      <MaterialCard draggable onDraggedChange={onDraggedChange}>
        Move report
      </MaterialCard>,
    )

    const card = screen.getByText('Move report').closest('[data-material-card]') as HTMLElement
    fireEvent.dragStart(card)
    fireEvent.dragEnd(card)
    expect(onDraggedChange).toHaveBeenNthCalledWith(1, true)
    expect(onDraggedChange).toHaveBeenNthCalledWith(2, false)

    rerender(
      <MaterialCard draggable dragged onDraggedChange={onDraggedChange}>
        Move report
      </MaterialCard>,
    )
    expect(card).toHaveAttribute('data-dragged', 'true')
  })

  it('supports spec padding and forwards the root ref', () => {
    const ref = createRef<HTMLElement>()
    render(
      <MaterialCard
        ref={ref}
        contentPadding={16}
        style={{ '--md-card-container-shape': '24px' }}
        variant="outlined"
      >
        Padded card
      </MaterialCard>,
    )

    const card = screen.getByText('Padded card').closest('[data-material-card]')
    expect(card).toHaveStyle({
      '--md-card-container-shape': '24px',
      '--md-card-content-padding': '16px',
    })
    expect(card).toHaveAttribute('data-variant', 'outlined')
    expect(ref.current).toBe(card)
  })
})
