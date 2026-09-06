import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MaterialCheckbox } from './MaterialCheckbox'

describe('MaterialCheckbox', () => {
  it('uses native checkbox semantics and forwards form attributes', () => {
    const onChange = vi.fn()
    render(
      <MaterialCheckbox
        aria-label="Save filters"
        name="filters"
        required
        value="saved"
        onChange={onChange}
      />,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Save filters' })

    expect(checkbox).toHaveAttribute('name', 'filters')
    expect(checkbox).toHaveAttribute('value', 'saved')
    expect(checkbox).toBeRequired()
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('synchronizes the native mixed state and resolves it to checked on activation', () => {
    function MixedCheckbox() {
      const [checked, setChecked] = useState(false)
      const [indeterminate, setIndeterminate] = useState(true)

      return (
        <MaterialCheckbox
          aria-label="Select all"
          checked={checked}
          indeterminate={indeterminate}
          onChange={(event) => {
            setChecked(event.currentTarget.checked)
            setIndeterminate(false)
          }}
        />
      )
    }

    render(<MixedCheckbox />)
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement

    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    fireEvent.click(checkbox)
    expect(checkbox.indeterminate).toBe(false)
    expect(checkbox).toBeChecked()
  })

  it('exposes error state to styling and accessibility', () => {
    const { container } = render(<MaterialCheckbox aria-label="Terms" error />)

    expect(screen.getByRole('checkbox', { name: 'Terms' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(container.querySelector('.material-checkbox')).toHaveClass(
      'material-checkbox--error',
    )
  })

  it('forwards refs and public CSS properties', () => {
    const ref = createRef<HTMLInputElement>()
    const { container } = render(
      <MaterialCheckbox
        ref={ref}
        aria-label="Custom checkbox"
        style={{ '--md-checkbox-container-shape': '0px' }}
      />,
    )

    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Custom checkbox' }))
    expect(container.querySelector('.material-checkbox')).toHaveStyle(
      '--md-checkbox-container-shape: 0px',
    )
    const styles = getComputedStyle(container.querySelector('.material-checkbox') as Element)
    expect(styles.getPropertyValue('--md-checkbox-container-size')).toBe('18px')
    expect(styles.getPropertyValue('--md-checkbox-state-layer-size')).toBe('40px')
    expect(styles.getPropertyValue('--md-checkbox-touch-target-size')).toBe('48px')
    expect(styles.getPropertyValue('--md-checkbox-outline-width')).toBe('2px')
  })

  it('disables both the input and its state layer', () => {
    const { container } = render(<MaterialCheckbox aria-label="Unavailable" disabled />)

    expect(screen.getByRole('checkbox', { name: 'Unavailable' })).toBeDisabled()
    expect(container.querySelector('[data-material-ripple]')).toHaveAttribute(
      'data-material-ripple-disabled',
      'true',
    )
  })
})
