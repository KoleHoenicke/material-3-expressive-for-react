import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MATERIAL_MOTION_PRESETS,
  MATERIAL_MOTION_DEFAULT_SCHEME,
  MATERIAL_MOTION_PRESETS,
  MATERIAL_MOTION_SPRING_ATTRIBUTES,
  MATERIAL_TRANSITION_PAIRS,
  getMaterialMotionPreset,
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

  it('exposes Material spring attributes for native spring engines', () => {
    expect(MATERIAL_MOTION_SPRING_ATTRIBUTES).toEqual({
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
    })
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
