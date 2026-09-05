import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialSwitch } from './MaterialSwitch'

describe('MaterialSwitch', () => {
  it('keeps legacy settings switch internals out of the Material primitive', () => {
    const { container } = render(<MaterialSwitch aria-label="Sound effects" defaultChecked />)

    expect(container.querySelector('.material-switch')).toBeInTheDocument()
    expect(container.querySelector('.material-switch__track')).toBeInTheDocument()
    expect(container.querySelector('.material-switch__handle')).toBeInTheDocument()
    expect(container.querySelector('.settings-toggle__switch')).not.toBeInTheDocument()
    expect(container.querySelector('.settings-toggle__track')).not.toBeInTheDocument()
    expect(container.querySelector('.settings-toggle__thumb')).not.toBeInTheDocument()
  })

  it('can render a custom selected icon in the handle', () => {
    const { getByTestId } = render(
      <MaterialSwitch
        aria-label="Auto"
        defaultChecked
        selectedIcon={<span data-testid="auto-icon" />}
      />,
    )

    expect(getByTestId('auto-icon').closest('.material-switch__icon--on')).toBeInTheDocument()
  })
})
