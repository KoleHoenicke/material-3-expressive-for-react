import { describe, expect, it } from 'vitest'
import * as library from './index'

describe('public package surface', () => {
  it('exports short and explicit component names', () => {
    expect(library.Button).toBe(library.MaterialButton)
    expect(library.Card).toBe(library.MaterialCard)
    expect(library.Switch).toBe(library.MaterialSwitch)
    expect(library.Slider).toBe(library.MaterialSlider)
    expect(library.LoadingIndicator).toBe(library.MaterialLoadingIndicator)
    expect(library.MaterialThemeProvider).toBeTypeOf('function')
  })
})
