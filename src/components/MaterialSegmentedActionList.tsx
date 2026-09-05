import { useId, type HTMLAttributes, type ReactNode } from 'react'
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
              ref={(element) => registerAction?.(action.id, element)}
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
              tabIndex={-1}
              onClick={() => onAction(action)}
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
