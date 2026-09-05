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
- List count and trailing actions
- Loading indicator
- Quantity stepper
- Rich option list
- Ripple and state layers
- Segmented action list
- Slider, including centered ranges and stops
- Switch
- Wavy progress indicator
- Dynamic Material color themes
- Material 3 Expressive motion tokens

## Install from GitHub

Until the first npm release, install the package directly from GitHub:

```sh
npm install github:KoleHoenicke/material-react-components#v0.4.0
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
