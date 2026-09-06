import {
  createElement,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type DragEventHandler,
  type FocusEventHandler,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react'

import { MaterialRipple } from './MaterialRipple'
import './MaterialChip.css'

export type MaterialChipKind = 'assist' | 'filter' | 'input' | 'suggestion'
export type MaterialChipShapeMode = 'expressive' | 'standard'
export type MaterialChipTouchTarget = 'none' | 'wrapper'

export type MaterialChipStyle = CSSProperties & {
  '--md-chip-avatar-shape'?: string
  '--md-chip-avatar-size'?: string
  '--md-chip-container-color'?: string
  '--md-chip-container-height'?: string
  '--md-chip-container-shape'?: string
  '--md-chip-disabled-container-color'?: string
  '--md-chip-disabled-container-opacity'?: number | string
  '--md-chip-disabled-content-color'?: string
  '--md-chip-disabled-content-opacity'?: number | string
  '--md-chip-disabled-outline-color'?: string
  '--md-chip-disabled-outline-opacity'?: number | string
  '--md-chip-dragged-elevation'?: string
  '--md-chip-element-space'?: string
  '--md-chip-elevation'?: string
  '--md-chip-focus-elevation'?: string
  '--md-chip-focus-indicator-color'?: string
  '--md-chip-focus-indicator-offset'?: string
  '--md-chip-focus-indicator-thickness'?: string
  '--md-chip-focus-leading-icon-color'?: string
  '--md-chip-focus-outline-color'?: string
  '--md-chip-focus-trailing-icon-color'?: string
  '--md-chip-hover-elevation'?: string
  '--md-chip-hover-leading-icon-color'?: string
  '--md-chip-hover-state-layer-color'?: string
  '--md-chip-hover-state-layer-opacity'?: number | string
  '--md-chip-hover-trailing-icon-color'?: string
  '--md-chip-icon-size'?: string
  '--md-chip-label-color'?: string
  '--md-chip-label-font'?: string
  '--md-chip-label-line-height'?: string
  '--md-chip-label-size'?: string
  '--md-chip-label-tracking'?: string
  '--md-chip-label-weight'?: number | string
  '--md-chip-leading-icon-color'?: string
  '--md-chip-outline-color'?: string
  '--md-chip-outline-width'?: string
  '--md-chip-pressed-elevation'?: string
  '--md-chip-pressed-leading-icon-color'?: string
  '--md-chip-pressed-shape'?: string
  '--md-chip-pressed-state-layer-color'?: string
  '--md-chip-pressed-state-layer-opacity'?: number | string
  '--md-chip-pressed-trailing-icon-color'?: string
  '--md-chip-selected-container-color'?: string
  '--md-chip-selected-container-shape'?: string
  '--md-chip-selected-label-color'?: string
  '--md-chip-selected-leading-icon-color'?: string
  '--md-chip-selected-outline-width'?: string
  '--md-chip-selected-state-layer-color'?: string
  '--md-chip-selected-trailing-icon-color'?: string
  '--md-chip-touch-target-height'?: string
  '--md-chip-trailing-icon-color'?: string
}

export type MaterialChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'onClick' | 'onDragEnd' | 'onDragStart' | 'style'
> & {
  avatar?: ReactNode
  children: ReactNode
  className?: string
  download?: AnchorHTMLAttributes<HTMLAnchorElement>['download']
  dragged?: boolean
  elevated?: boolean
  href?: string
  hrefLang?: string
  kind?: MaterialChipKind
  leadingIcon?: ReactNode
  onClick?: MouseEventHandler<HTMLElement>
  onDragEnd?: DragEventHandler<HTMLElement>
  onDraggedChange?: (dragged: boolean) => void
  onDragStart?: DragEventHandler<HTMLElement>
  onRemove?: MouseEventHandler<HTMLButtonElement>
  onSelectedChange?: (selected: boolean) => void
  ping?: string
  referrerPolicy?: AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
  rel?: string
  removable?: boolean
  removeAriaLabel?: string
  removeIcon?: ReactNode
  /** Renders only the label and trailing remove action. Intended for input chips. */
  removeOnly?: boolean
  selected?: boolean
  selectedIcon?: ReactNode
  shapeMode?: MaterialChipShapeMode
  showSelectedIcon?: boolean
  softDisabled?: boolean
  style?: MaterialChipStyle
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  touchTarget?: MaterialChipTouchTarget
  trailingIcon?: ReactNode
}

export type MaterialChipElement = HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement

function DefaultSelectedIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M6.75 12.13 3.62 9l-1.06 1.06 4.19 4.19 9-9-1.06-1.06-7.94 7.94Z" />
    </svg>
  )
}

function DefaultRemoveIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="m4.28 14.78-1.06-1.06L7.94 9 3.22 4.28l1.06-1.06L9 7.94l4.72-4.72 1.06 1.06L10.06 9l4.72 4.72-1.06 1.06L9 10.06l-4.72 4.72Z" />
    </svg>
  )
}

export const MaterialChip = forwardRef<MaterialChipElement, MaterialChipProps>(
  function MaterialChip(
    {
      avatar,
      children,
      className,
      disabled = false,
      download,
      dragged = false,
      elevated = false,
      href,
      hrefLang,
      kind = 'assist',
      leadingIcon,
      onClick,
      onDragEnd,
      onDraggedChange,
      onDragStart,
      onRemove,
      onSelectedChange,
      ping,
      referrerPolicy,
      rel,
      removable = false,
      removeAriaLabel,
      removeIcon,
      removeOnly = false,
      selected = false,
      selectedIcon,
      shapeMode = 'standard',
      showSelectedIcon,
      softDisabled = false,
      style,
      tabIndex,
      target,
      touchTarget = 'wrapper',
      trailingIcon,
      type = 'button',
      ...actionProps
    },
    ref,
  ) {
    const labelId = useId()
    const removeLabelId = useId()
    const selectable = kind === 'filter' || kind === 'input'
    const isElevated = elevated && kind !== 'input'
    const isDisabled = disabled || softDisabled
    const hasAvatar = kind === 'input' && avatar !== undefined
    const selectedIconVisible = showSelectedIcon ?? kind === 'filter'
    const selectionIcon = selectedIcon ?? <DefaultSelectedIcon />
    const hasLeading =
      hasAvatar ||
      (!hasAvatar && leadingIcon !== undefined) ||
      (selectable && selected && selectedIconVisible)
    const hasTrailing = trailingIcon !== undefined
    const hasRemoveAction = removable || removeOnly || onRemove !== undefined

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      if (isDisabled || removeOnly) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      onClick?.(event)

      if (selectable && !event.defaultPrevented) {
        onSelectedChange?.(!selected)
      }
    }

    const handleDragStart: DragEventHandler<HTMLElement> = (event) => {
      onDragStart?.(event)
      if (!event.defaultPrevented && !isDisabled) {
        onDraggedChange?.(true)
      }
    }

    const handleDragEnd: DragEventHandler<HTMLElement> = (event) => {
      onDragEnd?.(event)
      onDraggedChange?.(false)
    }

    const handleRemove: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.stopPropagation()
      if (isDisabled) {
        event.preventDefault()
        return
      }
      onRemove?.(event)
    }

    const primaryContent = (
      <>
        {!removeOnly ? (
          <MaterialRipple
            active={dragged}
            activeState="hover"
            disabled={isDisabled}
          />
        ) : null}
        <span className="material-chip__touch-target" aria-hidden="true" />
        <span className="material-chip__content">
          {hasAvatar ? (
            <span className="material-chip__avatar" aria-hidden="true">
              {avatar}
            </span>
          ) : leadingIcon !== undefined || (selectable && selectedIconVisible) ? (
            <span className="material-chip__leading-icon" aria-hidden="true">
              {leadingIcon !== undefined ? (
                <span className="material-chip__leading-icon-default">{leadingIcon}</span>
              ) : null}
              {selectable && selectedIconVisible ? (
                <span className="material-chip__leading-icon-selected">{selectionIcon}</span>
              ) : null}
            </span>
          ) : null}
          <span id={labelId} className="material-chip__label">{children}</span>
          {hasTrailing ? (
            <span className="material-chip__trailing-icon" aria-hidden="true">
              {trailingIcon}
            </span>
          ) : null}
        </span>
      </>
    )

    const sharedPrimaryProps = {
      ...actionProps,
      ref,
      className: 'material-chip__primary',
      onClick: handleClick,
      onDragEnd: handleDragEnd,
      onDragStart: handleDragStart,
      tabIndex,
      'aria-disabled': softDisabled || (href !== undefined && disabled) ? true : undefined,
      'aria-pressed': selectable ? selected : actionProps['aria-pressed'],
      'data-material-chip-primary': '',
    }

    let primaryAction: ReactNode

    if (removeOnly) {
      primaryAction = createElement(
        'span',
        {
          ref,
          className: 'material-chip__primary material-chip__primary--static',
          'data-material-chip-primary': '',
        },
        primaryContent,
      )
    } else if (href !== undefined) {
      primaryAction = createElement(
        'a',
        {
          ...sharedPrimaryProps,
          download,
          href: disabled ? undefined : href,
          hrefLang,
          ping,
          referrerPolicy,
          rel,
          target,
          tabIndex: disabled ? -1 : tabIndex,
        } as never,
        primaryContent,
      )
    } else {
      primaryAction = createElement(
        'button',
        {
          ...sharedPrimaryProps,
          disabled: disabled && !softDisabled,
          type,
        } as never,
        primaryContent,
      )
    }

    const accessibleLabel =
      typeof actionProps['aria-label'] === 'string'
        ? actionProps['aria-label']
        : typeof children === 'string'
          ? children
          : undefined

    return (
      <span
        className={['material-chip', className].filter(Boolean).join(' ')}
        data-avatar={hasAvatar ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        data-dragged={dragged ? 'true' : undefined}
        data-elevated={isElevated ? 'true' : undefined}
        data-has-leading={hasLeading ? 'true' : undefined}
        data-has-trailing={hasTrailing ? 'true' : undefined}
        data-kind={kind}
        data-material-chip=""
        data-removable={hasRemoveAction ? 'true' : undefined}
        data-remove-only={removeOnly ? 'true' : undefined}
        data-selected={selectable ? (selected ? 'true' : 'false') : undefined}
        data-shape-mode={selectable ? shapeMode : undefined}
        data-soft-disabled={softDisabled ? 'true' : undefined}
        data-touch-target={touchTarget}
        style={style}
      >
        {primaryAction}
        {hasRemoveAction ? (
          <>
            {!removeAriaLabel && !accessibleLabel ? (
              <span id={removeLabelId} hidden>Remove</span>
            ) : null}
            <button
              type="button"
              className="material-chip__remove"
              aria-label={removeAriaLabel ?? (accessibleLabel ? `Remove ${accessibleLabel}` : undefined)}
              aria-labelledby={!removeAriaLabel && !accessibleLabel ? `${removeLabelId} ${labelId}` : undefined}
              disabled={disabled && !softDisabled}
              aria-disabled={softDisabled || undefined}
              data-material-chip-remove=""
              tabIndex={removeOnly ? (tabIndex ?? 0) : -1}
              onClick={handleRemove}
            >
              <MaterialRipple unbounded disabled={isDisabled} />
              <span className="material-chip__remove-touch-target" aria-hidden="true" />
              <span className="material-chip__remove-icon" aria-hidden="true">
                {removeIcon ?? <DefaultRemoveIcon />}
              </span>
            </button>
          </>
        ) : null}
      </span>
    )
  },
)

