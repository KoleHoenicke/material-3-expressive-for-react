import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'

import './MaterialDivider.css'

export type MaterialDividerOrientation = 'horizontal' | 'vertical'
export type MaterialDividerVariant = 'heavy' | 'regular'
export type MaterialDividerInset = boolean | CSSProperties['paddingInlineStart']

export type MaterialDividerStyle = CSSProperties & {
  '--md-divider-color'?: string
  '--md-divider-heavy-thickness'?: string
  '--md-divider-inset-size'?: string
  '--md-divider-inset-start'?: string
  '--md-divider-inset-end'?: string
  '--md-divider-thickness'?: string
}

export type MaterialDividerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'color' | 'style'
> & {
  /** Material divider color. Defaults to the outline-variant color role. */
  color?: CSSProperties['color']
  /** Symmetric logical inset. `true` uses the Material 16px inset. */
  inset?: MaterialDividerInset
  /** Logical inset at the beginning of the divider's long axis. */
  insetStart?: MaterialDividerInset
  /** Logical inset at the end of the divider's long axis. */
  insetEnd?: MaterialDividerInset
  orientation?: MaterialDividerOrientation
  style?: MaterialDividerStyle
  /** Line thickness. A number is interpreted as CSS pixels. */
  thickness?: CSSProperties['blockSize']
  /** Regular is 1px. Heavy is the Android Views 8px section divider. */
  variant?: MaterialDividerVariant
}

export type MaterialHorizontalDividerProps = Omit<MaterialDividerProps, 'orientation'>
export type MaterialVerticalDividerProps = Omit<MaterialDividerProps, 'orientation'>

function cssLength(value: CSSProperties['blockSize']) {
  return typeof value === 'number' ? `${value}px` : value
}

function resolveInset(
  value: MaterialDividerInset | undefined,
  fallback: string | undefined,
) {
  if (value === true) {
    return 'var(--md-divider-inset-size, 16px)'
  }

  if (value === false) {
    return '0px'
  }

  if (value !== undefined) {
    return cssLength(value)
  }

  return fallback
}

export const MaterialDivider = forwardRef<HTMLDivElement, MaterialDividerProps>(
  function MaterialDivider(
    {
      'aria-orientation': ariaOrientation,
      className,
      color,
      inset,
      insetEnd,
      insetStart,
      orientation = 'horizontal',
      role,
      style,
      thickness,
      variant = 'regular',
      ...dividerProps
    },
    ref,
  ) {
    const dividerStyle: MaterialDividerStyle = { ...style }
    const symmetricInset = resolveInset(inset, undefined)
    const resolvedInsetStart = resolveInset(insetStart, symmetricInset)
    const resolvedInsetEnd = resolveInset(insetEnd, symmetricInset)

    if (color !== undefined) {
      dividerStyle['--md-divider-color'] = color
    }

    if (thickness !== undefined) {
      dividerStyle['--md-divider-thickness'] = cssLength(thickness)
    }

    if (resolvedInsetStart !== undefined) {
      dividerStyle['--md-divider-inset-start'] = resolvedInsetStart
    }

    if (resolvedInsetEnd !== undefined) {
      dividerStyle['--md-divider-inset-end'] = resolvedInsetEnd
    }

    return (
      <div
        {...dividerProps}
        ref={ref}
        aria-orientation={
          role === 'separator' ? (ariaOrientation ?? orientation) : ariaOrientation
        }
        className={['material-divider', className].filter(Boolean).join(' ')}
        data-material-divider=""
        data-orientation={orientation}
        data-variant={variant}
        role={role}
        style={dividerStyle}
      />
    )
  },
)

export const MaterialHorizontalDivider = forwardRef<
  HTMLDivElement,
  MaterialHorizontalDividerProps
>(function MaterialHorizontalDivider(props, ref) {
  return <MaterialDivider {...props} ref={ref} orientation="horizontal" />
})

export const MaterialVerticalDivider = forwardRef<
  HTMLDivElement,
  MaterialVerticalDividerProps
>(function MaterialVerticalDivider(props, ref) {
  return <MaterialDivider {...props} ref={ref} orientation="vertical" />
})
