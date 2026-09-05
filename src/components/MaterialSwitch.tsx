import {
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import './MaterialSwitch.css'

export type MaterialSwitchIconMode = 'none' | 'selected' | 'both'

export type MaterialSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> & {
  iconMode?: MaterialSwitchIconMode
  selectedIcon?: ReactNode
  unselectedIcon?: ReactNode
}

export function MaterialSwitch({
  className,
  disabled,
  iconMode = 'selected',
  onChange,
  onKeyDown,
  role = 'switch',
  selectedIcon,
  unselectedIcon,
  ...inputProps
}: MaterialSwitchProps) {
  const switchClassName = [
    'material-switch',
    `material-switch--icons-${iconMode}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event)

    if (event.defaultPrevented || disabled || event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    event.currentTarget.click()
  }

  return (
    <span className={switchClassName} data-icon-mode={iconMode}>
      <input
        {...inputProps}
        type="checkbox"
        role={role}
        disabled={disabled}
        onChange={onChange as ChangeEventHandler<HTMLInputElement>}
        onKeyDown={handleKeyDown}
      />
      <span className="material-switch__track" aria-hidden="true">
        <span className="material-switch__handle-container">
          <span className="material-switch__state-layer" />
          <span className="material-switch__handle">
            {iconMode === 'none' ? null : (
              <span className="material-switch__icons">
                <span className="material-switch__icon material-switch__icon--on">
                  {selectedIcon ?? <MaterialSwitchOnIcon />}
                </span>
                {iconMode === 'both' ? (
                  <span className="material-switch__icon material-switch__icon--off">
                    {unselectedIcon ?? <MaterialSwitchOffIcon />}
                  </span>
                ) : null}
              </span>
            )}
          </span>
        </span>
      </span>
    </span>
  )
}

function MaterialSwitchOnIcon() {
  return (
    <svg
      className="material-switch__icon-glyph"
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
    >
      <path d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z" />
    </svg>
  )
}

function MaterialSwitchOffIcon() {
  return (
    <svg
      className="material-switch__icon-glyph"
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
    >
      <path d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z" />
    </svg>
  )
}