export type MaterialAssistChipProps = Omit<
  MaterialChipProps,
  | 'avatar'
  | 'kind'
  | 'onRemove'
  | 'onSelectedChange'
  | 'removable'
  | 'removeAriaLabel'
  | 'removeIcon'
  | 'removeOnly'
  | 'selected'
  | 'selectedIcon'
  | 'shapeMode'
  | 'showSelectedIcon'
>

export type MaterialSuggestionChipProps = Omit<
  MaterialAssistChipProps,
  'trailingIcon'
>

export type MaterialFilterChipProps = Omit<
  MaterialChipProps,
  'avatar' | 'kind' | 'removeOnly'
>

export type MaterialInputChipProps = Omit<MaterialChipProps, 'elevated' | 'kind'>

export const MaterialAssistChip = forwardRef<MaterialChipElement, MaterialAssistChipProps>(
  function MaterialAssistChip(props, ref) {
    return <MaterialChip {...props} ref={ref} kind="assist" />
  },
)

export const MaterialFilterChip = forwardRef<MaterialChipElement, MaterialFilterChipProps>(
  function MaterialFilterChip(props, ref) {
    return <MaterialChip {...props} ref={ref} kind="filter" />
  },
)

export const MaterialInputChip = forwardRef<MaterialChipElement, MaterialInputChipProps>(
  function MaterialInputChip(props, ref) {
    return <MaterialChip {...props} ref={ref} kind="input" />
  },
)

