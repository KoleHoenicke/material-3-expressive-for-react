import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MaterialList, MaterialListItem } from './MaterialList'
import { MaterialListSwipeActions } from './MaterialListSwipeActions'

describe('MaterialListSwipeActions', () => {
  it('provides an accessible non-swipe trigger and controlled action visibility', () => {
    const onRevealedChange = vi.fn()
    const { container, rerender } = render(
      <MaterialList>
        <MaterialListSwipeActions
          actions={<button type="button">Archive</button>}
          actionsLabel="Message actions"
          onRevealedChange={onRevealedChange}
          revealed={false}
        >
          <MaterialListItem headline="Message from Avery" onClick={() => {}} />
        </MaterialListSwipeActions>
      </MaterialList>,
    )

    expect(container.querySelector('[data-material-list-swipe-actions]')).toHaveAttribute('inert')
    fireEvent.click(screen.getByRole('button', { name: 'Show actions' }))
    expect(onRevealedChange).toHaveBeenCalledWith(true)

    rerender(
      <MaterialList>
        <MaterialListSwipeActions
          actions={<button type="button">Archive</button>}
          actionsLabel="Message actions"
          onRevealedChange={onRevealedChange}
          revealed
        >
          <MaterialListItem headline="Message from Avery" onClick={() => {}} />
        </MaterialListSwipeActions>
      </MaterialList>,
    )

    expect(screen.getByRole('group', { name: 'Message actions' })).not.toHaveAttribute('inert')
    fireEvent.click(screen.getByRole('button', { name: 'Hide actions' }))
    expect(onRevealedChange).toHaveBeenLastCalledWith(false)
  })

  it('snaps open after a pointer gesture crosses the threshold', () => {
    const onRevealedChange = vi.fn()
    const { container } = render(
      <MaterialList>
        <MaterialListSwipeActions
          actions={<button type="button">Archive</button>}
          actionsLabel="Message actions"
          onRevealedChange={onRevealedChange}
          revealDistance={120}
          revealed={false}
        >
          <MaterialListItem headline="Swipe me" onClick={() => {}} />
        </MaterialListSwipeActions>
      </MaterialList>,
    )

    const swipe = container.querySelector('[data-material-list-swipe]') as HTMLElement
    swipe.setPointerCapture = vi.fn()
    fireEvent.pointerDown(swipe, {
      button: 0,
      clientX: 100,
      clientY: 20,
      isPrimary: true,
      pointerId: 7,
    })
    fireEvent.pointerMove(swipe, { clientX: 40, clientY: 22, pointerId: 7 })
    fireEvent.pointerUp(swipe, { pointerId: 7 })
    expect(onRevealedChange).toHaveBeenCalledWith(true)
  })
})
