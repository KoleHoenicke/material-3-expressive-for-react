import type { HTMLAttributes, ReactNode } from 'react'

import './MaterialBadge.css'

export type MaterialBadgeTone = 'error' | 'primary' | 'secondary'
export type MaterialBadgeVariant = 'large' | 'small'

export type MaterialBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children?: ReactNode
  max?: number
  showZero?: boolean
  tone?: MaterialBadgeTone
  value?: number | string
  variant?: MaterialBadgeVariant
}

const DEFAULT_MAX_BADGE_VALUE = 999

function formatBadgeValue(value: number | string | undefined, max: number) {
  if (typeof value !== 'number') {
    return value
  }

  const safeMax =
    Number.isFinite(max) && max >= 0
      ? Math.trunc(max)
      : DEFAULT_MAX_BADGE_VALUE
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0

  return safeValue > safeMax ? `${safeMax}+` : safeValue.toLocaleString('en-US')
}

export function MaterialBadge({
  children,
  className,
  max = DEFAULT_MAX_BADGE_VALUE,
  showZero = false,
  tone = 'error',
  value,
  variant,
  ...spanProps
}: MaterialBadgeProps) {
  const numericValue = typeof value === 'number' ? value : undefined

  if (numericValue !== undefined && numericValue <= 0 && !showZero) {
    return null
  }

  const label = children ?? formatBadgeValue(value, max)
  const resolvedVariant: MaterialBadgeVariant = variant ?? (label == null ? 'small' : 'large')

  if (resolvedVariant === 'large' && (label == null || label === '')) {
    return null
  }

  return (
    <span
      {...spanProps}
      className={[
        'material-badge',
        `material-badge--${resolvedVariant}`,
        `material-badge--tone-${tone}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-material-badge-variant={resolvedVariant}
      data-material-typography={
        resolvedVariant === 'large' ? 'labelSmallEmphasized' : undefined
      }
    >
      {resolvedVariant === 'large' ? label : null}
    </span>
  )
}
