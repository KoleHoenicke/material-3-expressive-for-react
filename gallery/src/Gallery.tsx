import { useEffect, useState, type ReactNode } from 'react'
import {
  AppBarFab,
  AppBarIconButton,
  Badge,
  BottomAppBar,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CheckboxList,
  CheckboxListItem,
  AssistChip,
  ChipSet,
  FilterChip,
  InputChip,
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  ExpandableList,
  List,
  ListAvatar,
  ListCount,
  ListDivider,
  ListItem,
  ListMedia,
  ListSelectionIcon,
  ListSwipeActions,
  ListTrailingAction,
  LoadingIndicator,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
  LargeFlexibleTopAppBar,
  LargeTopAppBar,
  MaterialRipple,
  MaterialThemeProvider,
  MediumFlexibleTopAppBar,
  MediumTopAppBar,
  QuantityStepper,
  RichOptionList,
  SegmentedActionList,
  Slider,
  SuggestionChip,
  Switch,
  TopAppBar,
  CenterAlignedTopAppBar,
  type MaterialButtonSize,
  type MaterialButtonVariant,
} from '../../src'

type IconName =
  | 'add'
  | 'back'
  | 'check'
  | 'code'
  | 'delete'
  | 'edit'
  | 'github'
  | 'grid'
  | 'minus'
  | 'more'
  | 'moon'
  | 'palette'
  | 'search'
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
    back: <path d="m15 18-6-6 6-6" />,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    code: <path d="m8 9-3 3 3 3m8-6 3 3-3 3m-2-9-4 12" />,
    delete: <path d="M5 7h14M9 7V4h6v3m2 0-1 13H8L7 7m3 4v5m4-5v5" />,
    edit: <path d="m14.5 5.5 4 4M4 20l3.5-.8L19 7.7 16.3 5 4.8 16.5 4 20Z" />,
    github: <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.6-.1-3.3 0 0-1.1-.3-3.5 1.3a12.2 12.2 0 0 0-6.3 0C6.6 2.3 5.5 2.6 5.5 2.6c-.7 1.7-.2 3-.1 3.3A4.8 4.8 0 0 0 4 9.3c0 4.8 3 5.9 5.8 6.2-.5.5-.6 1-.6 2V21" />,
    grid: <><rect x="4" y="4" width="6" height="6" rx="2" /><rect x="14" y="4" width="6" height="6" rx="2" /><rect x="4" y="14" width="6" height="6" rx="2" /><rect x="14" y="14" width="6" height="6" rx="2" /></>,
    minus: <path d="M5 12h14" />,
    more: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
    moon: <path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z" />,
    palette: <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h2.3A6.7 6.7 0 0 0 21 7.3C21 4.9 17 3 12 3Z" />,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
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
  const [chipFilters, setChipFilters] = useState(() => new Set(['recent']))
  const [chipPeople, setChipPeople] = useState(['Avery', 'Sam'])
  const [exportFormats, setExportFormats] = useState(() => new Set(['photos']))
  const [favorite, setFavorite] = useState(false)
  const [interval, setInterval] = useState('week')
  const [notifications, setNotifications] = useState(true)
  const [compact, setCompact] = useState(false)
  const [quantity, setQuantity] = useState(3)
  const [density, setDensity] = useState('comfortable')
  const [expandedList, setExpandedList] = useState(false)
  const [selectedListItem, setSelectedListItem] = useState('documents')
  const [swipeRevealed, setSwipeRevealed] = useState(false)
  const [activeAction, setActiveAction] = useState('inbox')
  const [sliderValue, setSliderValue] = useState(64)
  const [centeredValue, setCenteredValue] = useState(20)
  const [badgeCount, setBadgeCount] = useState(7)
  const [message, setMessage] = useState<string | null>(null)
  const [appBarProgress, setAppBarProgress] = useState(0)

  const setChipFilter = (filter: string, selected: boolean) => {
    setChipFilters((current) => {
      const next = new Set(current)
      if (selected) next.add(filter)
      else next.delete(filter)
      return next
    })
  }

  const availableExportFormats = ['photos', 'videos', 'metadata']
  const allExportFormatsSelected = exportFormats.size === availableExportFormats.length
  const someExportFormatsSelected = exportFormats.size > 0 && !allExportFormatsSelected

  const setExportFormat = (format: string, selected: boolean) => {
    setExportFormats((current) => {
      const next = new Set(current)
      if (selected) next.add(format)
      else next.delete(format)
      return next
    })
  }

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
            <a href="#app-bars">App bars</a>
            <a href="#cards">Cards</a>
            <a href="#chips">Chips</a>
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
                <span>21 modules</span>
                <span>122 tests</span>
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

          <section className="component-section" id="app-bars" aria-labelledby="app-bars-title">
            <div className="section-heading">
              <span className="eyebrow">Navigation and actions</span>
              <h2 id="app-bars-title">App bars</h2>
            </div>
            <div className="specimen-grid">
              <Specimen
                title="Top app bars"
                api="TopAppBar · MediumTopAppBar · LargeTopAppBar"
                description="Every Android variant, with exact expanded and collapsed title geometry."
                wide
              >
                <label className="app-bar-progress-control">
                  <span>Collapse progress <output>{Math.round(appBarProgress * 100)}%</output></span>
                  <input
                    aria-label="Top app bar collapse progress"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={appBarProgress}
                    onChange={(event) => setAppBarProgress(event.currentTarget.valueAsNumber)}
                  />
                </label>
                <div className="app-bar-grid">
                  <div className="app-bar-demo"><StageLabel>Small</StageLabel><TopAppBar title="Inbox" navigationIcon={<AppBarIconButton aria-label="Back"><Icon name="back" /></AppBarIconButton>} actions={<><AppBarIconButton aria-label="Search"><Icon name="search" /></AppBarIconButton><AppBarIconButton aria-label="More options"><Icon name="more" /></AppBarIconButton></>} /></div>
                  <div className="app-bar-demo"><StageLabel>Center aligned</StageLabel><CenterAlignedTopAppBar title="Photos" navigationIcon={<AppBarIconButton aria-label="Back"><Icon name="back" /></AppBarIconButton>} actions={<AppBarIconButton aria-label="Favorite"><Icon name="star" /></AppBarIconButton>} /></div>
                  <div className="app-bar-demo"><StageLabel>Medium</StageLabel><MediumTopAppBar title="Your library" collapseProgress={appBarProgress} navigationIcon={<AppBarIconButton aria-label="Back"><Icon name="back" /></AppBarIconButton>} actions={<AppBarIconButton aria-label="Search"><Icon name="search" /></AppBarIconButton>} /></div>
                  <div className="app-bar-demo"><StageLabel>Medium flexible</StageLabel><MediumFlexibleTopAppBar title="Your library" subtitle="12 saved collections" collapseProgress={appBarProgress} navigationIcon={<AppBarIconButton aria-label="Back"><Icon name="back" /></AppBarIconButton>} actions={<AppBarIconButton aria-label="More options"><Icon name="more" /></AppBarIconButton>} /></div>
                  <div className="app-bar-demo"><StageLabel>Large</StageLabel><LargeTopAppBar title="Your photos" collapseProgress={appBarProgress} navigationIcon={<AppBarIconButton aria-label="Back"><Icon name="back" /></AppBarIconButton>} actions={<AppBarIconButton aria-label="Search"><Icon name="search" /></AppBarIconButton>} /></div>
                  <div className="app-bar-demo"><StageLabel>Large flexible</StageLabel><LargeFlexibleTopAppBar title="Weekend in Kyoto" subtitle="April 18–21" collapseProgress={appBarProgress} navigationIcon={<AppBarIconButton aria-label="Back"><Icon name="back" /></AppBarIconButton>} actions={<AppBarIconButton aria-label="More options"><Icon name="more" /></AppBarIconButton>} /></div>
                </div>
              </Specimen>

              <Specimen
                title="Bottom app bars"
                api="BottomAppBar · AppBarFab"
                description="Standard 80px and flexible 64px bars with Android spacing and an optional secondary FAB."
                wide
              >
                <div className="bottom-app-bar-grid">
                  <div className="app-bar-demo">
                    <StageLabel>Standard with FAB</StageLabel>
                    <BottomAppBar
                      aria-label="Document actions"
                      safeAreaInsets={false}
                      actions={<><AppBarIconButton aria-label="Search"><Icon name="search" /></AppBarIconButton><AppBarIconButton aria-label="Edit"><Icon name="edit" /></AppBarIconButton><AppBarIconButton aria-label="Favorite"><Icon name="star" /></AppBarIconButton></>}
                      floatingActionButton={<AppBarFab aria-label="Create" onClick={() => setMessage('Create pressed')}><Icon name="add" /></AppBarFab>}
                    />
                  </div>
                  <div className="app-bar-demo">
                    <StageLabel>Flexible, space between</StageLabel>
                    <BottomAppBar aria-label="Flexible actions" safeAreaInsets={false} variant="flexible">
                      <AppBarIconButton aria-label="Grid"><Icon name="grid" /></AppBarIconButton>
                      <AppBarIconButton aria-label="Search"><Icon name="search" /></AppBarIconButton>
                      <AppBarIconButton aria-label="Favorite"><Icon name="star" /></AppBarIconButton>
                      <AppBarIconButton aria-label="More options"><Icon name="more" /></AppBarIconButton>
                    </BottomAppBar>
                  </div>
                </div>
              </Specimen>
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

          <section className="component-section" id="chips" aria-labelledby="chips-title">
            <div className="section-heading">
              <span className="eyebrow">Compact actions and choices</span>
              <h2 id="chips-title">Chips</h2>
            </div>
            <div className="specimen-grid">
              <Specimen
                title="Chip family"
                api="AssistChip · FilterChip · InputChip · SuggestionChip"
                description="All four Material variants, flat and elevated surfaces, controlled selection, avatars, removal, and expressive shape morphing."
                wide
              >
                <div className="chip-showcase">
                  <StageLabel>Assist and suggestion</StageLabel>
                  <ChipSet aria-label="Contextual actions">
                    <AssistChip leadingIcon={<Icon name="add" />} onClick={() => setMessage('Event added')}>Add event</AssistChip>
                    <AssistChip elevated leadingIcon={<Icon name="search" />}>Search nearby</AssistChip>
                    <SuggestionChip>Sounds good</SuggestionChip>
                    <SuggestionChip elevated leadingIcon={<Icon name="star" />}>Save for later</SuggestionChip>
                  </ChipSet>
                </div>
                <div className="chip-showcase">
                  <StageLabel>Filter</StageLabel>
                  <ChipSet aria-label="Content filters">
                    <FilterChip selected={chipFilters.has('recent')} onSelectedChange={(selected) => setChipFilter('recent', selected)}>Recent</FilterChip>
                    <FilterChip selected={chipFilters.has('photos')} leadingIcon={<Icon name="grid" />} onSelectedChange={(selected) => setChipFilter('photos', selected)}>Photos</FilterChip>
                    <FilterChip elevated selected={chipFilters.has('favorites')} onSelectedChange={(selected) => setChipFilter('favorites', selected)}>Favorites</FilterChip>
                    <FilterChip shapeMode="expressive" selected={chipFilters.has('shared')} leadingIcon={<Icon name="check" />} trailingIcon={<Icon name="more" />} onSelectedChange={(selected) => setChipFilter('shared', selected)}>Shared</FilterChip>
                  </ChipSet>
                </div>
                <div className="chip-showcase">
                  <StageLabel>Input</StageLabel>
                  <ChipSet aria-label="People">
                    {chipPeople.includes('Avery') ? (
                      <InputChip avatar={<span className="demo-avatar">A</span>} onRemove={() => setChipPeople((people) => people.filter((person) => person !== 'Avery'))}>Avery</InputChip>
                    ) : null}
                    {chipPeople.includes('Sam') ? (
                      <InputChip selected shapeMode="expressive" leadingIcon={<Icon name="check" />} onRemove={() => setChipPeople((people) => people.filter((person) => person !== 'Sam'))}>Sam</InputChip>
                    ) : null}
                    <InputChip disabled trailingIcon={<Icon name="more" />}>Disabled</InputChip>
                    <InputChip softDisabled onRemove={() => undefined}>Discoverable</InputChip>
                  </ChipSet>
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
              <h2 id="selection-title">Checkboxes, switches, and sliders</h2>
            </div>
            <div className="specimen-grid">
              <Specimen
                title="Checkbox"
                api="Checkbox · CheckboxList · CheckboxListItem"
                description="Native form semantics with checked, mixed, disabled, error, and full-row list behavior."
                wide
              >
                <div className="checkbox-state-showcase" aria-label="Checkbox states">
                  <label><Checkbox /><span>Unchecked</span></label>
                  <label><Checkbox defaultChecked /><span>Checked</span></label>
                  <label><Checkbox indeterminate /><span>Indeterminate</span></label>
                  <label><Checkbox disabled /><span>Disabled</span></label>
                  <label><Checkbox defaultChecked disabled /><span>Disabled checked</span></label>
                  <label><Checkbox error /><span>Error</span></label>
                </div>
                <CheckboxList ariaLabel="Export formats" className="checkbox-list-demo">
                  <CheckboxListItem
                    label="Select all formats"
                    supportingText="Parent checkbox with automatic mixed state"
                    checkboxProps={{
                      checked: allExportFormatsSelected,
                      indeterminate: someExportFormatsSelected,
                      onChange: (event) => {
                        setExportFormats(
                          event.currentTarget.checked
                            ? new Set(availableExportFormats)
                            : new Set(),
                        )
                      },
                    }}
                  />
                  <CheckboxListItem
                    label="Photos"
                    supportingText="Original resolution"
                    checkboxProps={{
                      checked: exportFormats.has('photos'),
                      onChange: (event) => setExportFormat('photos', event.currentTarget.checked),
                    }}
                  />
                  <CheckboxListItem
                    label="Videos"
                    supportingText="Include motion and audio"
                    checkboxProps={{
                      checked: exportFormats.has('videos'),
                      onChange: (event) => setExportFormat('videos', event.currentTarget.checked),
                    }}
                  />
                  <CheckboxListItem
                    label="Metadata"
                    supportingText="Capture dates and locations"
                    checkboxProps={{
                      checked: exportFormats.has('metadata'),
                      onChange: (event) => setExportFormat('metadata', event.currentTarget.checked),
                    }}
                  />
                </CheckboxList>
              </Specimen>

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
              <h2 id="lists-title">Material 3 Expressive lists</h2>
            </div>
            <div className="specimen-grid specimen-grid--lists">
              <Specimen
                title="Standard and segmented lists"
                api="List · ListItem · ListDivider · ListAvatar · ListMedia"
                description="One-, two-, and three-line layouts with exact slots, media sizing, dividers, selection colors, and expressive shape morphing."
                wide
              >
                <div className="material-list-showcase">
                  <div>
                    <StageLabel>Standard</StageLabel>
                    <List ariaLabel="Standard file list">
                      <ListItem
                        headline="Flight details"
                        leading={<Icon name="star" />}
                        leadingType="icon"
                        trailing="9:41 AM"
                        trailingType="text"
                        onClick={() => setMessage('Flight details opened')}
                      />
                      <ListDivider />
                      <ListItem
                        headline="Maui itinerary"
                        supportingText="Shared with Abby"
                        leading={<ListAvatar>AB</ListAvatar>}
                        leadingType="avatar"
                        trailing={<ListTrailingAction aria-label="More itinerary actions"><Icon name="more" /></ListTrailingAction>}
                        trailingType="control"
                        onClick={() => setMessage('Maui itinerary opened')}
                      />
                      <ListDivider />
                      <ListItem
                        headline="Wedding photos"
                        overline="Album"
                        supportingText="184 items · Updated yesterday"
                        leading={<ListMedia><span className="demo-list-media"><Icon name="palette" /></span></ListMedia>}
                        leadingType="image"
                        trailing={<Icon name="star" />}
                        trailingType="icon"
                        onClick={() => setMessage('Wedding photos opened')}
                      />
                    </List>
                  </div>
                  <div>
                    <StageLabel>Segmented, single select</StageLabel>
                    <List
                      ariaLabel="Choose storage location"
                      selectionMode="single"
                      variant="segmented"
                    >
                      {[
                        ['documents', 'Documents', '12 files'],
                        ['photos', 'Photos', '184 items'],
                        ['favorites', 'Favorites', '8 saved items'],
                      ].map(([id, label, supportingText]) => {
                        const selected = selectedListItem === id
                        return (
                          <ListItem
                            key={id}
                            headline={label}
                            supportingText={supportingText}
                            selected={selected}
                            leading={selected ? <Icon name="check" /> : <Icon name="grid" />}
                            leadingType="icon"
                            trailing={<Icon name="star" />}
                            trailingType="icon"
                            onSelectedChange={() => setSelectedListItem(id)}
                          />
                        )
                      })}
                    </List>
                  </div>
                </div>
              </Specimen>

              <Specimen
                title="Expandable list"
                api="ExpandableList"
                description="A controlled segmented disclosure with Android fast-spatial expansion, connected shape updates, and collapsed-content focus isolation."
              >
                <ExpandableList
                  ariaLabel="Project folders"
                  expanded={expandedList}
                  onExpandedChange={setExpandedList}
                  summary={{
                    headline: 'Design files',
                    supportingText: expandedList ? '3 folders shown' : '3 folders',
                    leading: <Icon name="palette" />,
                    leadingType: 'icon',
                  }}
                >
                  <ListItem headline="Components" leading={<Icon name="grid" />} leadingType="icon" onClick={() => setMessage('Components opened')} />
                  <ListItem headline="Motion studies" leading={<Icon name="star" />} leadingType="icon" onClick={() => setMessage('Motion studies opened')} />
                  <ListItem headline="Archive" leading={<Icon name="code" />} leadingType="icon" onClick={() => setMessage('Archive opened')} />
                </ExpandableList>
              </Specimen>

              <Specimen
                title="Swipe to reveal"
                api="ListSwipeActions"
                description="Pointer swipe with Android overshoot and snap behavior, plus a visible keyboard and screen-reader action trigger."
              >
                <List ariaLabel="Messages" variant="segmented">
                  <ListSwipeActions
                    actions={
                      <>
                        <button className="demo-swipe-action demo-swipe-action--archive" type="button" onClick={() => setMessage('Archived')}>Archive</button>
                        <button className="demo-swipe-action demo-swipe-action--delete" type="button" onClick={() => setMessage('Deleted')}>Delete</button>
                      </>
                    }
                    actionsLabel="Message actions"
                    revealed={swipeRevealed}
                    onRevealedChange={setSwipeRevealed}
                  >
                    <ListItem
                      headline="Avery Chen"
                      supportingText="The updated prototype looks right."
                      leading={<ListAvatar>AC</ListAvatar>}
                      leadingType="avatar"
                      onClick={() => setMessage('Message opened')}
                    />
                  </ListSwipeActions>
                </List>
              </Specimen>

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

              <Specimen title="Progress indicators" api="LinearProgressIndicator · CircularProgressIndicator" description="Standard and Expressive shapes, each with determinate and indeterminate modes." wide>
                <div className="progress-demo">
                  <div className="progress-demo__label"><span>Gallery progress</span><output>{sliderValue}%</output></div>
                  <div className="progress-demo__linear-grid">
                    <div><StageLabel>Linear</StageLabel><LinearProgressIndicator label="Linear gallery progress" value={sliderValue / 100} /></div>
                    <div><StageLabel>Linear, indeterminate</StageLabel><LinearProgressIndicator label="Loading linear content" /></div>
                    <div><StageLabel>Linear wavy</StageLabel><LinearWavyProgressIndicator label="Wavy gallery progress" value={sliderValue / 100} /></div>
                    <div><StageLabel>Linear wavy, indeterminate</StageLabel><LinearWavyProgressIndicator label="Loading wavy content" /></div>
                    <div><StageLabel>Linear wavy, thick</StageLabel><LinearWavyProgressIndicator height={14} label="Thick wavy gallery progress" strokeWidth={8} trackStrokeWidth={8} value={sliderValue / 100} /></div>
                  </div>
                  <div className="progress-demo__circular-grid">
                    <div><CircularProgressIndicator label="Circular gallery progress" value={sliderValue / 100} /><StageLabel>Circular</StageLabel></div>
                    <div><CircularProgressIndicator label="Loading circular content" /><StageLabel>Indeterminate</StageLabel></div>
                    <div><CircularWavyProgressIndicator label="Circular wavy gallery progress" value={sliderValue / 100} /><StageLabel>Circular wavy</StageLabel></div>
                    <div><CircularWavyProgressIndicator label="Loading circular wavy content" /><StageLabel>Wavy, indeterminate</StageLabel></div>
                    <div><CircularWavyProgressIndicator amplitude={0.72} label="Thick circular wavy progress" size={52} strokeWidth={8} trackStrokeWidth={8} value={sliderValue / 100} /><StageLabel>Thick, custom</StageLabel></div>
                  </div>
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
