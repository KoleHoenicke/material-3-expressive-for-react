import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'

import { MaterialRipple } from './MaterialRipple'
import './MaterialQuantityStepper.css'

export type MaterialQuantityStepperProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> & {
  decrementIcon: ReactNode
  decrementLabel?: string
  disabled?: boolean
  incrementIcon: ReactNode
  incrementLabel?: string
  label: string
  max: number
  min?: number
  onChange: (value: number) => void
  step?: number
  value: number
}

function clampQuantity(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min
  }

  return Math.min(max, Math.max(min, Math.trunc(value)))
}

function parseQuantityInput(value: string, fallbackValue: number) {
  const trimmedValue = value.trim()

  if (trimmedValue === '') {
    return fallbackValue
  }

  return Number.parseInt(trimmedValue, 10)
}

export function MaterialQuantityStepper({
  className,
  decrementIcon,
  decrementLabel,
  disabled = false,
  incrementIcon,
  incrementLabel,
  label,
  max,
  min = 0,
  onChange,
  step = 1,
  value,
  ...divProps
}: MaterialQuantityStepperProps) {
  const safeMin = Math.min(min, max)
  const safeMax = Math.max(min, max)
  const safeStep = Math.max(1, Math.trunc(step))
  const safeValue = clampQuantity(value, safeMin, safeMax)
  const safeValueText = String(safeValue)
  const [draftValue, setDraftValue] = useState(safeValueText)
  const [editing, setEditing] = useState(false)
  const lastInputValueRef = useRef<string | null>(null)
  const interactionValue = editing
    ? clampQuantity(parseQuantityInput(draftValue, safeValue), safeMin, safeMax)
    : safeValue
  const hasDecrement = interactionValue > safeMin
  const hasIncrement = interactionValue < safeMax
  const canDecrement = !disabled && hasDecrement
  const canIncrement = !disabled && hasIncrement

  useEffect(() => {
    if (!editing) {
      setDraftValue(safeValueText)
    }
  }, [editing, safeValueText])

  function commitQuantity(nextValue: number) {
    const clampedValue = clampQuantity(nextValue, safeMin, safeMax)

    if (clampedValue !== safeValue) {
      onChange(clampedValue)
    }

    setDraftValue(String(clampedValue))
  }

  function commitInputValue(nextDraftValue: string) {
    commitQuantity(parseQuantityInput(nextDraftValue, safeValue))
  }

  function updateInputDraft(nextDraftValue: string) {
    const sanitizedValue = nextDraftValue.replace(/[^\d]/g, '')

    if (lastInputValueRef.current === sanitizedValue) {
      return
    }

    lastInputValueRef.current = sanitizedValue

    if (sanitizedValue === '') {
      setDraftValue('')
      return
    }

    commitInputValue(sanitizedValue)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    updateInputDraft(event.currentTarget.value)
  }

  function handleInputInput(event: FormEvent<HTMLInputElement>) {
    updateInputDraft(event.currentTarget.value)
  }

  function handleInputFocus(event: FocusEvent<HTMLInputElement>) {
    setEditing(true)
    event.currentTarget.select()
  }

  function handleInputClick(event: MouseEvent<HTMLInputElement>) {
    event.currentTarget.select()
  }

  function handleInputBlur(event: FocusEvent<HTMLInputElement>) {
    lastInputValueRef.current = null
    setEditing(false)
    commitInputValue(event.currentTarget.value)
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
      return
    }

    if (event.key === 'Escape') {
      event.currentTarget.value = safeValueText
      setDraftValue(safeValueText)
      setEditing(false)
      event.currentTarget.blur()
    }
  }

  return (
    <div
      {...divProps}
      aria-label={label}
      className={['material-quantity-stepper', className].filter(Boolean).join(' ')}
      data-has-decrement={hasDecrement ? 'true' : 'false'}
      data-has-increment={hasIncrement ? 'true' : 'false'}
      data-material-quantity-stepper
      role="group"
    >
      <button
        type="button"
        className="material-quantity-stepper__button"
        aria-label={decrementLabel ?? `Decrease ${label}`}
        disabled={!canDecrement}
        onClick={() => commitQuantity(interactionValue - safeStep)}
      >
        <MaterialRipple disabled={!canDecrement} />
        <span className="material-quantity-stepper__icon" aria-hidden="true">
          {decrementIcon}
        </span>
      </button>
      <input
        type="text"
        className="material-quantity-stepper__value"
        data-material-typography="labelLarge"
        aria-label={`${label} value`}
        disabled={disabled}
        inputMode="numeric"
        min={safeMin}
        max={safeMax}
        pattern="[0-9]*"
        value={draftValue}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        onInput={handleInputInput}
        onKeyDown={handleInputKeyDown}
      />
      <button
        type="button"
        className="material-quantity-stepper__button"
        aria-label={incrementLabel ?? `Increase ${label}`}
        disabled={!canIncrement}
        onClick={() => commitQuantity(interactionValue + safeStep)}
      >
        <MaterialRipple disabled={!canIncrement} />
        <span className="material-quantity-stepper__icon" aria-hidden="true">
          {incrementIcon}
        </span>
      </button>
    </div>
  )
}
