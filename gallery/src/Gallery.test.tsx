import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Gallery } from './Gallery'

describe('interactive gallery', () => {
  it('renders the full public component surface', () => {
    render(<Gallery />)

    const apiLabels = [
      'Button',
      'ButtonGroup',
      'FloatingActionButton · ExtendedFloatingActionButton',
      'FloatingActionButtonMenu · FloatingActionButtonMenuItem · ToggleFloatingActionButton',
      'Card',
      'Checkbox · CheckboxList · CheckboxListItem',
      'AssistChip · FilterChip · InputChip · SuggestionChip',
      'Ripple',
      'Switch',
      'Slider',
      'RichOptionList',
      'SegmentedActionList',
      'Badge · ListCount',
      'QuantityStepper',
      'LinearProgressIndicator · CircularProgressIndicator',
      'LoadingIndicator',
      'ListTrailingAction',
    ]

    for (const label of apiLabels) {
      expect(screen.getByText(label, { selector: 'code' })).toBeInTheDocument()
    }
  })

  it('updates the theme and live component values', () => {
    const { container } = render(<Gallery />)
    const root = container.querySelector('.material-react-root')

    expect(root).toHaveAttribute('data-color-scheme', 'light')
    expect(root).toHaveAttribute('data-motion-scheme', 'expressive')
    fireEvent.click(screen.getByRole('switch', { name: 'Use dark theme' }))
    expect(root).toHaveAttribute('data-color-scheme', 'dark')
    fireEvent.click(screen.getByRole('switch', { name: 'Use expressive motion' }))
    expect(root).toHaveAttribute('data-motion-scheme', 'standard')

    fireEvent.click(screen.getByRole('button', { name: 'Increase Guests' }))
    expect(screen.getByRole('textbox', { name: 'Guests value' })).toHaveValue('4')

    fireEvent.click(screen.getByRole('switch', { name: 'Expand extended FAB' }))
    expect(screen.getByRole('button', { name: 'Compose' })).toHaveAttribute(
      'data-expanded',
      'false',
    )

    fireEvent.click(screen.getByRole('switch', { name: 'Expand FAB menu' }))
    expect(screen.getByRole('button', { name: 'Toggle create actions' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
