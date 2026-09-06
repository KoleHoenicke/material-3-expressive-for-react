import {
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react'

import { MaterialCheckbox, type MaterialCheckboxProps } from './MaterialCheckbox'
import { MaterialList, type MaterialListVariant } from './MaterialList'
import { MaterialRipple } from './MaterialRipple'
import './MaterialCheckboxList.css'

export type MaterialCheckboxListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ariaLabel: string
  children: ReactNode
  variant?: MaterialListVariant
}

export function MaterialCheckboxList({
  ariaLabel,
  children,
  className,
  variant = 'segmented',
  ...divProps
}: MaterialCheckboxListProps) {
  return (
    <MaterialList
      {...divProps}
      ariaLabel={ariaLabel}
      className={['material-checkbox-list', className].filter(Boolean).join(' ')}
      data-material-checkbox-list
      role="group"
      variant={variant}
    >
      {children}
    </MaterialList>
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
        'material-list-item',
        `material-checkbox-list-item--checkbox-${checkboxPosition}`,
        leading ? `material-checkbox-list-item--leading-${leadingType}` : '',
        supportingText ? 'material-checkbox-list-item--two-line' : '',
        checkboxProps.disabled ? 'material-checkbox-list-item--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-material-checkbox-list-item
      data-disabled={checkboxProps.disabled ? 'true' : undefined}
      data-lines={supportingText ? 2 : 1}
      data-material-list-item=""
      data-selected={checkboxProps.checked || checkboxProps.indeterminate ? 'true' : undefined}
      data-interactive="true"
      role="listitem"
    >
      <MaterialRipple disabled={checkboxProps.disabled} ignoreSelector="input" />
      {checkboxPosition === 'leading' ? checkbox : null}
      {leading ? (
        <span
          className="material-checkbox-list-item__leading material-list-item__leading"
          data-type={leadingType}
          aria-hidden="true"
        >
          {leading}
        </span>
      ) : null}
      <span className="material-checkbox-list-item__body material-list-item__content">
        <span className="material-checkbox-list-item__label material-list-item__headline">
          {label}
        </span>
        {supportingText ? (
          <span className="material-checkbox-list-item__supporting-text material-list-item__supporting">
            {supportingText}
          </span>
        ) : null}
      </span>
      {checkboxPosition === 'trailing' ? checkbox : null}
    </label>
  )
}
