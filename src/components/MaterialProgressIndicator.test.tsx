import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  MaterialCircularProgressIndicator,
  MaterialCircularWavyProgressIndicator,
  MaterialLinearProgressIndicator,
  MaterialLinearWavyProgressIndicator,
} from './MaterialProgressIndicator'
import { MaterialWavyProgress } from './MaterialWavyProgress'

describe('Material progress indicators', () => {
  it('exposes determinate values with the caller-provided range', () => {
    render(
      <MaterialLinearProgressIndicator
        aria-valuetext="Half of the files"
        label="Upload"
        max={50}
        value={25}
      />,
    )

    const indicator = screen.getByRole('progressbar', { name: 'Upload' })
    expect(indicator).toHaveAttribute('aria-valuemin', '0')
    expect(indicator).toHaveAttribute('aria-valuemax', '50')
    expect(indicator).toHaveAttribute('aria-valuenow', '25')
    expect(indicator).toHaveAttribute('aria-valuetext', 'Half of the files')
    expect(indicator).not.toHaveAttribute('data-indeterminate')
  })

  it('omits value semantics for indeterminate progress', () => {
    render(<MaterialCircularProgressIndicator label="Connecting" />)

    const indicator = screen.getByRole('progressbar', { name: 'Connecting' })
    expect(indicator).toHaveAttribute('data-indeterminate', 'true')
    expect(indicator).not.toHaveAttribute('aria-valuenow')
    expect(indicator).not.toHaveAttribute('aria-valuemin')
    expect(indicator).not.toHaveAttribute('aria-valuemax')
  })

  it('clamps invalid and overflowing values', () => {
    const { rerender } = render(
      <MaterialLinearProgressIndicator label="Export" max={100} value={Number.NaN} />,
    )
    expect(screen.getByRole('progressbar', { name: 'Export' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    )

    rerender(<MaterialLinearProgressIndicator label="Export" max={100} value={140} />)
    expect(screen.getByRole('progressbar', { name: 'Export' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    )
  })

  it('renders every AndroidX standard and expressive shape', () => {
    const { container } = render(
      <>
        <MaterialLinearProgressIndicator label="Linear determinate" value={0.4} />
        <MaterialLinearProgressIndicator label="Linear indeterminate" />
        <MaterialCircularProgressIndicator label="Circular determinate" value={0.4} />
        <MaterialCircularProgressIndicator label="Circular indeterminate" />
        <MaterialLinearWavyProgressIndicator label="Linear wavy determinate" value={0.4} />
        <MaterialLinearWavyProgressIndicator label="Linear wavy indeterminate" />
        <MaterialCircularWavyProgressIndicator label="Circular wavy determinate" value={0.4} />
        <MaterialCircularWavyProgressIndicator label="Circular wavy indeterminate" />
      </>,
    )

    expect(screen.getAllByRole('progressbar')).toHaveLength(8)
    expect(container.querySelectorAll('.material-linear-progress')).toHaveLength(2)
    expect(container.querySelectorAll('.material-circular-progress')).toHaveLength(2)
    expect(container.querySelectorAll('.material-linear-wavy-progress')).toHaveLength(2)
    expect(container.querySelectorAll('.material-circular-wavy-progress')).toHaveLength(2)
  })

  it('supports Android-style geometry and color overrides', () => {
    const { container } = render(
      <MaterialLinearWavyProgressIndicator
        amplitude={0}
        color="#123456"
        gapSize={8}
        height={16}
        label="Custom"
        stopColor="#abcdef"
        stopSize={0}
        strokeLinecap="butt"
        strokeWidth={8}
        trackColor="#eeeeee"
        trackStrokeWidth={6}
        value={0.5}
        wavelength={56}
        waveSpeed={0}
        width={320}
      />,
    )

    const indicator = screen.getByRole('progressbar', { name: 'Custom' })
    expect(indicator).toHaveStyle({
      '--md-linear-progress-width': '320px',
      '--md-linear-wavy-progress-height': '16px',
      '--md-progress-active-color': '#123456',
      '--md-progress-track-color': '#eeeeee',
      '--md-progress-stop-color': '#abcdef',
    })
    expect(container.querySelector('.material-progress__active')).toHaveAttribute(
      'stroke-width',
      '8',
    )
    expect(container.querySelector('.material-progress__active')?.getAttribute('d')).not.toContain(
      'C',
    )
    expect(container.querySelector('.material-progress__stop')).not.toBeInTheDocument()
  })

  it('supports the Android thick linear sample without clipping its stroke', () => {
    const { container } = render(
      <MaterialLinearProgressIndicator
        height={14}
        label="Thick linear"
        strokeWidth={8}
        trackStrokeWidth={8}
        value={0.5}
      />,
    )

    expect(screen.getByRole('progressbar', { name: 'Thick linear' })).toHaveStyle({
      '--md-linear-progress-height': '14px',
    })
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 240 14')
  })

  it('keeps the old WavyProgress API as a determinate alias', () => {
    render(<MaterialWavyProgress label="Legacy download" value={0.6} />)

    const indicator = screen.getByRole('progressbar', { name: 'Legacy download' })
    expect(indicator).toHaveClass('material-linear-wavy-progress')
    expect(indicator).not.toHaveAttribute('data-indeterminate')
  })
})
