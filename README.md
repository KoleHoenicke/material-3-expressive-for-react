# Material 3 Expressive for React

An independent, open-source implementation of Material 3 Expressive components for React on the web.

This project grew out of the component system built for My Singing Monsters Grid Planner. It packages the reusable controls, dynamic color, typography hooks, shape tokens, state layers, and expressive motion so they can be shared across websites and Telegram Mini Apps.

> [!IMPORTANT]
> This is an independent community project. It is not affiliated with, sponsored by, or endorsed by Google. Material Design is a trademark of Google LLC.

## Status

The library is an early alpha. The API is usable, tested, and packaged, but it may change while more Grid Planner components are separated from application-specific code.

Included now:

- Badge
- Button and button group
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
npm install github:KoleHoenicke/material-3-expressive-for-react
```

React and React DOM are peer dependencies. React 18 and 19 are supported.

## Use

```tsx
import { useState } from 'react'
import {
  Button,
  MaterialThemeProvider,
  Slider,
  Switch,
} from 'material-3-expressive-for-react'
import 'material-3-expressive-for-react/styles.css'

export function Settings() {
  const [enabled, setEnabled] = useState(true)
  const [amount, setAmount] = useState(50)

  return (
    <MaterialThemeProvider seed={{ primary: '#6750a4' }}>
      <Button variant="filled">Save</Button>

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
  --md-slider-active-track-color: #006a6a;
  --material-loading-indicator-size: 40px;
}
```

The package does not bundle Google Sans. It uses Google Sans when the host application provides it, then falls back to Roboto and system sans-serif fonts.

## No sound effects

The library does not contain or play sound effects. Audio feedback from Grid Planner is intentionally outside the package boundary. Applications can add their own sound or haptic feedback in their event handlers if desired.

## Telegram Mini Apps

Telegram Mini Apps are web applications rendered inside Telegram's webview, so these React components can be used there like they can in a normal React website. Telegram-specific initialization and theme bridging should stay in the Mini App rather than in this component package.

## Development

```sh
pnpm install
pnpm verify
```

`pnpm verify` runs TypeScript checking, component tests, the production build, and an npm package dry run.

## License

Apache License 2.0. See `NOTICE` and `THIRD_PARTY_NOTICES.md` for attribution.
