import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import {
  MaterialBaselineExtendedFloatingActionButton,
  MaterialExtendedFloatingActionButton,
  MaterialFloatingActionButton,
  MaterialLargeExtendedFloatingActionButton,
  MaterialLargeFloatingActionButton,
  MaterialMediumExtendedFloatingActionButton,
  MaterialMediumFloatingActionButton,
  MaterialSmallExtendedFloatingActionButton,
  MaterialSmallFloatingActionButton,
} from './MaterialFloatingActionButton'

const icon = <svg data-testid="icon" viewBox="0 0 24 24" />

describe('MaterialFloatingActionButton', () => {
  it('renders the AndroidX regular primary-container defaults on a native button', () => {
    render(
      <MaterialFloatingActionButton aria-label="Create">
        {icon}
      </MaterialFloatingActionButton>,
    )

    const button = screen.getByRole('button', { name: 'Create' })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-color', 'primary-container')
    expect(button).toHaveAttribute('data-elevation', 'default')
    expect(button).toHaveAttribute('data-size', 'regular')
    expect(button).toHaveAttribute('data-visible', 'true')
    expect(button).toHaveAttribute('data-material-fab')
    expect(screen.getByTestId('icon').closest('.material-fab__icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it.each([
    ['small', MaterialSmallFloatingActionButton],
    ['medium', MaterialMediumFloatingActionButton],
    ['large', MaterialLargeFloatingActionButton],
  ] as const)('sets the %s size through the named Android-style component', (size, Fab) => {
    render(<Fab aria-label={`${size} action`}>{icon}</Fab>)

    expect(screen.getByRole('button')).toHaveAttribute('data-size', size)
  })

  it.each([
    'primary-container',
    'secondary-container',
    'tertiary-container',
    'primary',
    'secondary',
    'tertiary',
    'surface',
  ] as const)('supports the %s color mapping', (color) => {
    render(
      <MaterialFloatingActionButton aria-label={`${color} action`} color={color}>
        {icon}
      </MaterialFloatingActionButton>,
    )

    expect(screen.getByRole('button')).toHaveAttribute('data-color', color)
  })

  it('forwards native button behavior, refs, data attributes, and typed token overrides', () => {
    const onClick = vi.fn()
    const ref = createRef<HTMLButtonElement>()

    render(
      <MaterialFloatingActionButton
        ref={ref}
        aria-labelledby="fab-name"
        data-pressed="true"
        elevation="lowered"
        name="create"
        onClick={onClick}
        style={{ '--md-fab-container-shape': '8px' }}
        value="draft"
      >
        {icon}
      </MaterialFloatingActionButton>,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(ref.current).toBe(button)
    expect(onClick).toHaveBeenCalledOnce()
    expect(button).toHaveAttribute('data-elevation', 'lowered')
    expect(button).toHaveAttribute('data-pressed', 'true')
    expect(button).toHaveAttribute('name', 'create')
    expect(button).toHaveAttribute('value', 'draft')
    expect(button).toHaveStyle({ '--md-fab-container-shape': '8px' })
  })

  it('removes a hidden FAB from pointer, keyboard, and accessibility interaction', () => {
    render(
      <MaterialFloatingActionButton
        aria-label="Create"
        tabIndex={3}
        visible={false}
        visibilityAlignment="bottom-end"
      >
        {icon}
      </MaterialFloatingActionButton>,
    )

    const button = screen.getByLabelText('Create', { selector: 'button' })

    expect(button).toHaveAttribute('aria-hidden', 'true')
    expect(button).toHaveAttribute('data-visible', 'false')
    expect(button).toHaveAttribute('data-visibility-alignment', 'bottom-end')
    expect(button).toHaveAttribute('tabindex', '-1')
    expect(button.querySelector('.material-ripple')).toHaveAttribute(
      'data-material-ripple-disabled',
      'true',
    )
  })

  it('uses native disabled behavior', () => {
    const onClick = vi.fn()

    render(
      <MaterialFloatingActionButton aria-label="Create" disabled onClick={onClick}>
        {icon}
      </MaterialFloatingActionButton>,
    )

    const button = screen.getByRole('button', { name: 'Create' })
    fireEvent.click(button)

    expect(button).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('MaterialExtendedFloatingActionButton', () => {
  it('defaults to the current Expressive small extended FAB', () => {
    render(
      <MaterialExtendedFloatingActionButton icon={icon} label="Create" />,
    )

    const button = screen.getByRole('button', { name: 'Create' })

    expect(button).toHaveAttribute('data-material-extended-fab')
    expect(button).toHaveAttribute('data-size', 'small')
    expect(button).toHaveAttribute('data-expanded', 'true')
    expect(button.querySelector('.material-fab__label')).toHaveTextContent('Create')
  })

  it('keeps the label as the accessible name when visually collapsed', () => {
    render(
      <MaterialExtendedFloatingActionButton
        expanded={false}
        icon={icon}
        label="Compose a new message"
      />,
    )

    const button = screen.getByRole('button', { name: 'Compose a new message' })

    expect(button).toHaveAttribute('data-expanded', 'false')
    expect(button.querySelector('.material-fab__label')).not.toHaveAttribute(
      'aria-hidden',
    )
  })

  it('does not collapse a label-only FAB to an empty visual control', () => {
    render(
      <MaterialExtendedFloatingActionButton expanded={false} label="Reroute" />,
    )

    expect(screen.getByRole('button', { name: 'Reroute' })).toHaveAttribute(
      'data-expanded',
      'true',
    )
  })

  it.each([
    ['baseline', MaterialBaselineExtendedFloatingActionButton],
    ['small', MaterialSmallExtendedFloatingActionButton],
    ['medium', MaterialMediumExtendedFloatingActionButton],
    ['large', MaterialLargeExtendedFloatingActionButton],
  ] as const)('sets the %s extended size through the named component', (size, Fab) => {
    render(<Fab icon={icon} label={`${size} action`} />)

    expect(screen.getByRole('button')).toHaveAttribute('data-size', size)
  })
})
