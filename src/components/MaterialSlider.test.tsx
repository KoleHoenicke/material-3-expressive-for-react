import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialSlider } from './MaterialSlider'

describe('MaterialSlider', () => {
  it('renders centered tracks as split segments and skips the origin stop', () => {
    const { container } = render(
      <MaterialSlider
        aria-label="Adjust crop"
        min={-100}
        max={100}
        value={40}
        origin={0}
        stops={[-100, 0, 100]}
        onChange={() => {}}
      />,
    )

    expect(container.querySelector('.material-slider--centered-positive')).toBeInTheDocument()
    expect(container.querySelectorAll('.material-slider__track-inactive')).toHaveLength(2)
    expect(container.querySelectorAll('.material-slider__track-active')).toHaveLength(1)

    const renderedStops = container.querySelectorAll<HTMLElement>('.material-slider__stop')

    expect(renderedStops).toHaveLength(2)
    expect(Array.from(renderedStops, (stop) => stop.style.getPropertyValue('--material-slider-stop-position'))).toEqual([
      '0%',
      '100%',
    ])
  })

  it('updates drag styling and progress without a React render', () => {
    const { container, getByRole } = render(
      <MaterialSlider aria-label="Happiness" min={0} max={100} step={100} value={0} />,
    )
    const root = container.querySelector<HTMLElement>('.material-slider')
    const input = getByRole('slider', { name: 'Happiness' })

    fireEvent.pointerDown(input, { clientX: 0, clientY: 0, pointerId: 1 })
    fireEvent.pointerMove(input, { clientX: 4, clientY: 0, pointerId: 1 })
    expect(root).toHaveClass('material-slider--dragging')

    fireEvent.input(input, { target: { value: '100' } })
    expect(root?.style.getPropertyValue('--material-slider-progress')).toBe('100%')

    fireEvent.pointerUp(input, { pointerId: 1 })
    expect(root).not.toHaveClass('material-slider--dragging')
  })
})
