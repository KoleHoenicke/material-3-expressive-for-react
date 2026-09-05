import { useEffect, useState, type ReactNode } from 'react'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  ListCount,
  ListSelectionIcon,
  ListTrailingAction,
  LoadingIndicator,
  MaterialRipple,
  MaterialThemeProvider,
  QuantityStepper,
  RichOptionList,
  SegmentedActionList,
  Slider,
  Switch,
  WavyProgress,
  type MaterialButtonSize,
  type MaterialButtonVariant,
} from '../../src'

type IconName =
  | 'add'
  | 'check'
  | 'code'
  | 'delete'
  | 'edit'
  | 'github'
  | 'grid'
  | 'minus'
  | 'moon'
  | 'palette'
  | 'star'

const buttonVariants: MaterialButtonVariant[] = ['filled', 'tonal', 'outlined', 'elevated', 'text']
const buttonSizes: MaterialButtonSize[] = ['extra-small', 'small', 'medium', 'large', 'extra-large']
const themePresets = [
  { color: '#6750a4', label: 'Violet' },
  { color: '#006a6a', label: 'Teal' },
  { color: '#8c4a60', label: 'Rose' },
  { color: '#5b8f34', label: 'Meadow' },
  { color: '#825500', label: 'Amber' },
]

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    add: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    code: <path d="m8 9-3 3 3 3m8-6 3 3-3 3m-2-9-4 12" />,
    delete: <path d="M5 7h14M9 7V4h6v3m2 0-1 13H8L7 7m3 4v5m4-5v5" />,
    edit: <path d="m14.5 5.5 4 4M4 20l3.5-.8L19 7.7 16.3 5 4.8 16.5 4 20Z" />,
    github: <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.6-.1-3.3 0 0-1.1-.3-3.5 1.3a12.2 12.2 0 0 0-6.3 0C6.6 2.3 5.5 2.6 5.5 2.6c-.7 1.7-.2 3-.1 3.3A4.8 4.8 0 0 0 4 9.3c0 4.8 3 5.9 5.8 6.2-.5.5-.6 1-.6 2V21" />,
    grid: <><rect x="4" y="4" width="6" height="6" rx="2" /><rect x="14" y="4" width="6" height="6" rx="2" /><rect x="4" y="14" width="6" height="6" rx="2" /><rect x="14" y="14" width="6" height="6" rx="2" /></>,
    minus: <path d="M5 12h14" />,
    moon: <path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z" />,
    palette: <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h2.3A6.7 6.7 0 0 0 21 7.3C21 4.9 17 3 12 3Z" />,
    star: <path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.3 6-.9L12 3Z" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

function Specimen({
  children,
  description,
  id,
  api,
  title,
  wide = false,
}: {
  children: ReactNode
  description: string
  id?: string
  api?: string
  title: string
  wide?: boolean
}) {
  return (
    <article className={wide ? 'specimen specimen--wide' : 'specimen'} id={id}>
      <header className="specimen__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <code>{api ?? title.replaceAll(' ', '')}</code>
      </header>
      <div className="specimen__stage">{children}</div>
    </article>
  )
}

function StageLabel({ children }: { children: ReactNode }) {
  return <span className="stage-label">{children}</span>
}

