import {
  cloneElement,
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react'

import {
  MaterialListItem,
  type MaterialListItemProps,
} from './MaterialList'
import { MaterialRipple } from './MaterialRipple'
import './MaterialListSwipeActions.css'

export type MaterialListSwipeDirection = 'end' | 'start'

export type MaterialListSwipeActionsProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> & {
  actions: ReactNode
  actionsLabel: string
  children: ReactElement<MaterialListItemProps, typeof MaterialListItem>
  direction?: MaterialListSwipeDirection
  disabled?: boolean
  onRevealedChange: (revealed: boolean) => void
  revealButtonLabel?: string
  revealDistance?: number
  revealed: boolean
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}

export const MaterialListSwipeActions = forwardRef<
  HTMLDivElement,
  MaterialListSwipeActionsProps
>(function MaterialListSwipeActions(
  {
    actions,
    actionsLabel,
    children,
    className,
    direction = 'end',
    disabled = false,
    onRevealedChange,
    revealButtonLabel = 'Show actions',
    revealDistance = 144,
    revealed,
    style,
    ...divProps
  },
  ref,
) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const pointer = useRef<{
    id: number
    originX: number
    originY: number
    startOffset: number
  } | null>(null)
  const [dragOffset, setDragOffset] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const getSign = () => {
    const rtl = rootRef.current
      ? getComputedStyle(rootRef.current).direction === 'rtl'
      : false
    return direction === 'end' ? (rtl ? 1 : -1) : rtl ? -1 : 1
  }

  const restingOffset = (revealed ? revealDistance : 0) * getSign()
  const offset = dragOffset ?? restingOffset

  useEffect(() => {
    const actionContainer = actionsRef.current
    if (!actionContainer) return

    if (revealed) actionContainer.removeAttribute('inert')
    else actionContainer.setAttribute('inert', '')

    actionContainer
      .querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]')
      .forEach((element) => {
        element.dataset.materialListSecondary = ''
        element.tabIndex = -1
      })
  }, [actions, revealed])

  const assignRef = (node: HTMLDivElement | null) => {
    rootRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (disabled || !event.isPrimary || event.button !== 0) return
    const target = event.target instanceof Element ? event.target : null
    const independentAction = target?.closest(
      'button:not([data-material-list-primary]), a:not([data-material-list-primary]), input, select, textarea, [data-material-list-secondary]',
    )
    if (independentAction) return

    pointer.current = {
      id: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startOffset: restingOffset,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const gesture = pointer.current
    if (!gesture || gesture.id !== event.pointerId) return

    const deltaX = event.clientX - gesture.originX
    const deltaY = event.clientY - gesture.originY
    if (!dragging && Math.abs(deltaX) < 6) return
    if (!dragging && Math.abs(deltaY) > Math.abs(deltaX)) {
      pointer.current = null
      return
    }

    setDragging(true)
    const sign = getSign()
    const rawOffset = gesture.startOffset + deltaX
    const directionalOffset = rawOffset * sign
    const clamped = directionalOffset < 0
      ? Math.max(-16, directionalOffset * 0.2)
      : directionalOffset > revealDistance
        ? revealDistance + Math.min(16, (directionalOffset - revealDistance) * 0.2)
        : directionalOffset
    setDragOffset(clamped * sign)
  }

  const finishGesture = (pointerId: number) => {
    const gesture = pointer.current
    if (!gesture || gesture.id !== pointerId) return
    const sign = getSign()
    const directionalOffset = (dragOffset ?? restingOffset) * sign
    const shouldReveal = directionalOffset >= revealDistance * 0.35

    pointer.current = null
    setDragging(false)
    setDragOffset(null)
    if (shouldReveal !== revealed) onRevealedChange(shouldReveal)
  }

  const originalTrailing = children.props.trailing
  const trailing = (
    <span className="material-list-swipe__trailing">
      {originalTrailing}
      <button
        aria-expanded={revealed}
        aria-label={revealed ? 'Hide actions' : revealButtonLabel}
        className="material-list-swipe__toggle"
        data-material-list-secondary=""
        disabled={disabled}
        type="button"
        onClick={() => onRevealedChange(!revealed)}
      >
        <MaterialRipple disabled={disabled} unbounded />
        <span aria-hidden="true"><MoreIcon /></span>
      </button>
    </span>
  )

  return (
    <div
      {...divProps}
      ref={assignRef}
      className={['material-list-swipe', className].filter(Boolean).join(' ')}
      data-direction={direction}
      data-dragging={dragging ? 'true' : undefined}
      data-material-list-swipe=""
      data-revealed={revealed ? 'true' : 'false'}
      style={{
        ...style,
        '--md-list-swipe-distance': `${revealDistance}px`,
      } as CSSProperties}
      onPointerCancel={(event) => finishGesture(event.pointerId)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => finishGesture(event.pointerId)}
    >
      <div
        ref={actionsRef}
        aria-hidden={revealed ? undefined : true}
        aria-label={actionsLabel}
        className="material-list-swipe__actions"
        data-material-list-swipe-actions=""
        role="group"
      >
        {actions}
      </div>
      <div
        className="material-list-swipe__foreground"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {cloneElement(children, {
          disabled: disabled || children.props.disabled,
          trailing,
          trailingType: 'control',
        })}
      </div>
    </div>
  )
})
