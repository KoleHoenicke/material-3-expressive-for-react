import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MATERIAL_TRANSITION_PAIRS } from '../theme/materialMotion'
import './MaterialWavyProgress.css'

export type MaterialWavyProgressProps = {
  className?: string
  label: string
  value: number
}

const VIEWBOX_WIDTH = 240
const VIEWBOX_HEIGHT = 10
const CENTER_Y = VIEWBOX_HEIGHT / 2
const ACTIVE_THICKNESS = 4
const TRACK_THICKNESS = 4
const TRACK_ACTIVE_GAP = 4
const STOP_SIZE = 4
const ACTIVE_WAVE_AMPLITUDE = 3
const ACTIVE_WAVE_WAVELENGTH = 40
const LINEAR_PROGRESS_DURATION_MS = MATERIAL_TRANSITION_PAIRS.emphasized.persistent.durationMs
const SECOND_IN_MILLISECONDS = 1000
const TWO_PI = Math.PI * 2
const PATH_EPSILON = 0.001

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatPathNumber(value: number) {
  return Number(value.toFixed(3)).toString()
}

function waveYAt(x: number, phase: number, amplitude: number) {
  const waveTheta = ((x - phase) / ACTIVE_WAVE_WAVELENGTH) * TWO_PI
  return CENTER_Y + Math.sin(waveTheta) * amplitude
}

function waveSlopeAt(x: number, phase: number, amplitude: number) {
  return (
    Math.cos(((x - phase) / ACTIVE_WAVE_WAVELENGTH) * TWO_PI) *
    amplitude *
    (TWO_PI / ACTIVE_WAVE_WAVELENGTH)
  )
}

function createLinearPath(startX: number, endX: number) {
  if (endX - startX <= PATH_EPSILON) {
    return ''
  }

  return `M ${formatPathNumber(startX)} ${CENTER_Y} L ${formatPathNumber(endX)} ${CENTER_Y}`
}

function createWavyPath(startX: number, endX: number, phase: number, amplitude: number) {
  if (endX - startX <= PATH_EPSILON) {
    return ''
  }

  if (amplitude <= PATH_EPSILON) {
    return createLinearPath(startX, endX)
  }

  const segmentLength = ACTIVE_WAVE_WAVELENGTH / 8
  const commands = [
    `M ${formatPathNumber(startX)} ${formatPathNumber(waveYAt(startX, phase, amplitude))}`,
  ]
  let segmentStartX = startX

  while (segmentStartX < endX - PATH_EPSILON) {
    const segmentEndX = Math.min(endX, segmentStartX + segmentLength)
    const segmentStartY = waveYAt(segmentStartX, phase, amplitude)
    const segmentEndY = waveYAt(segmentEndX, phase, amplitude)
    const controlDistance = (segmentEndX - segmentStartX) / 3
    const controlStartX = segmentStartX + controlDistance
    const controlStartY =
      segmentStartY + waveSlopeAt(segmentStartX, phase, amplitude) * controlDistance
    const controlEndX = segmentEndX - controlDistance
    const controlEndY = segmentEndY - waveSlopeAt(segmentEndX, phase, amplitude) * controlDistance

    commands.push(
      `C ${formatPathNumber(controlStartX)} ${formatPathNumber(controlStartY)} ${formatPathNumber(
        controlEndX,
      )} ${formatPathNumber(controlEndY)} ${formatPathNumber(segmentEndX)} ${formatPathNumber(
        segmentEndY,
      )}`,
    )
    segmentStartX = segmentEndX
  }

  return commands.join(' ')
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches)
    updateReducedMotion()
    mediaQuery.addEventListener('change', updateReducedMotion)

    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [])

  return reducedMotion
}

