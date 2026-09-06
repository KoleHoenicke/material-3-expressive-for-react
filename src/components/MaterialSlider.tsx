import {
  type ChangeEvent,
  type CSSProperties,
  type InputEvent,
  type InputHTMLAttributes,
  type PointerEvent,
  type ReactNode,
  useRef,
} from 'react'
import './MaterialSlider.css'

export type MaterialSliderValueIndicator = 'active' | 'always' | 'none'
export type MaterialSliderVariant = 'centered' | 'standard'

export type MaterialSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> & {
  insetIcon?: ReactNode
  origin?: number
  snapStopThreshold?: number
  snapStops?: readonly number[]
  stops?: readonly number[]
  valueIndicator?: MaterialSliderValueIndicator
  valueLabel?: ReactNode | ((value: number) => ReactNode)
  variant?: MaterialSliderVariant
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function numberFromInputValue(value: InputHTMLAttributes<HTMLInputElement>['value'], fallback: number) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const numericValue = Number(value)
    return Number.isNaN(numericValue) ? fallback : numericValue
  }

  return fallback
}

const DRAG_START_THRESHOLD = 2
const STOP_VALUE_EPSILON = 0.000001

function numbersAlmostEqual(left: number, right: number) {
  return Math.abs(left - right) <= STOP_VALUE_EPSILON
}

