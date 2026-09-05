import { describe, expect, it } from 'vitest'
import * as library from './index'

describe('public package surface', () => {
  it('exports short and explicit component names', () => {
    expect(library.Button).toBe(library.MaterialButton)
    expect(library.Card).toBe(library.MaterialCard)
    expect(library.Switch).toBe(library.MaterialSwitch)
    expect(library.Slider).toBe(library.MaterialSlider)
    expect(library.LoadingIndicator).toBe(library.MaterialLoadingIndicator)
    expect(library.TopAppBar).toBe(library.MaterialTopAppBar)
    expect(library.BottomAppBar).toBe(library.MaterialBottomAppBar)
    expect(library.AppBarIconButton).toBe(library.MaterialAppBarIconButton)
    expect(library.MaterialThemeProvider).toBeTypeOf('function')
  })
})