function useMeasuredWidth<TElement extends HTMLElement>() {
  const elementRef = useRef<TElement | null>(null)
  const [width, setWidth] = useState(VIEWBOX_WIDTH)

  useLayoutEffect(() => {
    const element = elementRef.current

    if (!element || typeof ResizeObserver === 'undefined') {
      return
    }

    const updateWidth = () => {
      const nextWidth = Math.max(
        element.clientWidth || element.getBoundingClientRect().width,
        VIEWBOX_HEIGHT,
      )
      setWidth((currentWidth) =>
        Math.abs(currentWidth - nextWidth) < 0.1 ? currentWidth : nextWidth,
      )
    }
    const observer = new ResizeObserver(updateWidth)
    updateWidth()
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return [elementRef, Math.max(width, VIEWBOX_HEIGHT)] as const
}

function useAnimatedProgress(value: number, reducedMotion: boolean) {
  const clampedValue = clampNumber(value, 0, 1)
  const [animatedValue, setAnimatedValue] = useState(clampedValue)
  const animatedValueRef = useRef(clampedValue)

  useEffect(() => {
    if (
      reducedMotion ||
      typeof window === 'undefined' ||
      typeof window.requestAnimationFrame !== 'function'
    ) {
      animatedValueRef.current = clampedValue
      setAnimatedValue(clampedValue)
      return
    }

    let frameId = 0
    const startedAt = window.performance.now()
    const startValue = animatedValueRef.current
    const valueDelta = clampedValue - startValue

    const tick = (now: number) => {
      const progress = clampNumber((now - startedAt) / LINEAR_PROGRESS_DURATION_MS, 0, 1)
      const nextValue = startValue + valueDelta * progress
      animatedValueRef.current = nextValue
      setAnimatedValue(nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [clampedValue, reducedMotion])

  return animatedValue
}

function useWavePhase(enabled: boolean, reducedMotion: boolean) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (
      !enabled ||
      reducedMotion ||
      typeof window === 'undefined' ||
      typeof window.requestAnimationFrame !== 'function'
    ) {
      setPhase(0)
      return
    }

    let frameId = 0
    const startedAt = window.performance.now()
    const tick = (now: number) => {
      const elapsedSeconds = (now - startedAt) / SECOND_IN_MILLISECONDS
      setPhase((elapsedSeconds * ACTIVE_WAVE_WAVELENGTH) % ACTIVE_WAVE_WAVELENGTH)
      frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [enabled, reducedMotion])

  return phase
}

export function MaterialWavyProgress({ className, label, value }: MaterialWavyProgressProps) {
  const [rootRef, measuredWidth] = useMeasuredWidth<HTMLSpanElement>()
  const reducedMotion = usePrefersReducedMotion()
  const animatedValue = useAnimatedProgress(value, reducedMotion)
  const progress = clampNumber(animatedValue, 0, 1)
  const waveEnabled = progress > 0.1 && progress < 0.95
  const phase = useWavePhase(waveEnabled, reducedMotion)
  const strokeCapInset = Math.max(ACTIVE_THICKNESS, TRACK_THICKNESS) / 2
  const lineStart = strokeCapInset
  const lineEnd = measuredWidth - strokeCapInset
  const lineLength = Math.max(lineEnd - lineStart, 0)
  const activeEnd = lineStart + lineLength * progress
  const amplitude = waveEnabled ? ACTIVE_WAVE_AMPLITUDE : 0
  const activePath = useMemo(
    () => createWavyPath(lineStart, activeEnd, phase, amplitude),
    [activeEnd, amplitude, lineStart, phase],
  )
  const trackSpacing =
    progress > 0 ? TRACK_ACTIVE_GAP + ACTIVE_THICKNESS / 2 + TRACK_THICKNESS / 2 : 0
  const trackStart = clampNumber(activeEnd + trackSpacing, lineStart, lineEnd)
  const trackPath = useMemo(() => createLinearPath(trackStart, lineEnd), [lineEnd, trackStart])
  const progressValueNow = Math.round(progress * 100)
  const rootClassName = ['material-wavy-progress', className].filter(Boolean).join(' ')
  const baseStopSize = Math.min(TRACK_THICKNESS, STOP_SIZE)
  const activeVisibleEnd = activePath ? activeEnd + ACTIVE_THICKNESS / 2 : lineStart
  const baseStopLeadingX = measuredWidth - baseStopSize
  const stopOverlap = Math.max(0, activeVisibleEnd - baseStopLeadingX)
  const stopSize = Math.max(0, baseStopSize - stopOverlap)
  const stopCenterX = measuredWidth - stopSize / 2

  return (
    <span
      ref={rootRef}
      className={rootClassName}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressValueNow}
    >
      <svg
        className="material-wavy-progress__svg"
        viewBox={`0 0 ${formatPathNumber(measuredWidth)} ${VIEWBOX_HEIGHT}`}
        width="100%"
        height={VIEWBOX_HEIGHT}
        focusable="false"
        aria-hidden="true"
      >
        {trackPath ? (
          <path
            className="material-wavy-progress__track"
            d={trackPath}
            strokeWidth={TRACK_THICKNESS}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
        {activePath ? (
          <path
            className="material-wavy-progress__active"
            d={activePath}
            strokeWidth={ACTIVE_THICKNESS}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
        {stopSize > 0 ? (
          <circle
            className="material-wavy-progress__stop"
            cx={stopCenterX}
            cy={CENTER_Y}
            r={stopSize / 2}
          />
        ) : null}
      </svg>
    </span>
  )
}
