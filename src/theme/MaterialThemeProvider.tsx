import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import {
  createMaterialFidelityThemeCssVariables,
  createMaterialThemeCssVariables,
  type MaterialThemeMode,
  type MaterialThemeSeed,
} from './materialTheme'

export type MaterialThemeProviderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode
  fidelity?: boolean
  mode?: MaterialThemeMode
  seed: MaterialThemeSeed
}

export function MaterialThemeProvider({
  children,
  className,
  fidelity = true,
  mode = 'light',
  seed,
  style,
  ...props
}: MaterialThemeProviderProps) {
  const variables = fidelity
    ? createMaterialFidelityThemeCssVariables(seed, mode)
    : createMaterialThemeCssVariables(seed, mode)

  return (
    <div
      {...props}
      className={['m3e-root', className].filter(Boolean).join(' ')}
      data-color-scheme={mode}
      data-motion-scheme="expressive"
      style={{ ...variables, colorScheme: mode, ...style } as CSSProperties}
    >
      {children}
    </div>
  )
}
