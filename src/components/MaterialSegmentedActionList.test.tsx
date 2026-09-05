import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MaterialSegmentedActionList } from './MaterialSegmentedActionList'

const actions = [
  { id: 'cold', label: 'Cold Island', supportingText: 'Switch island' },
  { id: 'auto', label: 'Turn on Auto arrange', supportingText: 'Planner setting' },
]

describe('MaterialSegmentedActionList', () => {
  it('renders executable options with the active Material state', () => {
    render(
      <MaterialSegmentedActionList
        actions={actions}
        activeId="cold"
        ariaLabel="Commands"
        onAction={() => {}}
      />,
    )

    expect(screen.getByRole('listbox', { name: 'Commands' })).toHaveClass(
      'material-segmented-action-list',
    )
    expect(screen.getByRole('option', { name: 'Cold Island' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('runs the selected action', () => {
    const onAction = vi.fn()
    render(
      <MaterialSegmentedActionList
        actions={actions}
        ariaLabel="Commands"
        onAction={onAction}
      />,
    )

    fireEvent.click(screen.getByRole('option', { name: 'Turn on Auto arrange' }))
    expect(onAction).toHaveBeenCalledWith(actions[1])
  })

  it('provides a roving keyboard tab stop for standalone action lists', () => {
    render(
      <MaterialSegmentedActionList
        actions={[
          actions[0],
          { ...actions[1], disabled: true },
          { id: 'settings', label: 'Settings' },
        ]}
        ariaLabel="Commands"
        onAction={() => {}}
      />,
    )

    const first = screen.getByRole('option', { name: 'Cold Island' })
    const disabled = screen.getByRole('option', { name: 'Turn on Auto arrange' })
    const last = screen.getByRole('option', { name: 'Settings' })

    expect(first).toHaveAttribute('tabindex', '0')
    expect(disabled).toHaveAttribute('tabindex', '-1')
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(last).toHaveFocus()
    fireEvent.keyDown(last, { key: 'ArrowDown' })
    expect(first).toHaveFocus()
  })

  it('renders a real Material switch as a separate trailing action', () => {
    const onChange = vi.fn()
    render(
      <MaterialSegmentedActionList
        actions={[
          {
            ...actions[1],
            trailingSwitch: {
              ariaLabel: 'Turn on Auto arrange',
              checked: false,
              onChange,
            },
          },
        ]}
        ariaLabel="Commands"
        onAction={() => {}}
      />,
    )

    const toggle = screen.getByRole('switch', { name: 'Turn on Auto arrange' })
    const row = toggle.closest('.material-segmented-action-row')
    const option = screen.getByRole('option', { name: 'Turn on Auto arrange' })

    expect(row?.querySelector(':scope > [data-material-ripple]')).toBeInTheDocument()
    expect(option.querySelector('[data-material-ripple]')).not.toBeInTheDocument()

    fireEvent.click(toggle)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('only hands selection to a pointer after it moves', () => {
    const onActionPointerMove = vi.fn()
    render(
      <MaterialSegmentedActionList
        actions={actions}
        ariaLabel="Commands"
        onAction={() => {}}
        onActionPointerMove={onActionPointerMove}
      />,
    )

    const option = screen.getByRole('option', { name: 'Turn on Auto arrange' })
    fireEvent.pointerEnter(option)
    expect(onActionPointerMove).not.toHaveBeenCalled()

    fireEvent.pointerMove(option, { pointerType: 'mouse' })
    expect(onActionPointerMove).toHaveBeenCalledWith(actions[1])
  })
})
