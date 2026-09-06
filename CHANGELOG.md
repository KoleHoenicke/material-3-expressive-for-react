# Changelog

## 0.11.0

- Rebuilt the motion foundation against the current Material 3 motion physics guidance and AndroidX v0.14 generated tokens. Expressive spring physics now uses the correct 0.6/800 fast, 0.8/380 default, and 0.8/200 slow spatial values instead of exposing Standard values under the Expressive default.
- Added complete Expressive and Standard spring-attribute maps, active CSS physics aliases, a typed `getMaterialSpringAttributes` lookup, and a `motionScheme` theme-provider option. Scheme-dependent aliases now resolve at every provider boundary so nested Standard and Expressive schemes switch the actual component curves as well as their metadata.
- Replaced the Switch's legacy Material Web tweens with the current fast spatial and fast effects roles, corrected top and bottom app-bar snapping, list-family effects, and extended-FAB directional roles, added the missing slow-effects utility, centralized remaining component curves, and made reduced-motion overrides work inside motion-scheme providers.

## 0.10.0

- Added the complete Material 3 Expressive FAB menu with two-to-six-item composition, primary, secondary, and tertiary color sets, regular, medium, and large launchers, AndroidX-aligned geometry, launcher-to-close morphing, staggered item motion, scroll-behind-close behavior, RTL alignment, reduced motion, forced colors, and typed CSS token overrides.
- Added native controlled menu behavior with launcher focus retention, inert collapsed items, Tab and arrow-key navigation, Home, End, Escape, outside-click dismissal, configurable item-selection dismissal, and standalone `ToggleFloatingActionButton` support.
- Rechecked every extended FAB size and added all baseline, small, medium, and large variants to the interactive gallery.

## 0.9.0

- Added the full Material 3 floating action button family with regular, medium, large, and baseline small sizes; all six current color mappings and the legacy surface mapping; exact AndroidX geometry, state layers, elevation, focus treatment, reduced-motion behavior, and 48px small-FAB target; lowered and zero elevation; controlled show and hide motion; and typed CSS token overrides.
- Added current small, medium, and large extended FABs, controlled icon-and-label collapse motion, label-only support, the baseline extended variant, Android-style named exports, native button semantics, and an interactive gallery covering every size and color.

## 0.8.0

- Rebuilt lists around the current Material 3 Expressive and AndroidX model, with standard, segmented, and baseline containers; exact one-, two-, and three-line geometry; overline, leading, trailing, avatar, image, video, and divider slots; selected, disabled, focused, pressed, hovered, and dragged treatments; controlled single and multiple selection; roving keyboard navigation; links, long press, and drag callbacks; controlled expandable groups; RTL-aware swipe actions with accessible non-gesture controls; reduced-motion and forced-color support; and typed CSS token overrides.
- Updated checkbox list rows to use the new list geometry, shape, state, typography, and variant foundation while preserving native controlled checkbox behavior.

## 0.7.0

- Replaced the legacy determinate wavy line with the full Material 3 progress family: standard and Expressive linear and circular indicators, determinate and indeterminate modes, current AndroidX geometry and motion, stop markers, RTL rendering, reduced-motion handling, accessible ranges, compatibility aliases, and configurable strokes, gaps, colors, dimensions, amplitude, wavelength, and wave speed.

## 0.6.0

- Added the Material 3 Checkbox with checked, unchecked, indeterminate, disabled, and error states; native form and validation behavior; 18px containers; 40px state layers; 48px targets; current AndroidX color and motion behavior; typed CSS token overrides; and full-row checkbox list items with parent-child selection support.

## 0.5.0

- Added the complete Material 3 chip family with assist, filter, input, and suggestion chips; flat and elevated treatments; controlled selection; avatars; selected, leading, and trailing icons; removable and remove-only actions; links; disabled and soft-disabled behavior; drag state; 48px targets; expressive filter/input shape morphing; and keyboard-aware chip sets.

## 0.4.0

- Added the complete Material 3 app-bar family: small, center-aligned, medium, large, flexible top bars, standard and flexible bottom bars, app-bar icon buttons, secondary FAB support, safe-area handling, controlled collapse state, and Android-style scroll behaviors.

## 0.3.1

- Made standalone segmented action lists keyboard reachable and added wrapping arrow-key, Home, and End navigation that skips disabled actions.

## 0.3.0

- Added the Material 3 Card with filled, elevated, and outlined variants; native button and link semantics; controlled checked and dragged states; current AndroidX state layers; and configurable content padding.
- Updated shared focus and pressed state-layer opacity tokens to the current AndroidX Material 3 value of 0.10.
- Added a responsive interactive gallery for every available component.
- Added automatic GitHub Pages deployment for the gallery.

## 0.2.0

- Renamed the project to Material React Components.
- Moved the future npm package name to `@kolehoenicke/material-react-components` because the unscoped name is already registered by another package.
- Kept Material 3 Expressive as the current implementation target without tying the repository name to one Material generation.

## 0.1.0

- Added the initial React component library, theme generation, motion tokens, tests, and package build.
