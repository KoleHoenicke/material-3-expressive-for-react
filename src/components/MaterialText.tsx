import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react'
import {
  getMaterialEmphasizedTypographyRole,
  type MaterialTypographyBaseRole,
  type MaterialTypographyRole,
} from '../theme/materialTypography'

import './MaterialText.css'

export type MaterialTextOverflow = 'clip' | 'ellipsis'

type MaterialTextOwnProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  color?: CSSProperties['color']
  emphasized?: boolean
  fontFamily?: CSSProperties['fontFamily']
  fontFeatureSettings?: CSSProperties['fontFeatureSettings']
  fontSize?: CSSProperties['fontSize']
  fontStretch?: CSSProperties['fontStretch']
  fontStyle?: CSSProperties['fontStyle']
  fontVariationSettings?: CSSProperties['fontVariationSettings']
  fontWeight?: CSSProperties['fontWeight']
  letterSpacing?: CSSProperties['letterSpacing']
  lineHeight?: CSSProperties['lineHeight']
  maxLines?: number
  minLines?: number
  overflow?: MaterialTextOverflow
  softWrap?: boolean
  textAlign?: CSSProperties['textAlign']
  textDecoration?: CSSProperties['textDecoration']
  variant?: MaterialTypographyRole
}

export type MaterialTextProps<T extends ElementType = 'span'> = MaterialTextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof MaterialTextOwnProps<T> | 'color'>

type MaterialTextCssProperties = CSSProperties & {
  '--md-text-font'?: string
  '--md-text-size'?: string
  '--md-text-weight'?: string
  '--md-text-line-height'?: string
  '--md-text-tracking'?: string
  '--md-text-features'?: string
  '--md-text-stretch'?: string
  '--md-text-style'?: string
  '--md-text-variations'?: string
  '--md-text-max-lines'?: number
}

function roleToCssToken(role: MaterialTypographyRole) {
  return role.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
}

function resolveTypographyRole(
  variant: MaterialTypographyRole,
  emphasized: boolean,
): MaterialTypographyRole {
  if (!emphasized || variant.endsWith('Emphasized')) {
    return variant
  }

  return getMaterialEmphasizedTypographyRole(variant as MaterialTypographyBaseRole)
}

export function MaterialText<T extends ElementType = 'span'>({
  as,
  children,
  className,
  color,
  emphasized = false,
  fontFamily,
  fontFeatureSettings,
  fontSize,
  fontStretch,
  fontStyle,
  fontVariationSettings,
  fontWeight,
  letterSpacing,
  lineHeight,
  maxLines,
  minLines,
  overflow = 'clip',
  softWrap = true,
  style,
  textAlign,
  textDecoration,
  variant = 'bodyLarge',
  ...elementProps
}: MaterialTextProps<T>) {
  const Component = as ?? 'span'
  const resolvedVariant = resolveTypographyRole(variant, emphasized)
  const roleToken = roleToCssToken(resolvedVariant)
  const resolvedMaxLines =
    maxLines === undefined || !Number.isFinite(maxLines)
      ? undefined
      : Math.max(1, Math.trunc(maxLines))
  const resolvedMinLines =
    minLines === undefined || !Number.isFinite(minLines)
      ? undefined
      : Math.min(resolvedMaxLines ?? Number.POSITIVE_INFINITY, Math.max(1, Math.trunc(minLines)))
  const textStyle: MaterialTextCssProperties = {
    '--md-text-font': `var(--md-sys-typescale-${roleToken}-font)`,
    '--md-text-size': `var(--md-sys-typescale-${roleToken}-size)`,
    '--md-text-weight': `var(--md-sys-typescale-${roleToken}-weight)`,
    '--md-text-line-height': `var(--md-sys-typescale-${roleToken}-line-height)`,
    '--md-text-tracking': `var(--md-sys-typescale-${roleToken}-tracking)`,
    '--md-text-features': `var(--md-sys-typescale-${roleToken}-font-feature-settings, normal)`,
    '--md-text-stretch': `var(--md-sys-typescale-${roleToken}-font-stretch, normal)`,
    '--md-text-style': `var(--md-sys-typescale-${roleToken}-font-style, normal)`,
    '--md-text-variations': `var(--md-sys-typescale-${roleToken}-font-variation-settings, normal)`,
    ...(resolvedMaxLines === undefined
      ? {}
      : { '--md-text-max-lines': resolvedMaxLines }),
    minBlockSize: resolvedMinLines === undefined ? undefined : `${resolvedMinLines}lh`,
    color,
    fontFamily,
    fontFeatureSettings,
    fontSize,
    fontStretch,
    fontStyle,
    fontVariationSettings,
    fontWeight,
    letterSpacing,
    lineHeight,
    textAlign,
    textDecoration,
    ...style,
  }

  return (
    <Component
      {...elementProps}
      className={['material-text', className].filter(Boolean).join(' ')}
      data-material-typography={resolvedVariant}
      data-max-lines={resolvedMaxLines === undefined ? undefined : resolvedMaxLines}
      data-min-lines={resolvedMinLines === undefined ? undefined : resolvedMinLines}
      data-overflow={overflow}
      data-soft-wrap={softWrap}
      style={textStyle}
    >
      {children}
    </Component>
  )
}
