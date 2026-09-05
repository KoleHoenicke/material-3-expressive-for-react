import { useEffect, useRef } from 'react'
import {
  MATERIAL_RIPPLE_TIMING,
  MATERIAL_TRANSITION_PAIRS,
} from '../theme/materialMotion'
import './MaterialRipple.css'

export type MaterialRippleProps = {
  active?: boolean
  activeState?: 'hover' | 'pressed'
  className?: string
  disabled?: boolean
  ignoreSelector?: string
  unbounded?: boolean
}

const RippleState = {
  Inactive: 0,
  TouchDelay: 1,
  Holding: 2,
  WaitingForClick: 3,
} as const

type RippleStateValue = (typeof RippleState)[keyof typeof RippleState]

const ANIMATION_FILL: FillMode = 'forwards'
const STANDARD_EASING = MATERIAL_TRANSITION_PAIRS.standard.persistent.easing

type RippleController = {
  control: HTMLElement
  disabled: boolean
  growAnimation?: Animation
  hovered: boolean
  ignoreSelector?: string
  initialSize: number
  minimumPressTimeout: number | null
  pressElement: HTMLSpanElement
  pressed: boolean
  rippleScale: string
  rippleSize: string
  rippleStartEvent?: PointerEvent
  root: HTMLSpanElement
  state: RippleStateValue
  touchDelayTimeout: number | null
  unbounded: boolean
}

const rippleControllers = new WeakMap<HTMLElement, RippleController>()
let registeredRippleControllerCount = 0
let registeredRippleDocument: Document | null = null

function isTouch(event: PointerEvent) {
  return event.pointerType === 'touch'
}

