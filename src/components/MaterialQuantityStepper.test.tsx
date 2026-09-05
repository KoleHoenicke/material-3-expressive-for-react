import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MaterialQuantityStepper } from './MaterialQuantityStepper'

describe('MaterialQuantityStepper', () => {
  it('renders a grouped numeric value with Material icon buttons', () => {
    render(
      <MaterialQuantityStepper
        decrementIcon={<span>-</span>}
        incrementIcon={<span>+</span>}
        label="Bakery count"
        max={5}
        value={2}
        onChange={() => {}}
      />,
    )

    const stepper = screen.getByRole('group', { name: 'Bakery count' })

    expect(stepper).toHaveClass('material-quantity-stepper')
    expect(stepper).toHaveAttribute('data-has-decrement', 'true')
    expect(stepper).toHaveAttribute('data-has-increment', 'true')
    expect(screen.getByRole('textbox', { name: 'Bakery count value' })).toHaveClass(
      'material-quantity-stepper__value',
    )
    expect(screen.getByRole('textbox', { name: 'Bakery count value' })).toHaveValue('2')
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('clamps button actions to the configured range', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <MaterialQuantityStepper
        decrementIcon={<span>-</span>}
        incrementIcon={<span>+</span>}
        label="Torch count"
        max={10}
        value={0}
        onChange={onChange}
      />,
    )

    expect(screen.getByRole('button', { name: 'Decrease Torch count' })).toBeDisabled()
    expect(screen.getByRole('group', { name: 'Torch count' })).toHaveAttribute(
      'data-has-decrement',
      'false',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Increase Torch count' }))
    expect(onChange).toHaveBeenCalledWith(1)

    rerender(
      <MaterialQuantityStepper
        decrementIcon={<span>-</span>}
        incrementIcon={<span>+</span>}
        label="Torch count"
        max={10}
        value={10}
        onChange={onChange}
      />,
    )

    expect(screen.getByRole('button', { name: 'Increase Torch count' })).toBeDisabled()
    expect(screen.getByRole('group', { name: 'Torch count' })).toHaveAttribute(
      'data-has-increment',
      'false',
    )
  })

  it('keeps range segments visible when the whole control is disabled between limits', () => {
    render(
      <MaterialQuantityStepper
        decrementIcon={<span>-</span>}
        disabled
        incrementIcon={<span>+</span>}
        label="Nursery count"
        max={5}
        value={2}
        onChange={() => {}}
      />,
    )

    const stepper = screen.getByRole('group', { name: 'Nursery count' })

    expect(stepper).toHaveAttribute('data-has-decrement', 'true')
    expect(stepper).toHaveAttribute('data-has-increment', 'true')
    expect(screen.getByRole('button', { name: 'Decrease Nursery count' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase Nursery count' })).toBeDisabled()
  })

  it('commits typed values and clamps to the configured range', () => {
    const onChange = vi.fn()

    function ControlledStepper() {
      const [quantity, setQuantity] = useState(0)

      return (
        <MaterialQuantityStepper
          decrementIcon={<span>-</span>}
          incrementIcon={<span>+</span>}
          label="Bakery count"
          max={5}
          value={quantity}
          onChange={(nextQuantity) => {
            onChange(nextQuantity)
            setQuantity(nextQuantity)
          }}
        />
      )
    }

    render(<ControlledStepper />)

    const valueInput = screen.getByRole('textbox', { name: 'Bakery count value' })
    fireEvent.focus(valueInput)
    fireEvent.change(valueInput, { target: { value: '9' } })

    expect(onChange).toHaveBeenCalledWith(5)
    expect(valueInput).toHaveValue('5')
  })
})
