import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { MaterialRipple } from './MaterialRipple'
import './MaterialListTrailingAction.css'

export type MaterialListTrailingActionVariant = 'standard' | 'filled-tonal'

export type MaterialListTrailingActionProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  active?: boolean
  children: ReactNode
  variant?: MaterialListTrailingActionVariant
}

export const MaterialListTrailingAction = forwardRef<
  HTMLButtonElement,
  MaterialListTrailingActionProps
>(function MaterialListTrailingAction(
  {
    active = false,
    children,
    className,
    disabled = false,
    type = 'button',
    variant = 'standard',
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={[
        'material-list-trailing-action',
        `material-list-trailing-action--${variant}`,
        active ? 'material-list-trailing-action--active' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-material-list-trailing-action
      data-material-list-trailing-action-active={active ? 'true' : undefined}
      data-material-list-trailing-action-variant={variant}
      disabled={disabled}
    >
      <MaterialRipple active={active} activeState="pressed" disabled={disabled} unbounded />
      <span className="material-list-trailing-action__icon" aria-hidden="true">
        {children}
      </span>
    </button>
  )
})

export type MaterialListSelectionIconProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> & {
  children: ReactNode
}

export function MaterialListSelectionIcon({
  'aria-hidden': ariaHidden = true,
  children,
  className,
  ...spanProps
}: MaterialListSelectionIconProps) {
  return (
    <span
      {...spanProps}
      aria-hidden={ariaHidden}
      className={['material-list-selection-icon', className].filter(Boolean).join(' ')}
      data-material-list-selection-icon
    >
      {children}
    </span>
  )
}