export function MaterialSlider({
  className,
  disabled,
  insetIcon,
  max = 100,
  min = 0,
  onChange,
  onInput,
  origin,
  snapStops = [],
  snapStopThreshold,
  stops = [],
  style,
  value,
  valueIndicator = 'none',
  valueLabel,
  variant = origin === undefined ? 'standard' : 'centered',
  ...inputProps
}: MaterialSliderProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const pointerStartRef = useRef<{ id: number; x: number; y: number } | null>(null)
  const numericMin = Number(min)
  const numericMax = Number(max)
  const safeMin = Number.isNaN(numericMin) ? 0 : numericMin
  const safeMax = Number.isNaN(numericMax) ? 100 : numericMax
  const range = safeMax - safeMin
  const numericValue = numberFromInputValue(value, safeMin)
  const clampedValue = range === 0
    ? safeMin
    : clampNumber(numericValue, Math.min(safeMin, safeMax), Math.max(safeMin, safeMax))
  const fraction = range === 0 ? 0 : (clampedValue - safeMin) / range
  const progress = clampNumber(fraction, 0, 1) * 100
  const originNumber = typeof origin === 'number' ? origin : undefined
  const originProgress =
    originNumber === undefined || range === 0 ? undefined : clampNumber(((originNumber - safeMin) / range) * 100, 0, 100)
  const showOrigin = variant === 'centered' && originProgress !== undefined
  const centeredDirection =
    showOrigin && originNumber !== undefined
      ? clampedValue > originNumber
        ? 'positive'
        : clampedValue < originNumber
          ? 'negative'
          : 'at-origin'
      : undefined
  const resolvedValueLabel =
    typeof valueLabel === 'function' ? valueLabel(clampedValue) : valueLabel ?? clampedValue
  const sliderClassName = [
    'material-slider',
    disabled ? 'material-slider--disabled' : '',
    showOrigin ? 'material-slider--centered' : '',
    centeredDirection ? `material-slider--centered-${centeredDirection}` : '',
    valueIndicator !== 'none' ? 'material-slider--with-value-indicator' : '',
    valueIndicator === 'always' ? 'material-slider--value-indicator-always' : '',
    insetIcon ? 'material-slider--with-inset-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const numericStep =
    inputProps.step === undefined || inputProps.step === 'any' ? Number.NaN : Number(inputProps.step)
  const effectiveSnapThreshold =
    snapStopThreshold ??
    (Number.isFinite(numericStep) && numericStep > 0
      ? numericStep * 0.5
      : Math.abs(range) * 0.025)

  function snapValueToStop(valueToSnap: number) {
    if (snapStops.length === 0 || Number.isNaN(valueToSnap)) {
      return valueToSnap
    }

    let closestStop = valueToSnap
    let closestDistance = Number.POSITIVE_INFINITY

    for (const stop of snapStops) {
      const distance = Math.abs(valueToSnap - stop)

      if (distance < closestDistance) {
        closestDistance = distance
        closestStop = stop
      }
    }

    return closestDistance <= effectiveSnapThreshold ? closestStop : valueToSnap
  }

  function snapInputElementValue(input: HTMLInputElement) {
    const rawValue = input.valueAsNumber
    const snappedValue = snapValueToStop(rawValue)

    if (!Number.isNaN(snappedValue) && snappedValue !== rawValue) {
      input.value = String(snappedValue)
    }
  }

  function syncVisualProgress(input: HTMLInputElement) {
    const nextValue = input.valueAsNumber
    const nextClampedValue = Number.isNaN(nextValue)
      ? safeMin
      : clampNumber(nextValue, Math.min(safeMin, safeMax), Math.max(safeMin, safeMax))
    const nextFraction = range === 0 ? 0 : (nextClampedValue - safeMin) / range

    rootRef.current?.style.setProperty(
      '--material-slider-progress',
      `${clampNumber(nextFraction, 0, 1) * 100}%`,
    )
  }

  function handleInput(event: InputEvent<HTMLInputElement>) {
    snapInputElementValue(event.currentTarget)
    syncVisualProgress(event.currentTarget)
    onInput?.(event)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    snapInputElementValue(event.currentTarget)
    syncVisualProgress(event.currentTarget)
    onChange?.(event)
  }

  function handlePointerDown(event: PointerEvent<HTMLInputElement>) {
    pointerStartRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    rootRef.current?.classList.remove('material-slider--dragging')
    inputProps.onPointerDown?.(event)
  }

  function handlePointerMove(event: PointerEvent<HTMLInputElement>) {
    const pointerStart = pointerStartRef.current

    if (
      pointerStart &&
      pointerStart.id === event.pointerId &&
      !rootRef.current?.classList.contains('material-slider--dragging')
    ) {
      const deltaX = event.clientX - pointerStart.x
      const deltaY = event.clientY - pointerStart.y

      if (Math.hypot(deltaX, deltaY) >= DRAG_START_THRESHOLD) {
        rootRef.current?.classList.add('material-slider--dragging')
      }
    }

    inputProps.onPointerMove?.(event)
  }

  function clearDragging() {
    pointerStartRef.current = null
    rootRef.current?.classList.remove('material-slider--dragging')
  }

  function handlePointerUp(event: PointerEvent<HTMLInputElement>) {
    clearDragging()
    inputProps.onPointerUp?.(event)
  }

  function handlePointerCancel(event: PointerEvent<HTMLInputElement>) {
    clearDragging()
    event.currentTarget.value = String(clampedValue)
    syncVisualProgress(event.currentTarget)
    inputProps.onPointerCancel?.(event)
  }

  return (
    <span
      ref={rootRef}
      className={sliderClassName}
      style={
        {
          ...style,
          '--material-slider-progress': `${progress}%`,
          ...(originProgress === undefined
            ? {}
            : { '--material-slider-origin': `${originProgress}%` }),
        } as CSSProperties
      }
    >
      <span className="material-slider__visual" aria-hidden="true">
        <span className="material-slider__track">
          {showOrigin ? (
            <>
              <span className="material-slider__track-inactive material-slider__track-inactive-start" />
              <span className="material-slider__track-active" />
              <span className="material-slider__track-inactive material-slider__track-inactive-end" />
            </>
          ) : (
            <>
              <span className="material-slider__track-active" />
              <span className="material-slider__track-inactive" />
            </>
          )}
        </span>
        {insetIcon ? <span className="material-slider__inset-icon">{insetIcon}</span> : null}
        {stops.length > 0 ? (
          <span className="material-slider__stops">
            {stops.map((stop) => {
              const stopProgress = range === 0 ? 0 : ((stop - safeMin) / range) * 100
              const normalizedStopProgress = clampNumber(stopProgress, 0, 100)
              const stopSitsInHandleGap = numbersAlmostEqual(stop, clampedValue)
              const stopSitsInOriginGap =
                showOrigin && originNumber !== undefined && numbersAlmostEqual(stop, originNumber)
              const stopSitsInActiveTrack =
                showOrigin && originNumber !== undefined
                  ? stop >= Math.min(clampedValue, originNumber) &&
                    stop <= Math.max(clampedValue, originNumber)
                  : stop <= clampedValue
              const stopClassName = [
                'material-slider__stop',
                stopSitsInActiveTrack
                  ? 'material-slider__stop--active'
                  : 'material-slider__stop--inactive',
              ].join(' ')

              if (stopSitsInHandleGap || stopSitsInOriginGap) {
                return null
              }

              return (
                <span
                  key={stop}
                  className={stopClassName}
                  style={
                    {
                      '--material-slider-stop-position': `${normalizedStopProgress}%`,
                    } as CSSProperties
                  }
                />
              )
            })}
          </span>
        ) : null}
        <span className="material-slider__handle-container">
          {valueIndicator !== 'none' ? (
          <span
            className="material-slider__value-indicator"
            data-material-typography="labelLarge"
          >
            {resolvedValueLabel}
          </span>
          ) : null}
          <span className="material-slider__handle" />
        </span>
      </span>
      <input
        {...inputProps}
        className="material-slider__input"
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onInput={handleInput}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </span>
  )
}
