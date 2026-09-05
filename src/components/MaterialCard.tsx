import {
  createElement,
  forwardRef,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type DragEventHandler,
  type ElementType,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react'

import { MaterialRipple } from './MaterialRipple'
import './MaterialCard.css'

export type MaterialCardVariant = 'elevated' | 'filled' | 'outlined'
export type MaterialCardCheckedIconPosition =
  | 'bottom-end'
  | 'bottom-start'
  | 'top-end'
  | 'top-start'
export type MaterialCardContainerElement = 'article' | 'div' | 'li' | 'section'

export type MaterialCardStyle = CSSProperties & {
  '--md-card-checked-icon-color'?: string
  '--md-card-checked-icon-margin'?: string
  '--md-card-checked-outline-color'?: string
  '--md-card-checked-state-layer-color'?: string
  '--md-card-checked-state-layer-opacity'?: number | string
  '--md-card-container-color'?: string
  '--md-card-container-shape'?: string
  '--md-card-content-color'?: string
  '--md-card-content-padding'?: string
  '--md-card-disabled-checked-icon-color'?: string
  '--md-card-disabled-container-color'?: string
  '--md-card-disabled-content-color'?: string
  '--md-card-disabled-elevation'?: string
  '--md-card-disabled-outline-color'?: string
  '--md-card-dragged-elevation'?: string
  '--md-card-dragged-state-layer-opacity'?: number | string
  '--md-card-focus-elevation'?: string
  '--md-card-focus-indicator-color'?: string
  '--md-card-focus-indicator-offset'?: string
  '--md-card-focus-indicator-thickness'?: string
  '--md-card-focus-state-layer-opacity'?: number | string
  '--md-card-focused-outline-color'?: string
  '--md-card-hover-elevation'?: string
  '--md-card-hover-state-layer-opacity'?: number | string
  '--md-card-icon-size'?: string
  '--md-card-outline-color'?: string
  '--md-card-outline-width'?: string
  '--md-card-pressed-elevation'?: string
  '--md-card-pressed-state-layer-opacity'?: number | string
  '--md-card-state-layer-color'?: string
  '--md-card-elevation'?: string
}

export type MaterialCardProps = Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'onClick' | 'onDragEnd' | 'onDragStart' | 'style'
> & {
  /** Semantic element used for a non-actionable card. Actionable cards use a button or link. */
  as?: MaterialCardContainerElement
  children: ReactNode
  /** Enables Android MaterialCardView-style controlled selection. */
  checkable?: boolean
  checked?: boolean
  checkedIcon?: ReactNode
  checkedIconPosition?: MaterialCardCheckedIconPosition
  /** Optional content inset. Android's Card container itself has no default inset. */
  contentPadding?: CSSProperties['padding']
  disabled?: boolean
  /** Controlled visual dragged state. Native drag behavior stays with the consumer. */
  dragged?: boolean
  download?: AnchorHTMLAttributes<HTMLAnchorElement>['download']
  href?: string
  hrefLang?: string
  onCheckedChange?: (checked: boolean) => void
  onClick?: MouseEventHandler<HTMLElement>
  onDraggedChange?: (dragged: boolean) => void
  onDragEnd?: DragEventHandler<HTMLElement>
  onDragStart?: DragEventHandler<HTMLElement>
  ping?: string
  referrerPolicy?: AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
  rel?: string
  style?: MaterialCardStyle
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  type?: 'button' | 'reset' | 'submit'
  variant?: MaterialCardVariant
}

function cssLength(value: CSSProperties['padding']) {
  return typeof value === 'number' ? `${value}px` : value
}

function DefaultCheckedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z" />
    </svg>
  )
}

export const MaterialCard = forwardRef<HTMLElement, MaterialCardProps>(
  function MaterialCard(
    {
      as = 'div',
      checkable = false,
      checked = false,
      checkedIcon,
      checkedIconPosition = 'top-end',
      children,
      className,
      contentPadding,
      disabled = false,
      dragged = false,
      download,
      href,
      hrefLang,
      onCheckedChange,
      onClick,
      onDragEnd,
      onDraggedChange,
      onDragStart,
      ping,
      referrerPolicy,
      rel,
      role,
      style,
      tabIndex,
      target,
      type = 'button',
      variant = 'filled',
      ...htmlProps
    },
    ref,
  ) {
    const interactive = href !== undefined || onClick !== undefined || checkable
    const Component: ElementType = href !== undefined ? 'a' : interactive ? 'button' : as
    const ContentComponent = Component === 'button' ? 'span' : 'div'
    const checkedAriaRole =
      role === 'checkbox' ||
      role === 'menuitemcheckbox' ||
      role === 'menuitemradio' ||
      role === 'radio'
    const cardStyle: MaterialCardStyle = { ...style }

    if (contentPadding !== undefined) {
      cardStyle['--md-card-content-padding'] = cssLength(contentPadding)
    }

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      if (disabled) {
        event.preventDefault()
        return
      }

      onClick?.(event)

      if (checkable && !event.defaultPrevented) {
        onCheckedChange?.(!checked)
      }
    }

    const handleDragStart: DragEventHandler<HTMLElement> = (event) => {
      onDragStart?.(event)

      if (!event.defaultPrevented && !disabled) {
        onDraggedChange?.(true)
      }
    }

    const handleDragEnd: DragEventHandler<HTMLElement> = (event) => {
      onDragEnd?.(event)
      onDraggedChange?.(false)
    }

    const elementProps = {
      ...htmlProps,
      ref,
      className: ['material-card', className].filter(Boolean).join(' '),
      role,
      style: cardStyle,
      tabIndex: href !== undefined && disabled ? -1 : tabIndex,
      onClick: interactive ? handleClick : undefined,
      onDragEnd: handleDragEnd,
      onDragStart: handleDragStart,
      'aria-checked': checkable && checkedAriaRole ? checked : htmlProps['aria-checked'],
      'aria-disabled': href !== undefined && disabled ? true : htmlProps['aria-disabled'],
      'aria-pressed': checkable && !checkedAriaRole ? checked : htmlProps['aria-pressed'],
      'data-checked': checkable ? (checked ? 'true' : 'false') : undefined,
      'data-checkable': checkable ? 'true' : undefined,
      'data-disabled': disabled ? 'true' : undefined,
      'data-dragged': dragged ? 'true' : undefined,
      'data-interactive': interactive ? 'true' : undefined,
      'data-material-card': '',
      'data-variant': variant,
      disabled: Component === 'button' ? disabled : undefined,
      download: Component === 'a' ? download : undefined,
      href: Component === 'a' && !disabled ? href : undefined,
      hrefLang: Component === 'a' ? hrefLang : undefined,
      ping: Component === 'a' ? ping : undefined,
      referrerPolicy: Component === 'a' ? referrerPolicy : undefined,
      rel: Component === 'a' ? rel : undefined,
      target: Component === 'a' ? target : undefined,
      type: Component === 'button' ? type : undefined,
    }

    return createElement(
      Component,
      elementProps as never,
      <>
        {interactive ? (
          <MaterialRipple
            active={dragged}
            activeState="hover"
            disabled={disabled}
          />
        ) : null}
        <ContentComponent className="material-card__content">{children}</ContentComponent>
        {checkable ? (
          <span
            className="material-card__checked-icon"
            data-position={checkedIconPosition}
            aria-hidden="true"
          >
            {checkedIcon ?? <DefaultCheckedIcon />}
          </span>
        ) : null}
      </>,
    )
  },
)
