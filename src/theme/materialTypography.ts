import type { CSSProperties } from 'react'

export const MATERIAL_TYPOGRAPHY_BASE_ROLES = [
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'headlineLarge',
  'headlineMedium',
  'headlineSmall',
  'titleLarge',
  'titleMedium',
  'titleSmall',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'labelLarge',
  'labelMedium',
  'labelSmall',
] as const

export type MaterialTypographyBaseRole = (typeof MATERIAL_TYPOGRAPHY_BASE_ROLES)[number]
export type MaterialTypographyEmphasizedRole = `${MaterialTypographyBaseRole}Emphasized`
export type MaterialTypographyRole =
  | MaterialTypographyBaseRole
  | MaterialTypographyEmphasizedRole
export type MaterialTypefaceRole = 'brand' | 'plain'
export type MaterialTypefaceWeight = 'regular' | 'medium' | 'bold'

export interface MaterialTextStyle {
  fontFamily: NonNullable<CSSProperties['fontFamily']>
  fontSize: NonNullable<CSSProperties['fontSize']>
  fontWeight: NonNullable<CSSProperties['fontWeight']>
  lineHeight: NonNullable<CSSProperties['lineHeight']>
  letterSpacing: NonNullable<CSSProperties['letterSpacing']>
  fontFeatureSettings?: CSSProperties['fontFeatureSettings']
  fontStretch?: CSSProperties['fontStretch']
  fontStyle?: CSSProperties['fontStyle']
  fontVariationSettings?: CSSProperties['fontVariationSettings']
}

export interface MaterialTypographyOptions {
  /** Applies one family to every role unless brandFontFamily or plainFontFamily overrides it. */
  defaultFontFamily?: string
  brandFontFamily?: string
  plainFontFamily?: string
  weights?: Partial<Record<MaterialTypefaceWeight, CSSProperties['fontWeight']>>
  styles?: Partial<Record<MaterialTypographyRole, Partial<MaterialTextStyle>>>
}

export type MaterialTypography = Record<MaterialTypographyRole, MaterialTextStyle>

export const MATERIAL_DEFAULT_FONT_FAMILY =
  "'Google Sans Flex', 'Google Sans', 'Roboto', 'Helvetica Neue', Arial, sans-serif"

export const MATERIAL_TYPOGRAPHY_ROLES = [
  ...MATERIAL_TYPOGRAPHY_BASE_ROLES,
  ...MATERIAL_TYPOGRAPHY_BASE_ROLES.map(
    (role) => `${role}Emphasized` as MaterialTypographyEmphasizedRole,
  ),
] as const

const BASE_TYPE_SCALE: Record<
  MaterialTypographyBaseRole,
  {
    font: MaterialTypefaceRole
    lineHeight: number
    size: number
    tracking: number
    weight: MaterialTypefaceWeight
  }
> = {
  displayLarge: { font: 'brand', lineHeight: 64, size: 57, tracking: -0.2, weight: 'regular' },
  displayMedium: { font: 'brand', lineHeight: 52, size: 45, tracking: 0, weight: 'regular' },
  displaySmall: { font: 'brand', lineHeight: 44, size: 36, tracking: 0, weight: 'regular' },
  headlineLarge: { font: 'brand', lineHeight: 40, size: 32, tracking: 0, weight: 'regular' },
  headlineMedium: { font: 'brand', lineHeight: 36, size: 28, tracking: 0, weight: 'regular' },
  headlineSmall: { font: 'brand', lineHeight: 32, size: 24, tracking: 0, weight: 'regular' },
  titleLarge: { font: 'brand', lineHeight: 28, size: 22, tracking: 0, weight: 'regular' },
  titleMedium: { font: 'plain', lineHeight: 24, size: 16, tracking: 0.2, weight: 'medium' },
  titleSmall: { font: 'plain', lineHeight: 20, size: 14, tracking: 0.1, weight: 'medium' },
  bodyLarge: { font: 'plain', lineHeight: 24, size: 16, tracking: 0.5, weight: 'regular' },
  bodyMedium: { font: 'plain', lineHeight: 20, size: 14, tracking: 0.2, weight: 'regular' },
  bodySmall: { font: 'plain', lineHeight: 16, size: 12, tracking: 0.4, weight: 'regular' },
  labelLarge: { font: 'plain', lineHeight: 20, size: 14, tracking: 0.1, weight: 'medium' },
  labelMedium: { font: 'plain', lineHeight: 16, size: 12, tracking: 0.5, weight: 'medium' },
  labelSmall: { font: 'plain', lineHeight: 16, size: 11, tracking: 0.5, weight: 'medium' },
}

const EMPHASIZED_TYPE_SCALE: Record<
  MaterialTypographyBaseRole,
  { tracking: number; weight: MaterialTypefaceWeight }
> = {
  displayLarge: { tracking: 0, weight: 'medium' },
  displayMedium: { tracking: 0, weight: 'medium' },
  displaySmall: { tracking: 0, weight: 'medium' },
  headlineLarge: { tracking: 0, weight: 'medium' },
  headlineMedium: { tracking: 0, weight: 'medium' },
  headlineSmall: { tracking: 0, weight: 'medium' },
  titleLarge: { tracking: 0, weight: 'medium' },
  titleMedium: { tracking: 0.15, weight: 'bold' },
  titleSmall: { tracking: 0.1, weight: 'bold' },
  bodyLarge: { tracking: 0.15, weight: 'medium' },
  bodyMedium: { tracking: 0.25, weight: 'medium' },
  bodySmall: { tracking: 0.4, weight: 'medium' },
  labelLarge: { tracking: 0.1, weight: 'bold' },
  labelMedium: { tracking: 0.5, weight: 'bold' },
  labelSmall: { tracking: 0.5, weight: 'bold' },
}