function currentZoom(element: HTMLElement) {
  return (element as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? 1
}

function isControlDisabled(control: HTMLElement) {
  return (
    control.hasAttribute('disabled') ||
    control.getAttribute('aria-disabled') === 'true' ||
    control.closest('[aria-disabled="true"]') !== null
  )
}

function findRippleController(event: Event) {
  for (const target of event.composedPath()) {
    if (target instanceof HTMLElement) {
      const controller = rippleControllers.get(target)

      if (controller) {
        return controller
      }
    }
  }

  return null
}

function shouldIgnoreEvent(controller: RippleController, event: Event) {
  if (!controller.ignoreSelector || !(event.target instanceof Element)) {
    return false
  }

  const ignoredTarget = event.target.closest(controller.ignoreSelector)

  return Boolean(ignoredTarget && controller.control.contains(ignoredTarget))
}

function shouldReactToPointerEvent(
  controller: RippleController,
  event: PointerEvent,
  eventKind: 'hover' | 'press',
) {
  if (controller.disabled || isControlDisabled(controller.control) || !event.isPrimary) {
    return false
  }

  if (eventKind === 'press' && shouldIgnoreEvent(controller, event)) {
    return false
  }

  if (
    controller.rippleStartEvent &&
    controller.rippleStartEvent.pointerId !== event.pointerId
  ) {
    return false
  }

  if (eventKind === 'hover') {
    return !isTouch(event)
  }

  return isTouch(event) || event.buttons === 1
}

function setRippleHovered(controller: RippleController, hovered: boolean) {
  controller.hovered = hovered
  controller.root.classList.toggle('material-ripple--hovered', hovered)
}

function setRipplePressed(controller: RippleController, pressed: boolean) {
  controller.pressed = pressed
  controller.root.classList.toggle('material-ripple--pressed', pressed)
}

function syncRippleStateClasses(controller: RippleController) {
  controller.root.classList.toggle('material-ripple--hovered', controller.hovered)
  controller.root.classList.toggle('material-ripple--pressed', controller.pressed)
}

function determineRippleSize(controller: RippleController) {
  const { height, width } = controller.root.getBoundingClientRect()
  const maxDimension = Math.max(height, width)
  const softEdgeSize = Math.max(
    MATERIAL_RIPPLE_TIMING.softEdgeContainerRatio * maxDimension,
    MATERIAL_RIPPLE_TIMING.softEdgeMinimumSize,
  )
  const zoom = currentZoom(controller.root)
  const safeInitialSize = Math.max(
    1,
    Math.floor((maxDimension * MATERIAL_RIPPLE_TIMING.initialOriginScale) / zoom),
  )
  const hypotenuse = Math.sqrt(width ** 2 + height ** 2)
  const maxRadius = hypotenuse + MATERIAL_RIPPLE_TIMING.padding
  const maybeZoomedScale = (maxRadius + softEdgeSize) / safeInitialSize

  controller.initialSize = safeInitialSize
  controller.rippleSize = `${safeInitialSize}px`
  controller.rippleScale = `${maybeZoomedScale / zoom}`
}

function getNormalizedPointerEventCoords(
  controller: RippleController,
  pointerEvent: PointerEvent,
) {
  const { scrollX, scrollY } = window
  const { left, top } = controller.root.getBoundingClientRect()
  const documentX = scrollX + left
  const documentY = scrollY + top
  const zoom = currentZoom(controller.root)

  return {
    x: (pointerEvent.pageX - documentX) / zoom,
    y: (pointerEvent.pageY - documentY) / zoom,
  }
}

function getTranslationCoordinates(
  controller: RippleController,
  positionEvent?: Event,
) {
  const { height, width } = controller.root.getBoundingClientRect()
  const zoom = currentZoom(controller.root)
  const endPoint = {
    x: (width / zoom - controller.initialSize) / 2,
    y: (height / zoom - controller.initialSize) / 2,
  }
  let startPoint =
    positionEvent instanceof PointerEvent
      ? getNormalizedPointerEventCoords(controller, positionEvent)
      : { x: width / zoom / 2, y: height / zoom / 2 }

  if (controller.unbounded) {
    startPoint = { x: width / zoom / 2, y: height / zoom / 2 }
  }

  return {
    endPoint,
    startPoint: {
      x: startPoint.x - controller.initialSize / 2,
      y: startPoint.y - controller.initialSize / 2,
    },
  }
}

function clearMinimumPressTimeout(controller: RippleController) {
  if (controller.minimumPressTimeout !== null) {
    window.clearTimeout(controller.minimumPressTimeout)
    controller.minimumPressTimeout = null
  }
}

function setPressOpacityDuration(controller: RippleController, durationMs: number) {
  controller.root.style.setProperty('--material-ripple-press-opacity-duration', `${durationMs}ms`)
}

function startPressAnimation(controller: RippleController, positionEvent?: Event) {
  setPressOpacityDuration(controller, MATERIAL_RIPPLE_TIMING.pressFadeInMs)
  setRipplePressed(controller, true)
  controller.growAnimation?.cancel()
  determineRippleSize(controller)

  const { startPoint, endPoint } = getTranslationCoordinates(controller, positionEvent)
  const translateStart = `${startPoint.x}px, ${startPoint.y}px`
  const translateEnd = `${endPoint.x}px, ${endPoint.y}px`

  if (typeof controller.pressElement.animate !== 'function') {
    controller.pressElement.style.top = '0'
    controller.pressElement.style.left = '0'
    controller.pressElement.style.width = controller.rippleSize
    controller.pressElement.style.height = controller.rippleSize
    controller.pressElement.style.transform = `translate(${translateEnd}) scale(${controller.rippleScale})`
    controller.growAnimation = undefined
    return
  }

  controller.growAnimation = controller.pressElement.animate(
    {
      top: [0, 0],
      left: [0, 0],
      height: [controller.rippleSize, controller.rippleSize],
      width: [controller.rippleSize, controller.rippleSize],
      transform: [
        `translate(${translateStart}) scale(1)`,
        `translate(${translateEnd}) scale(${controller.rippleScale})`,
      ],
    },
    {
      duration: MATERIAL_RIPPLE_TIMING.pressGrowMs,
      easing: STANDARD_EASING,
      fill: ANIMATION_FILL,
    },
  )
}

function finishPressAnimation(controller: RippleController, animation?: Animation) {
  if (animation && controller.growAnimation !== animation) {
    return
  }

  setPressOpacityDuration(controller, MATERIAL_RIPPLE_TIMING.pressFadeOutMs)
  setRipplePressed(controller, false)
}

function endPressAnimation(controller: RippleController) {
  controller.rippleStartEvent = undefined
  controller.state = RippleState.Inactive
  clearMinimumPressTimeout(controller)

  const animation = controller.growAnimation
  const elapsedMs = typeof animation?.currentTime === 'number' ? animation.currentTime : 0
  const remainingMs = MATERIAL_RIPPLE_TIMING.minimumPressMs - elapsedMs

  if (remainingMs <= 0) {
    finishPressAnimation(controller, animation)
    return
  }

  controller.minimumPressTimeout = window.setTimeout(() => {
    controller.minimumPressTimeout = null
    finishPressAnimation(controller, animation)
  }, remainingMs)
}

function handleRipplePointerOver(event: PointerEvent) {
  const controller = findRippleController(event)

  if (
    !controller ||
    controller.control.contains(event.relatedTarget as Node | null) ||
    !shouldReactToPointerEvent(controller, event, 'hover')
  ) {
    return
  }

  setRippleHovered(controller, true)
}

function handleRipplePointerOut(event: PointerEvent) {
  const controller = findRippleController(event)

  if (
    !controller ||
    controller.control.contains(event.relatedTarget as Node | null) ||
    !shouldReactToPointerEvent(controller, event, 'hover')
  ) {
    return
  }

  setRippleHovered(controller, false)

  if (controller.state !== RippleState.Inactive) {
    endPressAnimation(controller)
  }
}

function handleRipplePointerUp(event: PointerEvent) {
  const controller = findRippleController(event)

  if (!controller || !shouldReactToPointerEvent(controller, event, 'press')) {
    return
  }

  if (controller.state === RippleState.Holding) {
    controller.state = RippleState.WaitingForClick
    return
  }

  if (controller.state === RippleState.TouchDelay) {
    controller.state = RippleState.WaitingForClick
    startPressAnimation(controller, controller.rippleStartEvent)
  }
}

function handleRipplePointerDown(event: PointerEvent) {
  const controller = findRippleController(event)

  if (!controller || !shouldReactToPointerEvent(controller, event, 'press')) {
    return
  }

  clearMinimumPressTimeout(controller)
  controller.rippleStartEvent = event

  if (!isTouch(event)) {
    controller.state = RippleState.WaitingForClick
    startPressAnimation(controller, event)
    return
  }

  controller.state = RippleState.TouchDelay

  if (controller.touchDelayTimeout !== null) {
    window.clearTimeout(controller.touchDelayTimeout)
  }

  controller.touchDelayTimeout = window.setTimeout(() => {
    controller.touchDelayTimeout = null

    if (controller.state !== RippleState.TouchDelay) {
      return
    }

    controller.state = RippleState.Holding
    startPressAnimation(controller, event)
  }, MATERIAL_RIPPLE_TIMING.touchDelayMs)
}

function handleRippleClick(event: Event) {
  const controller = findRippleController(event)

  if (
    !controller ||
    controller.disabled ||
    isControlDisabled(controller.control) ||
    shouldIgnoreEvent(controller, event)
  ) {
    return
  }

  if (controller.state === RippleState.WaitingForClick) {
    endPressAnimation(controller)
    return
  }

  if (controller.state === RippleState.Inactive) {
    startPressAnimation(controller)
    endPressAnimation(controller)
  }
}

function handleRipplePointerCancel(event: PointerEvent) {
  const controller = findRippleController(event)

  if (!controller || !shouldReactToPointerEvent(controller, event, 'press')) {
    return
  }

  endPressAnimation(controller)
}

function handleRippleContextMenu(event: Event) {
  const controller = findRippleController(event)

  if (!controller || controller.disabled || isControlDisabled(controller.control)) {
    return
  }

  endPressAnimation(controller)
}

function ensureRippleDocumentListeners(document: Document) {
  if (registeredRippleDocument === document) {
    return
  }

  registeredRippleDocument = document
  document.addEventListener('click', handleRippleClick)
  document.addEventListener('contextmenu', handleRippleContextMenu)
  document.addEventListener('pointercancel', handleRipplePointerCancel)
  document.addEventListener('pointerdown', handleRipplePointerDown)
  document.addEventListener('pointerout', handleRipplePointerOut)
  document.addEventListener('pointerover', handleRipplePointerOver)
  document.addEventListener('pointerup', handleRipplePointerUp)
}

function removeRippleDocumentListeners() {
  if (!registeredRippleDocument) {
    return
  }

  registeredRippleDocument.removeEventListener('click', handleRippleClick)
  registeredRippleDocument.removeEventListener('contextmenu', handleRippleContextMenu)
  registeredRippleDocument.removeEventListener('pointercancel', handleRipplePointerCancel)
  registeredRippleDocument.removeEventListener('pointerdown', handleRipplePointerDown)
  registeredRippleDocument.removeEventListener('pointerout', handleRipplePointerOut)
  registeredRippleDocument.removeEventListener('pointerover', handleRipplePointerOver)
  registeredRippleDocument.removeEventListener('pointerup', handleRipplePointerUp)
  registeredRippleDocument = null
}

function cleanupRippleController(controller: RippleController) {
  setRippleHovered(controller, false)
  setRipplePressed(controller, false)

  if (controller.touchDelayTimeout !== null) {
    window.clearTimeout(controller.touchDelayTimeout)
    controller.touchDelayTimeout = null
  }

  clearMinimumPressTimeout(controller)
  controller.growAnimation?.cancel()
  controller.rippleStartEvent = undefined
  controller.state = RippleState.Inactive
}

export function MaterialRipple({
  active = false,
  activeState = 'hover',
  className,
  disabled = false,
  ignoreSelector,
  unbounded = false,
}: MaterialRippleProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const pressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const rootElement = rootRef.current
    const pressElementRef = pressRef.current
    const parentElement = rootElement?.parentElement

    if (!rootElement || !pressElementRef || !(parentElement instanceof HTMLElement)) {
      return
    }

    const existingController = rippleControllers.get(parentElement)
    const controller =
      existingController ??
      ({
        control: parentElement,
        disabled,
        hovered: false,
        ignoreSelector,
        initialSize: 0,
        minimumPressTimeout: null,
        pressElement: pressElementRef,
        pressed: false,
        rippleScale: '',
        rippleSize: '',
        root: rootElement,
        state: RippleState.Inactive,
        touchDelayTimeout: null,
        unbounded,
      } satisfies RippleController)

    controller.disabled = disabled
    controller.ignoreSelector = ignoreSelector
    controller.pressElement = pressElementRef
    controller.root = rootElement
    controller.unbounded = unbounded
    syncRippleStateClasses(controller)

    if (!existingController) {
      rippleControllers.set(parentElement, controller)
      registeredRippleControllerCount += 1
      ensureRippleDocumentListeners(parentElement.ownerDocument)
    }

    return () => {
      if (rippleControllers.get(parentElement) === controller) {
        rippleControllers.delete(parentElement)
        cleanupRippleController(controller)
        registeredRippleControllerCount = Math.max(0, registeredRippleControllerCount - 1)

        if (registeredRippleControllerCount === 0) {
          removeRippleDocumentListeners()
        }
      }
    }
  }, [disabled, ignoreSelector, unbounded])

  const rippleClassName = [
    'material-ripple',
    unbounded ? 'material-ripple--unbounded' : '',
    active ? `material-ripple--active-${activeState}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      className={rippleClassName}
      data-material-ripple
      data-material-ripple-disabled={disabled ? 'true' : undefined}
    >
      <span className="material-ripple__surface">
        <span ref={pressRef} className="material-ripple__press" />
      </span>
    </span>
  )
}
