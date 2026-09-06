import {
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react'

import { MaterialCheckbox, type MaterialCheckboxProps } from './MaterialCheckbox'
import './MaterialCheckboxList.css'

export type MaterialCheckboxListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ariaLabel: string
  children: ReactNode
}

export function MaterialCheckboxList({
  ariaLabel,
  children,
  className,
  ...divProps
}: MaterialCheckboxListProps) {
  return (
    <div
      {...divProps}
      aria-label={ariaLabel}
      className={['material-checkbox-list', className].filter(Boolean).join(' ')}
      data-material-checkbox-list
      role="group"
    >
      {children}
    </div>
  )
}

export type MaterialCheckboxListItemProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'label'
> & {
  checkboxPosition?: 'leading' | 'trailing'
  checkboxProps: MaterialCheckboxProps
  label: ReactNode
  leading?: ReactNode
  leadingType?: 'avatar' | 'icon' | 'image'
  supportingText?: ReactNode
}

export function MaterialCheckboxListItem({
  checkboxPosition = 'trailing',
  checkboxProps,
  className,
  label,
  leading,
  leadingType = 'icon',
  supportingText,
  ...labelProps
}: MaterialCheckboxListItemProps) {
  const checkbox = <MaterialCheckbox {...checkboxProps} />

  return (
    <label
      {...labelProps}
      className={[
        'material-checkbox-list-item',
        `material-checkbox-list-item--checkbox-${checkboxPosition}`,
        leading ? `material-checkbox-list-item--leading-${leadingType}` : '',
        supportingText ? 'material-checkbox-list-item--two-line' : '',
        checkboxProps.disabled ? 'material-checkbox-list-item--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-material-checkbox-list-item
    >
      {checkboxPosition === 'leading' ? checkbox : null}
      {leading ? (
        <span className="material-checkbox-list-item__leading" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span className="material-checkbox-list-item__body">
        <span className="material-checkbox-list-item__label">{label}</span>
        {supportingText ? (
          <span className="material-checkbox-list-item__supporting-text">{supportingText}</span>
        ) : null}
      </span>
      {checkboxPosition === 'trailing' ? checkbox : null}
    </label>
  )
}
