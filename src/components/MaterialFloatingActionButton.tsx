import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { MaterialRipple } from './MaterialRipple'
import './MaterialFloatingActionButton.css'

export type MaterialFabColor =
  | 'primary'
  | 'primary-container'
  | 'secondary'
  | 'secondary-container'
  | 'surface'
  | 'tertiary'
  | 'tertiary-container'

export type MaterialFabElevation = 'default' | 'lowered' | 'none'
export type MaterialFabSize = 'large' | 'medium' | 'regular' | 'small'
export type MaterialExtendedFabSize = 'baseline' | 'large' | 'medium' | 'small'
export type MaterialFabVisibilityAlignment =
  | 'bottom'
  | 'bottom-end'
  | 'bottom-start'
  | 'center'
  | 'end'
  | 'start'
  | 'top'
  | 'top-end'
  | 'top-start'

export type MaterialFabStyle = CSSProperties & {
  '--md-fab-container-color'?: string
  '--md-fab-container-height'?: string
  '--md-fab-container-shape'?: string
  '--md-fab-container-width'?: string
  '--md-fab-content-color'?: string
  '--md-fab-disabled-container-color'?: string
  '--md-fab-disabled-content-color'?: string
  '--md-fab-disabled-elevation'?: string
  '--md-fab-elevation'?: string
  '--md-fab-focus-elevation'?: string
  '--md-fab-focus-indicator-color'?: string
  '--md-fab-focus-indicator-offset'?: string
  '--md-fab-focus-indicator-thickness'?: string
  '--md-fab-focus-state-layer-opacity'?: number | string
  '--md-fab-hidden-scale'?: number | string
  '--md-fab-hover-elevation'?: string
  '--md-fab-hover-state-layer-opacity'?: number | string
  '--md-fab-icon-label-space'?: string
  '--md-fab-icon-size'?: string
  '--md-fab-label-font'?: string
  '--md-fab-label-line-height'?: string
  '--md-fab-label-max-width'?: string
  '--md-fab-label-size'?: string
  '--md-fab-label-tracking'?: string
  '--md-fab-label-weight'?: number | string
  '--md-fab-leading-space'?: string
  '--md-fab-min-width'?: string
  '--md-fab-pressed-elevation'?: string
  '--md-fab-pressed-state-layer-opacity'?: number | string
  '--md-fab-state-layer-color'?: string
  '--md-fab-touch-target-size'?: string
  '--md-fab-trailing-space'?: string
  '--md-fab-visual-inset-block'?: string
  '--md-fab-visual-inset-inline'?: string
}

type MaterialFabAccessibilityLabel =
  | {
      'aria-label': string
      'aria-labelledby'?: string
    }
  | {
      'aria-label'?: string
      'aria-labelledby': string
    }

type MaterialFabSharedProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'color' | 'style'
> & {
  color?: MaterialFabColor
  elevation?: MaterialFabElevation
  style?: MaterialFabStyle
  /** Animates the FAB toward the selected edge while removing it from interaction. */
  visible?: boolean
  visibilityAlignment?: MaterialFabVisibilityAlignment
}

export type MaterialFloatingActionButtonProps = MaterialFabSharedProps &
  MaterialFabAccessibilityLabel & {
    children: ReactNode
    size?: MaterialFabSize
  }

export type MaterialExtendedFloatingActionButtonProps = MaterialFabSharedProps & {
  /** Collapses an icon-and-label FAB to its icon while keeping the label as its accessible name. */
  expanded?: boolean
  icon?: ReactNode
  label: ReactNode
  size?: MaterialExtendedFabSize
}

