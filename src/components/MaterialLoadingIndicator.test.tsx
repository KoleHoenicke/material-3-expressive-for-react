import { act, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MaterialLoadingIndicator } from './MaterialLoadingIndicator'

const componentCss = readFileSync(
  resolve(process.cwd(), 'src/components/MaterialLoadingIndicator.css'),
  'utf8',
)

function useMotionPreference(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('MaterialLoadingIndicator', () => {
  it('uses the contained Material color roles, 48dp bounds, and a purpose label', () => {
    useMotionPreference(true)

    render(<MaterialLoadingIndicator label="Preparing export preview" />)

    const indicator = screen.getByRole('progressbar', { name: 'Preparing export preview' })
    const svg = indicator.querySelector('svg')

    expect(indicator).toHaveClass('material-loading-indicator--contained')
    expect(svg).toHaveAttribute('viewBox', '0 0 48 48')
    expect(svg?.querySelector('path')).toHaveAttribute('transform', 'rotate(90 24 24)')
    expect(componentCss).toMatch(
      /\.material-loading-indicator\s*\{[^}]*width:\s*var\(--material-loading-indicator-size, 48px\);[^}]*height:\s*var\(--material-loading-indicator-size, 48px\);/s,
    )
    expect(componentCss).toMatch(
      /\.material-loading-indicator--contained\s*\{[^}]*overflow:\s*hidden;[^}]*background:\s*var\([^;]*--md-sys-color-primary-container[^;]*;[^}]*color:\s*var\([^;]*--md-sys-color-on-primary-container[^;]*;/s,
    )
    expect(
      componentCss.match(/\.material-loading-indicator--contained\s*\{(?<body>[^}]*)\}/s)?.groups
        ?.body,
    ).not.toContain('box-shadow')
  })

  it('keeps sizing customizable through a single public CSS property', () => {
    expect(componentCss).toContain('var(--material-loading-indicator-size, 48px)')
    expect(componentCss).not.toContain('--material-loading-indicator-active-size')
  })

  it('matches the AndroidX spring duration and 650ms morph interval', () => {
    useMotionPreference(false)

    let animationFrame: FrameRequestCallback | undefined
    vi.spyOn(window.performance, 'now').mockReturnValue(1_000)
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrame = callback
        return 1
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    render(<MaterialLoadingIndicator label="Generating layout" />)

    const path = screen.getByRole('progressbar', { name: 'Generating layout' }).querySelector('path')

    expect(path).not.toBeNull()
    expect(animationFrame).toBeTypeOf('function')

    act(() => animationFrame?.(1_296))
    const beforeSpringEnd = path?.getAttribute('d')
    expect(path).toHaveAttribute('transform', 'rotate(211.11 24 24)')

    act(() => animationFrame?.(1_297))
    const atSpringEnd = path?.getAttribute('d')
    expect(path).toHaveAttribute('transform', 'rotate(202.915 24 24)')
    expect(atSpringEnd).not.toBe(beforeSpringEnd)

    act(() => animationFrame?.(1_649))
    expect(path?.getAttribute('d')).toBe(atSpringEnd)

    act(() => animationFrame?.(1_650))
    expect(path?.getAttribute('d')).not.toBe(atSpringEnd)
  })
})
