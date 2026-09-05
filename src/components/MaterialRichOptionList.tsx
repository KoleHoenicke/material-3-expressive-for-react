import { useId, type HTMLAttributes, type ReactNode } from 'react'

import { MaterialRipple } from './MaterialRipple'
import './MaterialRichOptionList.css'

export type MaterialRichOptionValue = string | number

export type MaterialRichOption<Value extends MaterialRichOptionValue = string> = {
  ariaLabel?: string
  disabled?: boolean
  label: ReactNode
  leading?: ReactNode
  supportingText?: ReactNode
  value: Value
}

export type MaterialRichOptionListProps<Value extends MaterialRichOptionValue = string> =
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
    ariaLabel: string
    name?: string
    onChange: (value: Value) => void
    onOptionBlur?: (option: MaterialRichOption<Value>) => void
    onOptionFocus?: (option: MaterialRichOption<Value>) => void
    onOptionPointerEnter?: (option: MaterialRichOption<Value>) => void
    options: readonly MaterialRichOption<Value>[]
    selectedIcon?: ReactNode
    value: Value
  }

function optionLabelText(label: ReactNode) {
  return typeof label === 'string' || typeof label === 'number' ? String(label) : undefined
}

export function MaterialRichOptionList<Value extends MaterialRichOptionValue = string>({
  ariaLabel,
  className,
  name,
  onChange,
  onOptionBlur,
  onOptionFocus,
  onOptionPointerEnter,
  options,
  selectedIcon,
  value,
  ...divProps
}: MaterialRichOptionListProps<Value>) {
  const fallbackName = useId()
  const groupName = name ?? fallbackName

  return (
    <div
      {...divProps}
      aria-label={ariaLabel}
      className={['material-rich-option-list', className].filter(Boolean).join(' ')}
      data-material-rich-option-list
      role="radiogroup"
    >
      {options.map((option) => {
        const selected = option.value === value
        const disabled = option.disabled === true

        return (
          <label
            key={String(option.value)}
            className={[
              'material-rich-option',
              selected ? 'material-rich-option--selected' : '',
              disabled ? 'material-rich-option--disabled' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            data-material-rich-option
            data-material-rich-option-selected={selected ? 'true' : undefined}
            onPointerEnter={() => onOptionPointerEnter?.(option)}
          >
            <MaterialRipple active={selected} activeState="hover" disabled={disabled} />
            <input
              type="radio"
              name={groupName}
              value={String(option.value)}
              checked={selected}
              aria-label={option.ariaLabel ?? optionLabelText(option.label)}
              disabled={disabled}
              onBlur={() => onOptionBlur?.(option)}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  onChange(option.value)
                }
              }}
              onFocus={() => onOptionFocus?.(option)}
            />
            {option.leading ? (
              <span className="material-rich-option__leading" aria-hidden="true">
                {option.leading}
              </span>
            ) : null}
            <span className="material-rich-option__body">
              <span className="material-rich-option__label">{option.label}</span>
              {option.supportingText ? (
                <span className="material-rich-option__supporting-text">
                  {option.supportingText}
                </span>
              ) : null}
            </span>
            <span className="material-rich-option__state" aria-hidden="true">
              {selected ? selectedIcon : null}
            </span>
          </label>
        )
      })}
    </div>
  )
}
