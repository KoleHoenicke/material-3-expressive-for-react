import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MATERIAL_TYPOGRAPHY_BASE_ROLES,
  MATERIAL_TYPOGRAPHY_ROLES,
  createMaterialTypography,
  createMaterialTypographyCssVariables,
  getMaterialEmphasizedTypographyRole,
} from './materialTypography'

const EXPECTED_TYPE_SCALE = {
  displayLarge: [57, 64, 400, -0.2, 500, 0],
  displayMedium: [45, 52, 400, 0, 500, 0],
  displaySmall: [36, 44, 400, 0, 500, 0],
  headlineLarge: [32, 40, 400, 0, 500, 0],
  headlineMedium: [28, 36, 400, 0, 500, 0],
  headlineSmall: [24, 32, 400, 0, 500, 0],
  titleLarge: [22, 28, 400, 0, 500, 0],
  titleMedium: [16, 24, 500, 0.2, 700, 0.15],
  titleSmall: [14, 20, 500, 0.1, 700, 0.1],
  bodyLarge: [16, 24, 400, 0.5, 500, 0.15],
  bodyMedium: [14, 20, 400, 0.2, 500, 0.25],
  bodySmall: [12, 16, 400, 0.4, 500, 0.4],
  labelLarge: [14, 20, 500, 0.1, 700, 0.1],
  labelMedium: [12, 16, 500, 0.5, 700, 0.5],
  labelSmall: [11, 16, 500, 0.5, 700, 0.5],
} as const

describe('Material typography tokens', () => {
  it('exposes all 15 baseline and 15 emphasized AndroidX roles', () => {
    expect(MATERIAL_TYPOGRAPHY_BASE_ROLES).toHaveLength(15)
    expect(MATERIAL_TYPOGRAPHY_ROLES).toHaveLength(30)
    expect(new Set(MATERIAL_TYPOGRAPHY_ROLES)).toHaveLength(30)
    expect(getMaterialEmphasizedTypographyRole('headlineMedium')).toBe(
      'headlineMediumEmphasized',
    )
  })

  it('matches the current AndroidX v0.103 baseline scale', () => {
    const typography = createMaterialTypography()

    for (const role of MATERIAL_TYPOGRAPHY_BASE_ROLES) {
      const [size, lineHeight, weight, tracking] = EXPECTED_TYPE_SCALE[role]

      expect(typography[role]).toMatchObject({
        fontSize: `${size}px`,
        fontWeight: weight,
        lineHeight: `${lineHeight}px`,
        letterSpacing: `${tracking}px`,
      })
    }
  })

  it('matches every emphasized weight and tracking change', () => {
    const typography = createMaterialTypography()

    for (const role of MATERIAL_TYPOGRAPHY_BASE_ROLES) {
      const [size, lineHeight, , , weight, tracking] = EXPECTED_TYPE_SCALE[role]
      const emphasizedRole = getMaterialEmphasizedTypographyRole(role)

      expect(typography[emphasizedRole]).toMatchObject({
        fontSize: `${size}px`,
        fontWeight: weight,
        lineHeight: `${lineHeight}px`,
        letterSpacing: `${tracking}px`,
      })
    }
  })

  it('supports global families, separate typeface roles, weights, and per-role overrides', () => {
    const typography = createMaterialTypography({
      defaultFontFamily: 'Default Sans',
      brandFontFamily: 'Display Sans',
      weights: { medium: 550, bold: 750 },
      styles: {
        bodyLarge: { fontFamily: 'Reading Serif', fontStyle: 'italic' },
        titleMediumEmphasized: { fontVariationSettings: "'GRAD' 50" },
      },
    })

    expect(typography.displayLarge.fontFamily).toBe('Display Sans')
    expect(typography.bodyMedium.fontFamily).toBe('Default Sans')
    expect(typography.bodyLarge).toMatchObject({
      fontFamily: 'Reading Serif',
      fontStyle: 'italic',
    })
    expect(typography.bodyLargeEmphasized.fontFamily).toBe('Default Sans')
    expect(typography.bodyLargeEmphasized.fontStyle).toBeUndefined()
    expect(typography.headlineSmallEmphasized.fontWeight).toBe(550)
    expect(typography.labelLargeEmphasized.fontWeight).toBe(750)
    expect(typography.titleMediumEmphasized.fontVariationSettings).toBe("'GRAD' 50")

    const variables = createMaterialTypographyCssVariables({
      styles: {
        titleMediumEmphasized: {
          fontFeatureSettings: "'ss01' 1",
          fontStretch: 'condensed',
          fontStyle: 'italic',
          fontVariationSettings: "'GRAD' 50",
        },
      },
    })
    expect(variables).toMatchObject({
      '--md-sys-typescale-title-medium-emphasized-font-feature-settings': "'ss01' 1",
      '--md-sys-typescale-title-medium-emphasized-font-stretch': 'condensed',
      '--md-sys-typescale-title-medium-emphasized-font-style': 'italic',
      '--md-sys-typescale-title-medium-emphasized-font-variation-settings': "'GRAD' 50",
    })
    expect(variables['--md-sys-typescale-title-medium-emphasized-font']).toBe(
      'var(--md-ref-typeface-plain)',
    )
    expect(variables['--md-sys-typescale-title-medium-emphasized-weight']).toBe(
      'var(--md-ref-typeface-weight-bold)',
    )
  })

  it('keeps the static stylesheet complete and aligns generated CSS variables', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/theme/tokens.css'), 'utf8')
    const variables = createMaterialTypographyCssVariables()

    for (const role of MATERIAL_TYPOGRAPHY_ROLES) {
      const token = role.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)

      for (const property of ['font', 'size', 'weight', 'line-height', 'tracking']) {
        expect(css).toContain(`--md-sys-typescale-${token}-${property}:`)
        expect(variables).toHaveProperty(`--md-sys-typescale-${token}-${property}`)
      }
    }
  })
})