const DEFAULT_WEIGHTS: Record<
  MaterialTypefaceWeight,
  NonNullable<CSSProperties['fontWeight']>
> = {
  regular: 400,
  medium: 500,
  bold: 700,
}

function typeScaleRoleToCssToken(role: MaterialTypographyRole) {
  return role.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
}

export function getMaterialEmphasizedTypographyRole(
  role: MaterialTypographyBaseRole,
): MaterialTypographyEmphasizedRole {
  return `${role}Emphasized`
}

export function createMaterialTypography(
  options: MaterialTypographyOptions = {},
): MaterialTypography {
  const fallbackFamily = options.defaultFontFamily ?? MATERIAL_DEFAULT_FONT_FAMILY
  const families: Record<MaterialTypefaceRole, string> = {
    brand: options.brandFontFamily ?? fallbackFamily,
    plain: options.plainFontFamily ?? fallbackFamily,
  }
  const weights: Record<
    MaterialTypefaceWeight,
    NonNullable<CSSProperties['fontWeight']>
  > = {
    regular: options.weights?.regular ?? DEFAULT_WEIGHTS.regular,
    medium: options.weights?.medium ?? DEFAULT_WEIGHTS.medium,
    bold: options.weights?.bold ?? DEFAULT_WEIGHTS.bold,
  }
  const typography = {} as MaterialTypography

  for (const role of MATERIAL_TYPOGRAPHY_BASE_ROLES) {
    const token = BASE_TYPE_SCALE[role]
    const defaultStyle: MaterialTextStyle = {
      fontFamily: families[token.font],
      fontSize: `${token.size}px`,
      fontWeight: weights[token.weight],
      lineHeight: `${token.lineHeight}px`,
      letterSpacing: `${token.tracking}px`,
    }
    const emphasizedToken = EMPHASIZED_TYPE_SCALE[role]
    const emphasizedRole = getMaterialEmphasizedTypographyRole(role)

    typography[role] = {
      ...defaultStyle,
      ...options.styles?.[role],
    }
    typography[emphasizedRole] = {
      ...defaultStyle,
      fontWeight: weights[emphasizedToken.weight],
      letterSpacing: `${emphasizedToken.tracking}px`,
      ...options.styles?.[emphasizedRole],
    }
  }

  return typography
}

export function createMaterialTypographyCssVariables(
  options: MaterialTypographyOptions = {},
) {
  const typography = createMaterialTypography(options)
  const variables: Record<string, string | number> = {
    '--material-ui-font': options.defaultFontFamily ?? MATERIAL_DEFAULT_FONT_FAMILY,
    '--md-ref-typeface-brand':
      options.brandFontFamily ?? options.defaultFontFamily ?? MATERIAL_DEFAULT_FONT_FAMILY,
    '--md-ref-typeface-plain':
      options.plainFontFamily ?? options.defaultFontFamily ?? MATERIAL_DEFAULT_FONT_FAMILY,
    '--md-ref-typeface-weight-regular': options.weights?.regular ?? DEFAULT_WEIGHTS.regular ?? 400,
    '--md-ref-typeface-weight-medium': options.weights?.medium ?? DEFAULT_WEIGHTS.medium ?? 500,
    '--md-ref-typeface-weight-bold': options.weights?.bold ?? DEFAULT_WEIGHTS.bold ?? 700,
  }

  for (const role of MATERIAL_TYPOGRAPHY_ROLES) {
    const cssToken = typeScaleRoleToCssToken(role)
    const style = typography[role]
    const baselineRole = role.replace('Emphasized', '') as MaterialTypographyBaseRole
    const baselineToken = BASE_TYPE_SCALE[baselineRole]
    const weightToken = role.endsWith('Emphasized')
      ? EMPHASIZED_TYPE_SCALE[baselineRole].weight
      : baselineToken.weight
    const styleOverride = options.styles?.[role]

    variables[`--md-sys-typescale-${cssToken}-font`] =
      styleOverride?.fontFamily ?? `var(--md-ref-typeface-${baselineToken.font})`
    variables[`--md-sys-typescale-${cssToken}-size`] = style.fontSize
    variables[`--md-sys-typescale-${cssToken}-weight`] =
      styleOverride?.fontWeight ?? `var(--md-ref-typeface-weight-${weightToken})`
    variables[`--md-sys-typescale-${cssToken}-line-height`] = style.lineHeight
    variables[`--md-sys-typescale-${cssToken}-tracking`] = style.letterSpacing

    if (style.fontStyle !== undefined) {
      variables[`--md-sys-typescale-${cssToken}-font-style`] = style.fontStyle
    }
    if (style.fontStretch !== undefined) {
      variables[`--md-sys-typescale-${cssToken}-font-stretch`] = style.fontStretch
    }
    if (style.fontFeatureSettings !== undefined) {
      variables[`--md-sys-typescale-${cssToken}-font-feature-settings`] =
        style.fontFeatureSettings
    }
    if (style.fontVariationSettings !== undefined) {
      variables[`--md-sys-typescale-${cssToken}-font-variation-settings`] =
        style.fontVariationSettings
    }
  }

  return variables
}

export const MATERIAL_DEFAULT_TYPOGRAPHY = createMaterialTypography()