export function Gallery() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [seed, setSeed] = useState('#6750a4')
  const [buttonSize, setButtonSize] = useState<MaterialButtonSize>('small')
  const [cardDragged, setCardDragged] = useState(false)
  const [cardSelected, setCardSelected] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [interval, setInterval] = useState('week')
  const [notifications, setNotifications] = useState(true)
  const [compact, setCompact] = useState(false)
  const [quantity, setQuantity] = useState(3)
  const [density, setDensity] = useState('comfortable')
  const [activeAction, setActiveAction] = useState('inbox')
  const [sliderValue, setSliderValue] = useState(64)
  const [centeredValue, setCenteredValue] = useState(20)
  const [badgeCount, setBadgeCount] = useState(7)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!message) return

    const timeout = window.setTimeout(() => setMessage(null), 3_500)
    return () => window.clearTimeout(timeout)
  }, [message])

  const intervalOptions = [
    { ariaLabel: 'Day', content: 'Day', value: 'day' },
    { ariaLabel: 'Week', content: 'Week', value: 'week' },
    { ariaLabel: 'Month', content: 'Month', value: 'month' },
  ]
  const densityOptions = [
    {
      label: 'Compact',
      leading: <span className="option-swatch option-swatch--compact" />,
      supportingText: 'More information in less space',
      value: 'compact',
    },
    {
      label: 'Comfortable',
      leading: <span className="option-swatch option-swatch--comfortable" />,
      supportingText: 'Balanced spacing and touch targets',
      value: 'comfortable',
    },
    {
      label: 'Relaxed',
      leading: <span className="option-swatch option-swatch--relaxed" />,
      supportingText: 'More room between each item',
      value: 'relaxed',
    },
  ]
  const actions = [
    {
      id: 'inbox',
      label: 'Inbox',
      leading: <Icon name="grid" />,
      supportingText: 'Updated a few seconds ago',
      trailing: <ListCount value={8} />,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      leading: <Icon name="star" />,
      supportingText: 'Saved components',
      trailing: <ListSelectionIcon><Icon name="check" /></ListSelectionIcon>,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      leading: <Icon name="palette" />,
      supportingText: notifications ? 'Enabled' : 'Disabled',
      trailingSwitch: {
        ariaLabel: 'Enable notifications',
        checked: notifications,
        onChange: setNotifications,
      },
    },
  ]

  return (
    <MaterialThemeProvider mode={mode} seed={{ primary: seed }}>
      <div className="gallery-shell">
        <header className="topbar">
          <a className="wordmark" href="#top" aria-label="Material React Components home">
            <span className="wordmark__mark"><Icon name="grid" /></span>
            <span>Material React Components</span>
          </a>
          <nav aria-label="Gallery navigation">
            <a href="#cards">Cards</a>
            <a href="#actions">Actions</a>
            <a href="#selection">Selection</a>
            <a href="#lists">Lists</a>
            <a href="#status">Status</a>
          </nav>
          <a className="github-link" href="https://github.com/KoleHoenicke/material-react-components" aria-label="View source on GitHub">
            <Icon name="github" />
            <span>GitHub</span>
          </a>
        </header>

        <main className="gallery-content" id="top">
          <section className="hero" aria-labelledby="gallery-title">
            <div className="hero__copy">
              <span className="eyebrow">Interactive component gallery</span>
              <h1 id="gallery-title">Material controls that move like they should.</h1>
              <p>Every example is rendered by the package. Change the theme, press the controls, and inspect the current Material 3 Expressive behavior.</p>
              <div className="hero__meta">
                <span>14 modules</span>
                <span>60 tests</span>
                <span>React 18 and 19</span>
              </div>
            </div>
            <div className="hero__art" aria-hidden="true">
              <span className="hero-shape hero-shape--one" />
              <span className="hero-shape hero-shape--two" />
              <span className="hero-shape hero-shape--three" />
              <span className="hero-art__switch"><Switch checked readOnly /></span>
            </div>
          </section>

          <section className="theme-panel" aria-labelledby="theme-title">
            <div className="theme-panel__title">
              <span className="theme-panel__icon"><Icon name="palette" /></span>
              <div>
                <h2 id="theme-title">Theme playground</h2>
                <p>These controls regenerate the color roles for every specimen below.</p>
              </div>
            </div>
            <div className="theme-panel__controls">
              <fieldset className="color-presets">
                <legend>Source color</legend>
                {themePresets.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    className={seed === preset.color ? 'color-preset color-preset--selected' : 'color-preset'}
                    style={{ backgroundColor: preset.color }}
                    aria-label={`${preset.label} theme`}
                    aria-pressed={seed === preset.color}
                    onClick={() => setSeed(preset.color)}
                  />
                ))}
                <label className="custom-color" title="Choose a custom source color">
                  <input type="color" value={seed} onChange={(event) => setSeed(event.currentTarget.value)} aria-label="Custom source color" />
                  <Icon name="add" />
                </label>
              </fieldset>
              <label className="mode-control">
                <span className="mode-control__label"><Icon name="moon" /> Dark theme</span>
                <Switch aria-label="Use dark theme" checked={mode === 'dark'} onChange={(event) => setMode(event.currentTarget.checked ? 'dark' : 'light')} />
              </label>
            </div>
          </section>

          <section className="component-section" id="cards" aria-labelledby="cards-title">
            <div className="section-heading">
              <span className="eyebrow">Content</span>
              <h2 id="cards-title">Cards</h2>
            </div>
            <div className="specimen-grid">
              <Specimen
                title="Card"
                description="Filled, elevated, and outlined containers with direct actions, selection, drag elevation, and flexible content."
                wide
              >
                <div className="card-showcase">
                  <Card
                    variant="elevated"
                    contentPadding={16}
                    draggable
                    dragged={cardDragged}
                    onDraggedChange={setCardDragged}
                    onClick={() => setMessage('Elevated card opened')}
                  >
                    <span className="demo-card__label">Elevated</span>
                    <span className="demo-card__title">Drag or open this card</span>
                    <span className="demo-card__supporting">
                      Hover raises it to level 2. Dragging uses the level 4 token.
                    </span>
                  </Card>

                  <Card variant="filled" contentPadding={16}>
                    <span className="demo-card__label">Filled</span>
                    <h4 className="demo-card__title">Flexible content container</h4>
                    <p className="demo-card__supporting">
                      Passive cards can contain their own focused actions without making the whole
                      surface clickable.
                    </p>
                    <div className="demo-card__actions">
                      <Button variant="text" onClick={() => setMessage('Filled card action pressed')}>
                        Learn more
                      </Button>
                    </div>
                  </Card>

                  <Card
                    variant="outlined"
                    contentPadding={16}
                    checkable
                    checked={cardSelected}
                    onCheckedChange={setCardSelected}
                  >
                    <span className="demo-card__label">Outlined</span>
                    <span className="demo-card__title">
                      {cardSelected ? 'Selected report' : 'Select this report'}
                    </span>
                    <span className="demo-card__supporting">
                      Controlled checked state includes the Android selection layer, icon, and
                      outline.
                    </span>
                  </Card>
                </div>
              </Specimen>
            </div>
          </section>

          <section className="component-section" id="actions" aria-labelledby="actions-title">
            <div className="section-heading">
              <span className="eyebrow">Actions</span>
              <h2 id="actions-title">Buttons and groups</h2>
            </div>
            <div className="specimen-grid">
              <Specimen title="Button" description="Five variants share one component and one motion model." wide>
                <div className="stage-toolbar">
                  <label>Size
                    <select value={buttonSize} onChange={(event) => setButtonSize(event.currentTarget.value as MaterialButtonSize)}>
                      {buttonSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </label>
                </div>
                <div className="button-showcase">
                  {buttonVariants.map((variant) => (
                    <Button key={variant} variant={variant} size={buttonSize} onClick={() => setMessage(`${variant} button pressed`)}>{variant}</Button>
                  ))}
                </div>
                <div className="button-showcase">
                  <Button variant="filled" size={buttonSize} leadingIcon={<Icon name="add" />}>Create</Button>
                  <Button variant="tonal" size={buttonSize} trailingIcon={<Icon name="edit" />}>Edit</Button>
                  <Button variant="outlined" size={buttonSize} disabled>Disabled</Button>
                  <Button variant="tonal" size={buttonSize} toggle selected={favorite} leadingIcon={<Icon name="star" />} onClick={() => setFavorite((value) => !value)}>Favorite</Button>
                </div>
              </Specimen>

              <Specimen title="Button group" api="ButtonGroup" description="Press a segment to see its width push into its neighbors.">
                <StageLabel>Connected</StageLabel>
                <ButtonGroup ariaLabel="Time range" options={intervalOptions} value={interval} onChange={setInterval} variant="connected" buttonVariant="tonal" />
                <StageLabel>Standard</StageLabel>
                <ButtonGroup ariaLabel="Time range standard" options={intervalOptions} value={interval} onChange={setInterval} variant="standard" buttonVariant="outlined" />
              </Specimen>

              <Specimen title="Ripple" description="A reusable state layer for custom interactive controls.">
                <button className="ripple-tile" type="button" onClick={() => setMessage('Custom ripple pressed')}>
                  <MaterialRipple />
                  <span className="ripple-tile__icon"><Icon name="code" /></span>
                  <span><strong>Press anywhere</strong><small>Pointer and keyboard feedback</small></span>
                </button>
              </Specimen>
            </div>
          </section>

          <section className="component-section" id="selection" aria-labelledby="selection-title">
            <div className="section-heading">
              <span className="eyebrow">Selection</span>
              <h2 id="selection-title">Switches and sliders</h2>
            </div>
            <div className="specimen-grid">
              <Specimen title="Switch" description="Selected, unselected, icon, and disabled states.">
                <div className="switch-list">
                  <label><span><strong>Notifications</strong><small>Selected icon</small></span><Switch aria-label="Notifications" checked={notifications} onChange={(event) => setNotifications(event.currentTarget.checked)} /></label>
                  <label><span><strong>Compact layout</strong><small>Icons in both states</small></span><Switch aria-label="Compact layout" iconMode="both" checked={compact} onChange={(event) => setCompact(event.currentTarget.checked)} /></label>
                  <label><span><strong>Sync over cellular</strong><small>Unavailable</small></span><Switch aria-label="Sync over cellular" checked={false} disabled /></label>
                </div>
              </Specimen>

              <Specimen title="Slider" description="Continuous values, stops, centered ranges, and indicators." wide>
                <div className="slider-grid">
                  <label className="slider-demo"><span>Standard <output>{sliderValue}%</output></span><Slider aria-label="Standard slider" min={0} max={100} value={sliderValue} valueIndicator="active" valueLabel={(value) => `${value}%`} stops={[0, 25, 50, 75, 100]} onChange={(event) => setSliderValue(event.currentTarget.valueAsNumber)} /></label>
                  <label className="slider-demo"><span>Centered <output>{centeredValue > 0 ? `+${centeredValue}` : centeredValue}</output></span><Slider aria-label="Centered slider" min={-50} max={50} origin={0} value={centeredValue} valueIndicator="always" stops={[-50, -25, 0, 25, 50]} onChange={(event) => setCenteredValue(event.currentTarget.valueAsNumber)} /></label>
                </div>
              </Specimen>
            </div>
          </section>

          <section className="component-section" id="lists" aria-labelledby="lists-title">
            <div className="section-heading">
              <span className="eyebrow">Lists</span>
              <h2 id="lists-title">Structured choices</h2>
            </div>
            <div className="specimen-grid specimen-grid--lists">
              <Specimen title="Rich option list" api="RichOptionList" description="Radio semantics with leading artwork and supporting text.">
                <RichOptionList ariaLabel="Layout density" options={densityOptions} value={density} onChange={setDensity} selectedIcon={<Icon name="check" />} />
              </Specimen>

              <Specimen title="Segmented action list" api="SegmentedActionList" description="Actions, counts, selection marks, and trailing switches.">
                <SegmentedActionList ariaLabel="Library sections" actions={actions} activeId={activeAction} onAction={(action) => setActiveAction(action.id)} />
              </Specimen>
            </div>
          </section>

          <section className="component-section" id="status" aria-labelledby="status-title">
            <div className="section-heading">
              <span className="eyebrow">Status and input</span>
              <h2 id="status-title">Progress, counts, and quantity</h2>
            </div>
            <div className="specimen-grid">
              <Specimen title="Badge and list count" api="Badge · ListCount" description="Small and large badges with semantic color roles.">
                <div className="badge-showcase">
                  <button type="button" className="badged-icon" aria-label={`${badgeCount} notifications`} onClick={() => setBadgeCount((count) => count + 1)}>
                    <Icon name="grid" />
                    <Badge value={badgeCount} max={99} />
                  </button>
                  <Badge value={12} tone="primary" />
                  <Badge value="New" tone="secondary" />
                  <Badge variant="small" />
                  <ListCount value={1234} />
                </div>
                <Button variant="text" leadingIcon={<Icon name="add" />} onClick={() => setBadgeCount((count) => count + 1)}>Add notification</Button>
              </Specimen>

              <Specimen title="Quantity stepper" api="QuantityStepper" description="Buttons collapse at the minimum and maximum values.">
                <div className="quantity-demo">
                  <span><strong>Guests</strong><small>Maximum 12</small></span>
                  <QuantityStepper label="Guests" min={0} max={12} value={quantity} onChange={setQuantity} decrementIcon={<Icon name="minus" />} incrementIcon={<Icon name="add" />} />
                </div>
              </Specimen>

              <Specimen title="Wavy progress" api="WavyProgress" description="A determinate indicator with reduced-motion support." wide>
                <div className="progress-demo">
                  <div className="progress-demo__label"><span>Gallery progress</span><output>{sliderValue}%</output></div>
                  <WavyProgress label="Gallery progress" value={sliderValue / 100} />
                  <Slider aria-label="Change gallery progress" min={0} max={100} value={sliderValue} onChange={(event) => setSliderValue(event.currentTarget.valueAsNumber)} />
                </div>
              </Specimen>

              <Specimen title="Loading indicator" api="LoadingIndicator" description="Contained and standard morphing indicators.">
                <div className="loading-showcase">
                  <div><LoadingIndicator label="Contained loading indicator" /><span>Contained</span></div>
                  <div><LoadingIndicator label="Standard loading indicator" variant="standard" /><span>Standard</span></div>
                </div>
              </Specimen>

              <Specimen title="Trailing action" api="ListTrailingAction" description="Compact icon actions sized for a 48 pixel touch target.">
                <div className="demo-list-row">
                  <span><strong>Draft component</strong><small>Edited two minutes ago</small></span>
                  <ListTrailingAction aria-label="Edit draft" variant="filled-tonal" onClick={() => setMessage('Edit action pressed')}><Icon name="edit" /></ListTrailingAction>
                  <ListTrailingAction aria-label="Delete draft" onClick={() => setMessage('Delete action pressed')}><Icon name="delete" /></ListTrailingAction>
                </div>
              </Specimen>
            </div>
          </section>
        </main>

        <footer>
          <span>Independent community implementation. Not affiliated with Google.</span>
          <a href="https://github.com/KoleHoenicke/material-react-components">Source and installation</a>
        </footer>
        {message ? <div className="gallery-toast" role="status" aria-live="polite">{message}</div> : null}
      </div>
    </MaterialThemeProvider>
  )
}
