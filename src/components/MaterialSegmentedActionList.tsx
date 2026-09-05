import {
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { MaterialRipple } from './MaterialRipple'
import { MaterialSwitch } from './MaterialSwitch'
import './MaterialSegmentedActionList.css'

export type MaterialSegmentedAction = {
  ariaLabel?: string
  disabled?: boolean
  id: string
  label: ReactNode
  leading?: ReactNode
  leadingType?: 'avatar' | 'icon' | 'image'
  supportingIcon?: ReactNode
  supportingText?: ReactNode
  trailing?: ReactNode
  trailingSwitch?: {
    ariaLabel: string
    checked: boolean
    onChange: (checked: boolean) => void
  }
}

export type MaterialSegmentedActionListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  activeId?: string
  actions: readonly MaterialSegmentedAction[]
  ariaLabel: string
  onAction: (action: MaterialSegmentedAction) => void
  onActionPointerMove?: (action: MaterialSegmentedAction) => void
  optionIdPrefix?: string
  registerAction?: (actionId: string, element: HTMLButtonElement | null) => void
}

function labelText(label: ReactNode) {
  return typeof label === 'string' || typeof label === 'number' ? String(label) : undefined
}

export function MaterialSegmentedActionList({
  actions,
  activeId,
  ariaLabel,
  className,
  onAction,
  onActionPointerMove,
  optionIdPrefix,
  registerAction,
  ...divProps
}: MaterialSegmentedActionListProps) {
  const generatedIdPrefix = useId().replace(/:/g, '')
  const resolvedIdPrefix = optionIdPrefix ?? generatedIdPrefix
  const actionRefs = useRef(new Map<string, HTMLButtonElement>())
  const enabledActions = actions.filter((action) => !action.disabled)
  const activeAction = enabledActions.find((action) => action.id === activeId)
  const tabStopId = activeAction?.id ?? enabledActions[0]?.id

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, actionId: string) {
    const currentIndex = enabledActions.findIndex((action) => action.id === actionId)

    if (currentIndex < 0 || enabledActions.length === 0) {
      return
    }

    let nextIndex: number | undefined

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % enabledActions.length
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + enabledActions.length) % enabledActions.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = enabledActions.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    actionRefs.current.get(enabledActions[nextIndex].id)?.focus()
  }

  return (
    <div
      {...divProps}
      aria-label={ariaLabel}
      className={['material-segmented-action-list', className].filter(Boolean).join(' ')}
      data-material-segmented-action-list
      role="listbox"
    >
      {actions.map((action) => {
        const active = action.id === activeId

        return (
          <div
            key={action.id}
            className={[
              'material-segmented-action-row',
              action.trailingSwitch ? 'material-segmented-action-row--with-switch' : '',
              active ? 'material-segmented-action-row--active' : '',
              action.disabled ? 'material-segmented-action-row--disabled' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onPointerMove={(event) => {
              if (event.pointerType !== 'touch') {
                onActionPointerMove?.(action)
              }
            }}
          >
            <MaterialRipple
              active={active}
              activeState="hover"
              disabled={action.disabled}
              ignoreSelector=".material-segmented-action__switch"
            />
            <button
              ref={(element) => {
                if (element) {
                  actionRefs.current.set(action.id, element)
                } else {
                  actionRefs.current.delete(action.id)
                }
                registerAction?.(action.id, element)
              }}
              type="button"
              className={[
                'material-segmented-action',
                action.leading ? 'material-segmented-action--with-leading' : '',
                action.leadingType
                  ? `material-segmented-action--leading-${action.leadingType}`
                  : '',
                action.trailing ? 'material-segmented-action--with-trailing' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={action.ariaLabel ?? labelText(action.label)}
              aria-selected={active}
              disabled={action.disabled}
              id={`${resolvedIdPrefix}-${action.id}`}
              role="option"
              tabIndex={action.id === tabStopId ? 0 : -1}
              onClick={() => onAction(action)}
              onKeyDown={(event) => moveFocus(event, action.id)}
            >
              {action.leading ? (
                <span className="material-segmented-action__leading" aria-hidden="true">
                  {action.leading}
                </span>
              ) : null}
              <span className="material-segmented-action__body">
                <span className="material-segmented-action__label">{action.label}</span>
                {action.supportingText ? (
                  <span className="material-segmented-action__supporting-line">
                    {action.supportingIcon ? (
                      <span className="material-segmented-action__supporting-icon" aria-hidden="true">
                        {action.supportingIcon}
                      </span>
                    ) : null}
                    <span className="material-segmented-action__supporting-text">
                      {action.supportingText}
                    </span>
                  </span>
                ) : null}
              </span>
              {action.trailing ? (
                <span className="material-segmented-action__trailing">{action.trailing}</span>
              ) : null}
            </button>
            {action.trailingSwitch ? (
              <span className="material-segmented-action__switch">
                <MaterialSwitch
                  aria-label={action.trailingSwitch.ariaLabel}
                  checked={action.trailingSwitch.checked}
                  disabled={action.disabled}
                  onChange={(event) => action.trailingSwitch?.onChange(event.currentTarget.checked)}
                />
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
