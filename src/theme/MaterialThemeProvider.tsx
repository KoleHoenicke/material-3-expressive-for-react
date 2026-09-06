import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { MaterialMotionScheme } from './materialMotion'
import {
  createMaterialTypographyCssVariables,
  type MaterialTypographyOptions,
} from './materialTypography'
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
  motionScheme?: MaterialMotionScheme
  seed: MaterialThemeSeed
  typography?: MaterialTypographyOptions
}

export function MaterialThemeProvider({
  children,
  className,
  fidelity = true,
  mode = 'light',
  motionScheme = 'expressive',
  seed,
  style,
  typography,
  ...props
}: MaterialThemeProviderProps) {
  const variables = fidelity
    ? createMaterialFidelityThemeCssVariables(seed, mode)
    : createMaterialThemeCssVariables(seed, mode)

  return (
    <div
      {...props}
      className={['material-react-root', className].filter(Boolean).join(' ')}
      data-color-scheme={mode}
      data-motion-scheme={motionScheme}
      style={
        {
          ...variables,
          ...(typography ? createMaterialTypographyCssVariables(typography) : {}),
          colorScheme: mode,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