function fabClassName(className: string | undefined, extended: boolean) {
  return [
    'material-fab',
    extended ? 'material-fab--extended' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export const MaterialFloatingActionButton = forwardRef<
  HTMLButtonElement,
  MaterialFloatingActionButtonProps
>(function MaterialFloatingActionButton(
  {
    'aria-hidden': ariaHidden,
    children,
    className,
    color = 'primary-container',
    disabled = false,
    elevation = 'default',
    size = 'regular',
    style,
    tabIndex,
    type = 'button',
    visible = true,
    visibilityAlignment = 'center',
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      aria-hidden={visible ? ariaHidden : true}
      className={fabClassName(className, false)}
      data-color={color}
      data-elevation={elevation}
      data-material-fab
      data-size={size}
      data-visible={visible ? 'true' : 'false'}
      data-visibility-alignment={visibilityAlignment}
      disabled={disabled}
      style={style}
      tabIndex={visible ? tabIndex : -1}
      type={type}
    >
      <MaterialRipple disabled={disabled || !visible} />
      <span className="material-fab__focus-ring" aria-hidden="true" />
      <span className="material-fab__content">
        <span className="material-fab__icon" aria-hidden="true">
          {children}
        </span>
      </span>
    </button>
  )
})

export const MaterialExtendedFloatingActionButton = forwardRef<
  HTMLButtonElement,
  MaterialExtendedFloatingActionButtonProps
>(function MaterialExtendedFloatingActionButton(
  {
    'aria-hidden': ariaHidden,
    className,
    color = 'primary-container',
    disabled = false,
    elevation = 'default',
    expanded = true,
    icon,
    label,
    size = 'small',
    style,
    tabIndex,
    type = 'button',
    visible = true,
    visibilityAlignment = 'center',
    ...buttonProps
  },
  ref,
) {
  const visuallyExpanded = icon === undefined || expanded

  return (
    <button
      {...buttonProps}
      ref={ref}
      aria-hidden={visible ? ariaHidden : true}
      className={fabClassName(className, true)}
      data-color={color}
      data-elevation={elevation}
      data-expanded={visuallyExpanded ? 'true' : 'false'}
      data-material-extended-fab
      data-material-fab
      data-size={size}
      data-visible={visible ? 'true' : 'false'}
      data-visibility-alignment={visibilityAlignment}
      disabled={disabled}
      style={style}
      tabIndex={visible ? tabIndex : -1}
      type={type}
    >
      <MaterialRipple disabled={disabled || !visible} />
      <span className="material-fab__focus-ring" aria-hidden="true" />
      <span className="material-fab__content">
        {icon !== undefined ? (
          <span className="material-fab__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span
          className="material-fab__label"
          data-material-typography={
            size === 'baseline'
              ? 'labelLargeEmphasized'
              : size === 'medium'
                ? 'titleLargeEmphasized'
                : size === 'large'
                  ? 'headlineSmallEmphasized'
                  : 'titleMediumEmphasized'
          }
        >
          {label}
        </span>
      </span>
    </button>
  )
})

type FixedFabProps = MaterialFloatingActionButtonProps extends infer Props
  ? Props extends unknown
    ? Omit<Props, 'size'>
    : never
  : never
type FixedExtendedFabProps = Omit<MaterialExtendedFloatingActionButtonProps, 'size'>

export const MaterialSmallFloatingActionButton = forwardRef<
  HTMLButtonElement,
  FixedFabProps
>(function MaterialSmallFloatingActionButton(props, ref) {
  return <MaterialFloatingActionButton {...props} ref={ref} size="small" />
})

export const MaterialMediumFloatingActionButton = forwardRef<
  HTMLButtonElement,
  FixedFabProps
>(function MaterialMediumFloatingActionButton(props, ref) {
  return <MaterialFloatingActionButton {...props} ref={ref} size="medium" />
})

export const MaterialLargeFloatingActionButton = forwardRef<
  HTMLButtonElement,
  FixedFabProps
>(function MaterialLargeFloatingActionButton(props, ref) {
  return <MaterialFloatingActionButton {...props} ref={ref} size="large" />
})

export const MaterialBaselineExtendedFloatingActionButton = forwardRef<
  HTMLButtonElement,
  FixedExtendedFabProps
>(function MaterialBaselineExtendedFloatingActionButton(props, ref) {
  return <MaterialExtendedFloatingActionButton {...props} ref={ref} size="baseline" />
})

export const MaterialSmallExtendedFloatingActionButton = forwardRef<
  HTMLButtonElement,
  FixedExtendedFabProps
>(function MaterialSmallExtendedFloatingActionButton(props, ref) {
  return <MaterialExtendedFloatingActionButton {...props} ref={ref} size="small" />
})

export const MaterialMediumExtendedFloatingActionButton = forwardRef<
  HTMLButtonElement,
  FixedExtendedFabProps
>(function MaterialMediumExtendedFloatingActionButton(props, ref) {
  return <MaterialExtendedFloatingActionButton {...props} ref={ref} size="medium" />
})

export const MaterialLargeExtendedFloatingActionButton = forwardRef<
  HTMLButtonElement,
  FixedExtendedFabProps
>(function MaterialLargeExtendedFloatingActionButton(props, ref) {
  return <MaterialExtendedFloatingActionButton {...props} ref={ref} size="large" />
})
