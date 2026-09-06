import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type InputHTMLAttributes,
} from 'react'

import { MaterialRipple } from './MaterialRipple'
import './MaterialCheckbox.css'

export type MaterialCheckboxStyle = CSSProperties & {
  '--md-checkbox-container-shape'?: string
  '--md-checkbox-container-size'?: string
  '--md-checkbox-disabled-checkmark-color'?: string
  '--md-checkbox-disabled-checked-container-color'?: string
  '--md-checkbox-disabled-checked-outline-color'?: string
  '--md-checkbox-disabled-checked-outline-width'?: string
  '--md-checkbox-disabled-container-opacity'?: number | string
  '--md-checkbox-disabled-indeterminate-container-color'?: string
  '--md-checkbox-disabled-indeterminate-outline-color'?: string
  '--md-checkbox-disabled-indeterminate-outline-width'?: string
  '--md-checkbox-disabled-unchecked-container-color'?: string
  '--md-checkbox-disabled-unchecked-outline-color'?: string
  '--md-checkbox-disabled-unchecked-outline-width'?: string
  '--md-checkbox-error-focus-state-layer-color'?: string
  '--md-checkbox-error-hover-state-layer-color'?: string
  '--md-checkbox-error-outline-color'?: string
  '--md-checkbox-error-pressed-state-layer-color'?: string
  '--md-checkbox-focus-indicator-color'?: string
  '--md-checkbox-focus-indicator-offset'?: string
  '--md-checkbox-focus-indicator-thickness'?: string
  '--md-checkbox-focus-outline-color'?: string
  '--md-checkbox-focus-state-layer-color'?: string
  '--md-checkbox-focus-state-layer-opacity'?: number | string
  '--md-checkbox-hover-outline-color'?: string
  '--md-checkbox-hover-state-layer-color'?: string
  '--md-checkbox-hover-state-layer-opacity'?: number | string
  '--md-checkbox-icon-size'?: string
  '--md-checkbox-icon-stroke-width'?: string
  '--md-checkbox-outline-color'?: string
  '--md-checkbox-outline-width'?: string
  '--md-checkbox-pressed-outline-color'?: string
  '--md-checkbox-pressed-state-layer-color'?: string
  '--md-checkbox-pressed-state-layer-opacity'?: number | string
  '--md-checkbox-selected-container-color'?: string
  '--md-checkbox-selected-error-container-color'?: string
  '--md-checkbox-selected-error-icon-color'?: string
  '--md-checkbox-selected-focus-container-color'?: string
  '--md-checkbox-selected-focus-icon-color'?: string
  '--md-checkbox-selected-focus-state-layer-color'?: string
  '--md-checkbox-selected-focus-state-layer-opacity'?: number | string
  '--md-checkbox-selected-hover-container-color'?: string
  '--md-checkbox-selected-hover-icon-color'?: string
  '--md-checkbox-selected-hover-state-layer-color'?: string
  '--md-checkbox-selected-hover-state-layer-opacity'?: number | string
  '--md-checkbox-selected-icon-color'?: string
  '--md-checkbox-selected-outline-color'?: string
  '--md-checkbox-selected-outline-width'?: string
  '--md-checkbox-selected-pressed-container-color'?: string
  '--md-checkbox-selected-pressed-icon-color'?: string
  '--md-checkbox-selected-pressed-state-layer-color'?: string
  '--md-checkbox-selected-pressed-state-layer-opacity'?: number | string
  '--md-checkbox-state-layer-shape'?: string
  '--md-checkbox-state-layer-size'?: string
  '--md-checkbox-touch-target-size'?: string
  '--md-checkbox-unselected-container-color'?: string
  '--md-checkbox-unselected-icon-color'?: string
}

export type MaterialCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'style' | 'type'
> & {
  /** Shows the mixed parent state without changing the submitted checked value. */
  indeterminate?: boolean
  /** Applies the Material error color treatment and native invalid semantics. */
  error?: boolean
  style?: MaterialCheckboxStyle
}

export const MaterialCheckbox = forwardRef<HTMLInputElement, MaterialCheckboxProps>(
  function MaterialCheckbox(
    {
      'aria-checked': ariaChecked,
      'aria-invalid': ariaInvalid,
      checked,
      className,
      disabled = false,
      error = false,
      indeterminate = false,
      style,
      ...inputProps
    },
    forwardedRef,
  ) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)

    useLayoutEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    return (
      <span
        className={[
          'material-checkbox',
          indeterminate ? 'material-checkbox--indeterminate' : '',
          error ? 'material-checkbox--error' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        data-material-checkbox
        data-material-checkbox-error={error ? 'true' : undefined}
        data-material-checkbox-indeterminate={indeterminate ? 'true' : undefined}
        style={style}
      >
        <input
          {...inputProps}
          ref={inputRef}
          aria-checked={indeterminate ? 'mixed' : ariaChecked}
          aria-invalid={error ? true : ariaInvalid}
          checked={checked}
          disabled={disabled}
          type="checkbox"
        />
        <MaterialRipple disabled={disabled} unbounded />
        <span className="material-checkbox__focus-ring" aria-hidden="true" />
        <span className="material-checkbox__container" aria-hidden="true">
          <span className="material-checkbox__background" />
          <span className="material-checkbox__outline" />
          <svg className="material-checkbox__icon" viewBox="0 0 18 18" focusable="false">
            <path className="material-checkbox__mark material-checkbox__mark--check" d="M4.5 9 7.2 11.7 13.5 5.4" />
            <path className="material-checkbox__mark material-checkbox__mark--indeterminate" d="M4.5 9h9" />
          </svg>
        </span>
      </span>
    )
  },
)
