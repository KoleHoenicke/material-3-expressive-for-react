import type { HTMLAttributes, ReactNode } from 'react'

import './MaterialListCount.css'

export type MaterialListCountProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children?: ReactNode
  showZero?: boolean
  value?: number | string
}

function formatListCount(value: number | string | undefined) {
  if (typeof value !== 'number') {
    return value
  }

  const safeValue = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0
  return safeValue.toLocaleString('en-US')
}

export function MaterialListCount({
  children,
  className,
  showZero = false,
  value,
  ...spanProps
}: MaterialListCountProps) {
  const numericValue = typeof value === 'number' ? value : undefined

  if (numericValue !== undefined && numericValue <= 0 && !showZero) {
    return null
  }

  const label = children ?? formatListCount(value)

  if (label == null || label === '') {
    return null
  }

  return (
    <span
      {...spanProps}
      className={['material-list-count', className].filter(Boolean).join(' ')}
    >
      {label}
    </span>
  )
}
