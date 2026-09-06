import { describe, expect, it } from 'vitest'
import * as library from './index'

describe('public package surface', () => {
  it('exports short and explicit component names', () => {
    expect(library.Button).toBe(library.MaterialButton)
    expect(library.Card).toBe(library.MaterialCard)
    expect(library.Divider).toBe(library.MaterialDivider)
    expect(library.HorizontalDivider).toBe(library.MaterialHorizontalDivider)
    expect(library.VerticalDivider).toBe(library.MaterialVerticalDivider)
    expect(library.Fab).toBe(library.MaterialFloatingActionButton)
    expect(library.FloatingActionButton).toBe(library.MaterialFloatingActionButton)
    expect(library.ExtendedFab).toBe(library.MaterialExtendedFloatingActionButton)
    expect(library.ExtendedFloatingActionButton).toBe(
      library.MaterialExtendedFloatingActionButton,
    )
    expect(library.FabMenu).toBe(library.MaterialFloatingActionButtonMenu)
    expect(library.FloatingActionButtonMenu).toBe(
      library.MaterialFloatingActionButtonMenu,
    )
    expect(library.FabMenuItem).toBe(library.MaterialFloatingActionButtonMenuItem)
    expect(library.ToggleFloatingActionButton).toBe(
      library.MaterialToggleFloatingActionButton,
    )
    expect(library.Checkbox).toBe(library.MaterialCheckbox)
    expect(library.CheckboxList).toBe(library.MaterialCheckboxList)
    expect(library.CheckboxListItem).toBe(library.MaterialCheckboxListItem)
    expect(library.List).toBe(library.MaterialList)
    expect(library.ListItem).toBe(library.MaterialListItem)
    expect(library.ListDivider).toBe(library.MaterialListDivider)
    expect(library.ListAvatar).toBe(library.MaterialListAvatar)
    expect(library.ListMedia).toBe(library.MaterialListMedia)
    expect(library.ExpandableList).toBe(library.MaterialExpandableList)
    expect(library.ListSwipeActions).toBe(library.MaterialListSwipeActions)
    expect(library.Chip).toBe(library.MaterialChip)
    expect(library.ChipSet).toBe(library.MaterialChipSet)
    expect(library.FilterChip).toBe(library.MaterialFilterChip)
    expect(library.Switch).toBe(library.MaterialSwitch)
    expect(library.Text).toBe(library.MaterialText)
    expect(library.Slider).toBe(library.MaterialSlider)
    expect(library.LoadingIndicator).toBe(library.MaterialLoadingIndicator)
    expect(library.LinearProgressIndicator).toBe(library.MaterialLinearProgressIndicator)
    expect(library.CircularProgressIndicator).toBe(library.MaterialCircularProgressIndicator)
    expect(library.LinearWavyProgressIndicator).toBe(
      library.MaterialLinearWavyProgressIndicator,
    )
    expect(library.CircularWavyProgressIndicator).toBe(
      library.MaterialCircularWavyProgressIndicator,
    )
    expect(library.TopAppBar).toBe(library.MaterialTopAppBar)
    expect(library.BottomAppBar).toBe(library.MaterialBottomAppBar)
    expect(library.AppBarIconButton).toBe(library.MaterialAppBarIconButton)
    expect(library.MaterialThemeProvider).toBeTypeOf('function')
  })
})
