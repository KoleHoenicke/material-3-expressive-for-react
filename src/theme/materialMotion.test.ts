import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MATERIAL_APP_BAR_TIMING,
  DEFAULT_MATERIAL_MOTION_SPRING_ATTRIBUTES,
  DEFAULT_MATERIAL_MOTION_PRESETS,
  MATERIAL_MOTION_DEFAULT_SCHEME,
  MATERIAL_MOTION_PRESETS,
  MATERIAL_MOTION_SPRING_ATTRIBUTES,
  MATERIAL_MOTION_SPRING_ATTRIBUTES_BY_SCHEME,
  MATERIAL_PROGRESS_TIMING,
  MATERIAL_TRANSITION_PAIRS,
  getMaterialMotionPreset,
  getMaterialSpringAttributes,
  getMaterialTransitionPair,
} from './materialMotion'

describe('Material motion tokens', () => {
  it('uses expressive motion as the app default scheme', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/theme/motion.css'), 'utf8')

    expect(MATERIAL_MOTION_DEFAULT_SCHEME).toBe('expressive')
    expect(DEFAULT_MATERIAL_MOTION_PRESETS).toBe(MATERIAL_MOTION_PRESETS.expressive)
    expect(getMaterialMotionPreset('spatial', 'default')).toBe(
      MATERIAL_MOTION_PRESETS.expressive.spatial.default,
    )
    expect(css).toContain('--md-sys-state-focus-state-layer-opacity: 0.1')
    expect(css).toContain('--md-sys-state-pressed-state-layer-opacity: 0.1')
  })

  it('matches the Material web curve conversions for expressive springs', () => {
    expect(MATERIAL_MOTION_PRESETS.expressive).toMatchObject({
      spatial: {
        fast: {
          durationMs: 350,
          easing: 'cubic-bezier(0.42, 1.67, 0.21, 0.90)',
          controlPoints: [0.42, 1.67, 0.21, 0.9],
        },
        default: {
          durationMs: 500,
          easing: 'cubic-bezier(0.38, 1.21, 0.22, 1.00)',
          controlPoints: [0.38, 1.21, 0.22, 1],
        },
        slow: {
          durationMs: 650,
          easing: 'cubic-bezier(0.39, 1.29, 0.35, 0.98)',
          controlPoints: [0.39, 1.29, 0.35, 0.98],
        },
      },
      effects: {
        fast: {
          durationMs: 150,
          easing: 'cubic-bezier(0.31, 0.94, 0.34, 1.00)',
          controlPoints: [0.31, 0.94, 0.34, 1],
        },
        default: {
          durationMs: 200,
          easing: 'cubic-bezier(0.34, 0.80, 0.34, 1.00)',
          controlPoints: [0.34, 0.8, 0.34, 1],
        },
        slow: {
          durationMs: 300,
          easing: 'cubic-bezier(0.34, 0.88, 0.34, 1.00)',
          controlPoints: [0.34, 0.88, 0.34, 1],
        },
      },
    })
  })

  it('matches the Material web curve conversions for standard springs', () => {
    expect(MATERIAL_MOTION_PRESETS.standard).toMatchObject({
      spatial: {
        fast: {
          durationMs: 350,
          easing: 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
          controlPoints: [0.27, 1.06, 0.18, 1],
        },
        default: {
          durationMs: 500,
          easing: 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
          controlPoints: [0.27, 1.06, 0.18, 1],
        },
        slow: {
          durationMs: 750,
          easing: 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
          controlPoints: [0.27, 1.06, 0.18, 1],
        },
      },
      effects: {
        fast: {
          durationMs: 150,
          easing: 'cubic-bezier(0.31, 0.94, 0.34, 1.00)',
          controlPoints: [0.31, 0.94, 0.34, 1],
        },
        default: {
          durationMs: 200,
          easing: 'cubic-bezier(0.34, 0.80, 0.34, 1.00)',
          controlPoints: [0.34, 0.8, 0.34, 1],
        },
        slow: {
          durationMs: 300,
          easing: 'cubic-bezier(0.34, 0.88, 0.34, 1.00)',
          controlPoints: [0.34, 0.88, 0.34, 1],
        },
      },
    })
  })

  it('exposes the current AndroidX spring attributes for both motion schemes', () => {
    expect(MATERIAL_MOTION_SPRING_ATTRIBUTES_BY_SCHEME).toEqual({
      expressive: {
        spatial: {
          fast: { dampingRatio: 0.6, stiffness: 800 },
          default: { dampingRatio: 0.8, stiffness: 380 },
          slow: { dampingRatio: 0.8, stiffness: 200 },
        },
        effects: {
          fast: { dampingRatio: 1, stiffness: 3800 },
          default: { dampingRatio: 1, stiffness: 1600 },
          slow: { dampingRatio: 1, stiffness: 800 },
        },
      },
      standard: {
        spatial: {
          fast: { dampingRatio: 0.9, stiffness: 1400 },
          default: { dampingRatio: 0.9, stiffness: 700 },
          slow: { dampingRatio: 0.9, stiffness: 300 },
        },
        effects: {
          fast: { dampingRatio: 1, stiffness: 3800 },
          default: { dampingRatio: 1, stiffness: 1600 },
          slow: { dampingRatio: 1, stiffness: 800 },
        },
      },
    })

    expect(DEFAULT_MATERIAL_MOTION_SPRING_ATTRIBUTES).toBe(
      MATERIAL_MOTION_SPRING_ATTRIBUTES_BY_SCHEME.expressive,
    )
    expect(MATERIAL_MOTION_SPRING_ATTRIBUTES).toBe(DEFAULT_MATERIAL_MOTION_SPRING_ATTRIBUTES)
    expect(getMaterialSpringAttributes('spatial', 'fast')).toEqual({
      dampingRatio: 0.6,
      stiffness: 800,
    })
    expect(getMaterialSpringAttributes('spatial', 'fast', 'standard')).toEqual({
      dampingRatio: 0.9,
      stiffness: 1400,
    })
  })

  it('keeps CSS spring physics, curve conversions, and active scheme aliases aligned', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/theme/motion.css'), 'utf8')

    expect(css).toContain('--md-sys-motion-expressive-spring-fast-spatial-damping: 0.6')
    expect(css).toContain('--md-sys-motion-expressive-spring-fast-spatial-stiffness: 800')
    expect(css).toContain('--md-sys-motion-expressive-spring-default-spatial-damping: 0.8')
    expect(css).toContain('--md-sys-motion-expressive-spring-default-spatial-stiffness: 380')
    expect(css).toContain('--md-sys-motion-expressive-spring-slow-spatial-stiffness: 200')
    expect(css).toContain('--md-sys-motion-standard-spring-fast-spatial-damping: 0.9')
    expect(css).toContain('--md-sys-motion-standard-spring-fast-spatial-stiffness: 1400')
    expect(css).toMatch(
      /\[data-motion-scheme='standard'\][\s\S]*--md-sys-motion-spring-fast-spatial-stiffness:\s*var\(\s*--md-sys-motion-standard-spring-fast-spatial-stiffness/,
    )
    expect(css).toMatch(
      /Resolve aliases at every scheme boundary[\s\S]*:root,\s*\[data-motion-scheme\]\s*\{[\s\S]*--m3-motion-fast-spatial-duration:\s*var\(--md-sys-motion-spring-fast-spatial-duration\)/,
    )
  })

  it('uses current physics roles and preserves reduced motion inside theme providers', () => {
    const motionCss = readFileSync(resolve(process.cwd(), 'src/theme/motion.css'), 'utf8')
    const switchCss = readFileSync(
      resolve(process.cwd(), 'src/components/MaterialSwitch.css'),
      'utf8',
    )
    const appBarCss = readFileSync(
      resolve(process.cwd(), 'src/components/MaterialAppBar.css'),
      'utf8',
    )
    const listCss = readFileSync(
      resolve(process.cwd(), 'src/components/MaterialList.css'),
      'utf8',
    )
    const fabCss = readFileSync(
      resolve(process.cwd(), 'src/components/MaterialFloatingActionButton.css'),
      'utf8',
    )

    expect(motionCss).toContain('.m3-motion-effects-slow')
    expect(motionCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*:root,\s*\[data-motion-scheme\]/,
    )
    expect(motionCss).toContain('transform var(--m3-motion-transition-fast-spatial)')
    expect(motionCss).not.toContain('--m3-motion-switch-effects-duration: 67ms')
    expect(motionCss).not.toContain('--m3-motion-switch-icon-fade-duration: 33ms')
    expect(motionCss).not.toContain('--m3-motion-switch-icon-transform-duration: 167ms')
    expect(motionCss).not.toContain('cubic-bezier(0.175, 0.885, 0.32, 1.275)')
    expect(switchCss).toContain('var(--m3-motion-switch-handle-slide-easing)')
    expect(appBarCss).not.toMatch(/opacity var\(--m3-motion-transition-[^)]+-spatial\)/)
    expect(appBarCss).toMatch(
      /\.material-top-app-bar\[data-settling='true'\]\s*\{[^}]*block-size var\(--m3-motion-transition-default-effects\)/,
    )
    expect(appBarCss).toMatch(
      /\.material-bottom-app-bar\[data-settling='true'\]\s*\{[^}]*block-size var\(--m3-motion-transition-fast-spatial\)/,
    )
    expect(listCss).toContain(
      'background-color var(--m3-motion-transition-default-effects)',
    )
    expect(listCss).toContain(
      'border-radius var(--m3-motion-transition-fast-spatial)',
    )
    expect(listCss).toContain('color var(--m3-motion-transition-default-effects)')
    expect(fabCss).toMatch(
      /\.material-fab__label\s*\{[^}]*opacity var\(--m3-motion-transition-default-effects\)/,
    )
    expect(fabCss).toMatch(
      /\.material-fab--extended\[data-expanded='false'\] \.material-fab__label\s*\{[^}]*inline-size var\(--m3-motion-transition-default-spatial\)[^}]*opacity var\(--m3-motion-transition-fast-effects\)/,
    )
  })

  it('uses the current AndroidX top and bottom app bar snap roles', () => {
    expect(MATERIAL_APP_BAR_TIMING).toEqual({
      scrollEndMs: 140,
      topSettleDurationMs: MATERIAL_MOTION_PRESETS.expressive.effects.default.durationMs,
      bottomSettleDurationMs: MATERIAL_MOTION_PRESETS.expressive.spatial.fast.durationMs,
    })
  })

  it('keeps progress cycles and value transitions aligned with AndroidX', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/theme/motion.css'), 'utf8')

    expect(MATERIAL_PROGRESS_TIMING).toMatchObject({
      linearIndeterminateCycleMs: 1750,
      circularIndeterminateCycleMs: 6000,
      circularAdditionalRotationStepMs: 1500,
      circularAdditionalRotationDurationMs: 300,
      wavyDeterminateDurationMs: 500,
      standardDeterminateSpring: {
        dampingRatio: 1,
        stiffness: 50,
        visibilityThreshold: 0.001,
      },
    })
    expect(css).toContain('--m3-motion-progress-linear-indeterminate-cycle: 1750ms')
    expect(css).toContain('--m3-motion-progress-circular-indeterminate-cycle: 6000ms')
  })

  it('matches the Material suggested easing and duration pairs', () => {
    expect(MATERIAL_TRANSITION_PAIRS).toMatchObject({
      emphasized: {
        persistent: {
          durationMs: 500,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          transitionType: 'begin-and-end-on-screen',
        },
        enter: {
          durationMs: 400,
          easing: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          transitionType: 'enter-screen',
        },
        exit: {
          durationMs: 200,
          easing: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          transitionType: 'exit-screen',
        },
      },
      standard: {
        persistent: {
          durationMs: 300,
          easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
          transitionType: 'begin-and-end-on-screen',
        },
        enter: {
          durationMs: 250,
          easing: 'cubic-bezier(0, 0, 0, 1)',
          transitionType: 'enter-screen',
        },
        exit: {
          durationMs: 200,
          easing: 'cubic-bezier(0.3, 0, 1, 1)',
          transitionType: 'exit-screen',
        },
      },
    })

    expect(getMaterialTransitionPair('emphasized', 'enter')).toBe(
      MATERIAL_TRANSITION_PAIRS.emphasized.enter,
    )
  })
})
