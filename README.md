# Material React Components

An independent, open-source implementation of Material Design components for React on the web. The current release targets Material 3 Expressive.

[Open the interactive component gallery](https://kolehoenicke.github.io/material-react-components/)

The package includes reusable controls, dynamic color, typography hooks, shape tokens, state layers, and expressive motion.

> [!IMPORTANT]
> This is an independent community project. It is not affiliated with, sponsored by, or endorsed by Google. Material Design is a trademark of Google LLC.

## Status

The library is an early alpha. The API is usable, tested, and packaged, but it may change as the component set expands.

Included now:

- App bars, including small, center-aligned, medium, large, flexible, bottom, FAB, and scroll-aware variants
- Badge
- Button and button group
- Card, including filled, elevated, outlined, checked, and dragged states
- Checkbox, including indeterminate and error states, checkbox groups, and list items
- Chips, including assist, filter, input, suggestion, elevated, removable, and expressive-shape variants
- Floating action buttons, including every current size and color mapping, extended and collapsible variants, lowered elevation, and baseline compatibility
- FAB menus with controlled launchers, two to six actions, all three color sets, and regular, medium, and large launcher geometry
- Lists, including standard, segmented, selectable, expandable, swipe-reveal, media, dividers, counts, and trailing actions
- Loading indicator
- Quantity stepper
- Rich option list
- Ripple and state layers
- Segmented action list
- Slider, including centered ranges and stops
- Switch
- Progress indicators, including standard and Expressive linear and circular variants
- Dynamic Material color themes
- Material 3 Expressive motion tokens

## Install from GitHub

Until the first npm release, install the package directly from GitHub:

```sh
npm install github:KoleHoenicke/material-react-components#v0.10.0
```

React and React DOM are peer dependencies. React 18 and 19 are supported.

## Use

```tsx
import { useState } from 'react'
import {
  AppBarIconButton,
  Button,
  Card,
  MaterialThemeProvider,
  Slider,
  Switch,
  TopAppBar,
} from '@kolehoenicke/material-react-components'
import '@kolehoenicke/material-react-components/styles.css'

export function Settings() {
  const [enabled, setEnabled] = useState(true)
  const [amount, setAmount] = useState(50)

  return (
    <MaterialThemeProvider seed={{ primary: '#6750a4' }}>
      <TopAppBar
        title="Settings"
        navigationIcon={
          <AppBarIconButton aria-label="Go back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </AppBarIconButton>
        }
        scrollBehavior="pinned"
      />

      <Button variant="filled">Save</Button>

      <Card variant="elevated" contentPadding={16} href="/details">
        Open details
      </Card>

      <Switch
        aria-label="Enable feature"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />

      <Slider
        aria-label="Amount"
        min={0}
        max={100}
        value={amount}
        valueIndicator="always"
        onChange={(event) => setAmount(event.currentTarget.valueAsNumber)}
      />
    </MaterialThemeProvider>
  )
}
```

Every component is exported with a short name such as `Button` and its explicit name such as `MaterialButton`.

### Floating action buttons

`FloatingActionButton` follows the current AndroidX Material 3 implementation. The default is the 56px regular FAB with a 24px icon, 16px corners, primary-container colors, level-3 elevation, and a level-4 hover elevation. Medium and large FABs use 80px and 96px containers. The 40px small FAB remains available for baseline compatibility and keeps a 48px interaction target.

```tsx
import {
  ExtendedFloatingActionButton,
  FloatingActionButton,
  LargeFloatingActionButton,
} from '@kolehoenicke/material-react-components'

export function CreateActions({ expanded }: { expanded: boolean }) {
  return (
    <>
      <FloatingActionButton aria-label="Create note" color="primary-container">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </FloatingActionButton>

      <ExtendedFloatingActionButton
        expanded={expanded}
        icon={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>}
        label="Create note"
      />

      <LargeFloatingActionButton aria-label="Create note" color="tertiary">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </LargeFloatingActionButton>
    </>
  )
}
```

The current color mappings are `primary-container`, `secondary-container`, `tertiary-container`, `primary`, `secondary`, and `tertiary`. The baseline `surface` mapping also remains available. Set `elevation="lowered"` for AndroidX's lower-emphasis elevation or `elevation="none"` when another container owns the shadow.

`ExtendedFloatingActionButton` defaults to the current Expressive small extended FAB. It supports icon-and-label and label-only content. With an icon, `expanded={false}` animates to the matching square FAB while the label stays available to assistive technology. The named exports cover `SmallExtendedFloatingActionButton`, `MediumExtendedFloatingActionButton`, `LargeExtendedFloatingActionButton`, and the deprecated `BaselineExtendedFloatingActionButton`.

Set `visible={false}` to apply the Android show/hide scale and opacity treatment while removing the button from the keyboard and accessibility order. `visibilityAlignment` controls the transform origin. Every color, dimension, shape, elevation, state layer, focus indicator, typography value, expansion gap, and visibility scale is typed on `MaterialFabStyle` through `--md-fab-*` properties.

### FAB menu

`FloatingActionButtonMenu` ports the current AndroidX FAB menu layout and adapts its semantics to the web menu pattern. It accepts two to six `FloatingActionButtonMenuItem` children. The controlled launcher can start at 56px, 80px, or 96px, then animates to the shared 56px circular close button while preserving the original footprint. Items reveal from the launcher outward and collapse in reverse.

```tsx
import { useState } from 'react'
import {
  FloatingActionButtonMenu,
  FloatingActionButtonMenuItem,
} from '@kolehoenicke/material-react-components'

const AddIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
const CloseIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>

export function CreateMenu() {
  const [expanded, setExpanded] = useState(false)

  return (
    <FloatingActionButtonMenu
      closeIcon={<CloseIcon />}
      color="primary"
      expanded={expanded}
      icon={<AddIcon />}
      menuLabel="Create actions"
      onExpandedChange={setExpanded}
      size="medium"
      toggleLabel="Toggle create actions"
    >
      <FloatingActionButtonMenuItem icon={<AddIcon />}>New note</FloatingActionButtonMenuItem>
      <FloatingActionButtonMenuItem icon={<AddIcon />}>New list</FloatingActionButtonMenuItem>
    </FloatingActionButtonMenu>
  )
}
```

The `primary`, `secondary`, and `tertiary` color sets pair a solid close button with container-colored menu items. The menu uses 56px pill items, 24px icons, title-medium labels, 24px side padding, an 8px icon-label gap, and 4px between items. `alignment` supports logical start, center, and end placement, including RTL. Long menus scroll behind the unobstructed close button.

The launcher keeps focus when it opens. Tab moves from the close button to the top item, arrow keys move through the visible actions, Escape closes the menu, and collapsed items are inert and removed from the accessibility tree. Outside pointer interactions and item selection close the menu by default. `closeOnOutsideClick` and `closeOnItemClick` can disable those behaviors. Use `ToggleFloatingActionButton` separately when you need the controlled launcher without the menu layout. All component tokens are typed through `MaterialFabMenuStyle` and `MaterialToggleFabStyle`.

### Checkboxes

`Checkbox` follows the current Material 3 measurements and AndroidX behavior. It renders a native checkbox input, so names, values, required validation, form submission, keyboard activation, labels, and refs work like ordinary web controls. `indeterminate` sets the native mixed state. `error` applies the Material error treatment and `aria-invalid` semantics.

```tsx
import { useState } from 'react'
import {
  CheckboxList,
  CheckboxListItem,
} from '@kolehoenicke/material-react-components'

const formats = ['Photos', 'Videos'] as const

export function ExportFormats() {
  const [selected, setSelected] = useState(() => new Set(['Photos']))
  const allSelected = selected.size === formats.length
  const someSelected = selected.size > 0 && !allSelected

  return (
    <CheckboxList ariaLabel="Export formats">
      <CheckboxListItem
        label="Select all formats"
        checkboxProps={{
          checked: allSelected,
          indeterminate: someSelected,
          onChange: (event) => {
            setSelected(event.currentTarget.checked ? new Set(formats) : new Set())
          },
        }}
      />
      {formats.map((format) => (
        <CheckboxListItem
          key={format}
          label={format}
          checkboxProps={{
            checked: selected.has(format),
            name: 'format',
            value: format,
            onChange: (event) => {
              const checked = event.currentTarget.checked
              setSelected((current) => {
                const next = new Set(current)
                if (checked) next.add(format)
                else next.delete(format)
                return next
              })
            },
          }}
        />
      ))}
    </CheckboxList>
  )
}
```

The default visual container is 18px with a 2px corner and stroke. The state layer is 40px and the interaction target is 48px. `MaterialCheckboxStyle` types every `--md-checkbox-*` property, including separate checkmark, box, outline, interaction, disabled, indeterminate, error, and focus-indicator values. `CheckboxListItem` can place the control at the leading or trailing edge and keeps adjacent text on the `on-surface` role in every selection state.

### Lists

`List` and `ListItem` port the current AndroidX Material 3 list model to accessible web controls. Standard, segmented, and legacy baseline containers are available. Items support one-, two-, and three-line layouts; overline, leading, and trailing slots; icons, avatars, controls, images, and both Material video sizes; links; disabled, selected, dragged, and long-press states; custom padding, shape, color, elevation, and state tokens; and automatic top alignment for three-line content.

```tsx
import { useState } from 'react'
import {
  ExpandableList,
  List,
  ListAvatar,
  ListItem,
  ListSwipeActions,
} from '@kolehoenicke/material-react-components'

export function FileLists() {
  const [selected, setSelected] = useState('documents')
  const [expanded, setExpanded] = useState(false)
  const [revealed, setRevealed] = useState(false)

  return (
    <>
      <List ariaLabel="Choose a folder" selectionMode="single" variant="segmented">
        {['documents', 'photos'].map((folder) => (
          <ListItem
            key={folder}
            headline={folder[0].toUpperCase() + folder.slice(1)}
            leading={<ListAvatar>{folder[0].toUpperCase()}</ListAvatar>}
            leadingType="avatar"
            selected={selected === folder}
            supportingText="Available offline"
            onSelectedChange={() => setSelected(folder)}
          />
        ))}
      </List>

      <ExpandableList
        ariaLabel="Project folders"
        expanded={expanded}
        onExpandedChange={setExpanded}
        summary={{ headline: 'Design files', supportingText: '3 folders' }}
      >
        <ListItem headline="Components" onClick={() => {}} />
        <ListItem headline="Motion studies" onClick={() => {}} />
      </ExpandableList>

      <List ariaLabel="Messages">
        <ListSwipeActions
          actions={<button type="button">Archive</button>}
          actionsLabel="Message actions"
          revealed={revealed}
          onRevealedChange={setRevealed}
        >
          <ListItem headline="Avery Chen" supportingText="Updated just now" />
        </ListSwipeActions>
      </List>
    </>
  )
}
```

Selectable lists render `listbox` and `option` semantics, expose single- or multi-selection state, and use a roving tab stop with wrapping arrow-key, Home, and End navigation. Independent controls in either slot join the same keyboard order without creating invalid nested buttons. `ExpandableList` is controlled and removes collapsed content from the focus order. `ListSwipeActions` supports start or end reveal, RTL, pointer snap and overshoot, and a visible button alternative for keyboard and screen-reader users. Set `keyboardNavigation={false}` only when a surrounding composite owns focus.

Every dimension and color is configurable through typed `--md-list-*` properties on `MaterialListStyle`. Short names such as `List`, `ListItem`, `ListDivider`, `ListAvatar`, `ListMedia`, `ExpandableList`, and `ListSwipeActions` have matching explicit `Material*` exports.

### Chips

The chip family follows current AndroidX dimensions, color roles, elevation, icon animation, and optional expressive shape morphing. `ChipSet` adds the toolbar semantics and wrapping arrow-key focus behavior used by Material Web.

```tsx
import { useState } from 'react'
import {
  AssistChip,
  ChipSet,
  FilterChip,
  InputChip,
} from '@kolehoenicke/material-react-components'

export function SearchFilters() {
  const [recent, setRecent] = useState(true)
  const [people, setPeople] = useState(['Avery'])

  return (
    <>
      <ChipSet aria-label="Search filters">
        <FilterChip
          selected={recent}
          onSelectedChange={setRecent}
          shapeMode="expressive"
        >
          Recent
        </FilterChip>
        {people.map((person) => (
          <InputChip
            key={person}
            onRemove={() => setPeople((items) => items.filter((item) => item !== person))}
          >
            {person}
          </InputChip>
        ))}
      </ChipSet>
      <AssistChip elevated>Add to calendar</AssistChip>
    </>
  )
}
```

All chips keep a 32px visual container and a 48px interaction target by default. Use `touchTarget="none"` only when a parent supplies the accessible target. Flat and elevated surfaces, controlled `selected` state, `selectedIcon`, `leadingIcon`, `trailingIcon`, input avatars, removable actions, links, drag state, disabled state, and focusable `softDisabled` state are configurable. Every visual token is available through `--md-chip-*` custom properties.

### App bars

The app-bar family follows the current AndroidX Material 3 API and tokens. It includes `TopAppBar`, `CenterAlignedTopAppBar`, `MediumTopAppBar`, `LargeTopAppBar`, `MediumFlexibleTopAppBar`, `LargeFlexibleTopAppBar`, and `BottomAppBar`. Pass `collapseProgress` for controlled rendering, or connect `scrollTarget` with `pinned`, `enter-always`, `exit-until-collapsed`, or `exit-always` behavior.

```tsx
import { useRef, type ReactNode } from 'react'
import {
  AppBarIconButton,
  LargeFlexibleTopAppBar,
} from '@kolehoenicke/material-react-components'

export function Feed({ content }: { content: ReactNode }) {
  const scrollContainer = useRef<HTMLDivElement>(null)

  return (
    <>
      <LargeFlexibleTopAppBar
        title="Weekend in Kyoto"
        subtitle="April 18–21"
        navigationIcon={<AppBarIconButton aria-label="Back">←</AppBarIconButton>}
        actions={<AppBarIconButton aria-label="Search">⌕</AppBarIconButton>}
        scrollBehavior="exit-until-collapsed"
        scrollTarget={scrollContainer}
      />
      <div ref={scrollContainer}>{content}</div>
    </>
  )
}
```

All app-bar colors, dimensions, safe-area insets, and slot colors have public `--md-top-app-bar-*` and `--md-bottom-app-bar-*` CSS properties. Pass `safeAreaInsets={false}` when the surrounding layout already handles browser safe areas.

### Progress indicators

The progress family ports the current AndroidX Material 3 standard and Expressive APIs. Each shape supports determinate and indeterminate operation. Omit `value` for indeterminate progress.

```tsx
import {
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
} from '@kolehoenicke/material-react-components'

export function SyncProgress({ value }: { value: number }) {
  return (
    <>
      <LinearProgressIndicator label="Uploading files" value={value} />
      <LinearProgressIndicator label="Preparing upload" />
      <CircularWavyProgressIndicator label="Indexing files" value={value} />
      <LinearWavyProgressIndicator
        amplitude={0.7}
        label="Processing images"
        strokeWidth={8}
        trackStrokeWidth={8}
        value={value}
        wavelength={56}
      />
    </>
  )
}
```

The Android defaults are 240 by 4 pixels for standard linear, 240 by 10 pixels for linear wavy, 40 pixels for standard circular, and 48 pixels for circular wavy. Active and track strokes default to 4 pixels. Both linear forms include the 4 pixel stop marker used by current Material 3. For Android's thick Expressive examples, use a 14 pixel linear height with 8 pixel strokes or a 52 pixel circular size with 8 pixel strokes.

Use `max` for a range other than 0 to 1. Set `animateProgress` when the component should apply the AndroidX recommended transition between determinate values. Wavy indicators also accept `amplitude`, `wavelength`, and `waveSpeed`. Stroke widths, track widths, cap shape, gap, stop size, colors, dimensions, native span attributes, `aria-valuetext`, and `aria-labelledby` are configurable. Motion stops under `prefers-reduced-motion: reduce`, and linear indicators follow RTL direction.

The legacy `WavyProgress` name remains as a compatibility alias for determinate `LinearWavyProgressIndicator`.

## Theming

`MaterialThemeProvider` generates Material color roles from a source color with Google's open-source Material Color Utilities. Fidelity palettes are enabled by default.

```tsx
<MaterialThemeProvider
  mode="dark"
  seed={{ primary: '#5b8f34', secondary: '#b8e48d' }}
>
  <App />
</MaterialThemeProvider>
```

Components use public CSS custom properties. Override Material tokens at any ancestor when you need more control:

```css
.my-theme {
  --md-sys-shape-corner-large: 20px;
  --md-card-container-shape: 20px;
  --md-card-dragged-elevation: var(--md-sys-elevation-level5);
  --md-slider-active-track-color: #006a6a;
  --md-progress-active-color: #006a6a;
  --md-progress-track-color: #b9ccc9;
  --material-loading-indicator-size: 40px;
}
```

The package does not bundle Google Sans. It uses Google Sans when the host application provides it, then falls back to Roboto and system sans-serif fonts.

## Development

```sh
pnpm install
pnpm verify
```

Run the gallery locally with `pnpm gallery:dev`.

`pnpm verify` runs TypeScript checks, tests, package and gallery builds, and an npm package dry run.

## License

Apache License 2.0. See `NOTICE` and `THIRD_PARTY_NOTICES.md` for attribution.