export const MaterialSuggestionChip = forwardRef<MaterialChipElement, MaterialSuggestionChipProps>(
  function MaterialSuggestionChip(props, ref) {
    return <MaterialChip {...props} ref={ref} kind="suggestion" />
  },
)

export type MaterialChipSetProps = Omit<HTMLAttributes<HTMLDivElement>, 'onKeyDown'> & {
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
}

function chipsInSet(root: HTMLDivElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-material-chip]')).filter(
    (chip) => chip.closest('[data-material-chip-set]') === root,
  )
}

function chipActions(chip: HTMLElement) {
  return Array.from(
    chip.querySelectorAll<HTMLElement>('[data-material-chip-primary], [data-material-chip-remove]'),
  ).filter((action) => action.matches('a[href], button:not(:disabled), [data-remove-only]'))
}

function chipCanReceiveFocus(chip: HTMLElement) {
  return chip.dataset.disabled !== 'true' || chip.dataset.softDisabled === 'true'
}

function updateChipSetTabStops(root: HTMLDivElement) {
  const chips = chipsInSet(root)
  const focusedChip = chips.find((chip) => chip.contains(root.ownerDocument.activeElement))
  const targetChip = focusedChip ?? chips.find(chipCanReceiveFocus)

  for (const chip of chips) {
    for (const action of chipActions(chip)) {
      action.tabIndex = -1
    }
  }

  if (!targetChip) return
  const actions = chipActions(targetChip)
  const focusedAction = actions.find((action) => action === root.ownerDocument.activeElement)
  const targetAction = focusedAction ?? actions[0]
  if (targetAction) targetAction.tabIndex = 0
}

export const MaterialChipSet = forwardRef<HTMLDivElement, MaterialChipSetProps>(
  function MaterialChipSet(
    { children, className, onFocusCapture, onKeyDown, role = 'toolbar', ...htmlProps },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLDivElement)

    useEffect(() => {
      if (localRef.current) updateChipSetTabStops(localRef.current)
    }, [children])

    const handleFocusCapture: FocusEventHandler<HTMLDivElement> = (event) => {
      if (localRef.current) updateChipSetTabStops(localRef.current)
      onFocusCapture?.(event)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return

      const isLeft = event.key === 'ArrowLeft'
      const isRight = event.key === 'ArrowRight'
      const isHome = event.key === 'Home'
      const isEnd = event.key === 'End'
      if (!isLeft && !isRight && !isHome && !isEnd) return

      const root = localRef.current
      const target = event.target
      if (!root || !(target instanceof HTMLElement)) return

      const chips = chipsInSet(root).filter(chipCanReceiveFocus)
      if (chips.length === 0) return

      event.preventDefault()
      const rtl = getComputedStyle(root).direction === 'rtl'
      const forwards = isHome ? true : isEnd ? false : rtl ? isLeft : isRight
      const currentChip = target.closest<HTMLElement>('[data-material-chip]')
      const currentIndex = currentChip ? chips.indexOf(currentChip) : -1

      if (currentChip && !isHome && !isEnd) {
        const actions = chipActions(currentChip)
        const actionIndex = actions.indexOf(target)
        const nextActionIndex = forwards ? actionIndex + 1 : actionIndex - 1
        if (nextActionIndex >= 0 && nextActionIndex < actions.length) {
          actions[nextActionIndex].focus()
          updateChipSetTabStops(root)
          return
        }
      }

      const nextChip = isHome
        ? chips[0]
        : isEnd
          ? chips[chips.length - 1]
          : chips[(currentIndex + (forwards ? 1 : -1) + chips.length) % chips.length]
      const actions = chipActions(nextChip)
      const nextAction = forwards ? actions[0] : actions[actions.length - 1]
      nextAction?.focus()
      updateChipSetTabStops(root)
    }

    return (
      <div
        {...htmlProps}
        ref={localRef}
        role={role}
        className={['material-chip-set', className].filter(Boolean).join(' ')}
        data-material-chip-set=""
        onFocusCapture={handleFocusCapture}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    )
  },
)
