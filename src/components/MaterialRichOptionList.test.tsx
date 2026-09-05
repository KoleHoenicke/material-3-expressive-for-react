import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MaterialRichOptionList, type MaterialRichOption } from './MaterialRichOptionList'

const options: readonly MaterialRichOption<string>[] = [
  {
    label: 'Basic Hotel',
    supportingText: '4 beds',
    value: 'basic',
  },
  {
    label: 'Grand Hotel',
    supportingText: '50 beds',
    value: 'grand',
  },
]

describe('MaterialRichOptionList', () => {
  it('renders Material list radio options with selected state', () => {
    render(
      <MaterialRichOptionList
        ariaLabel="Hotel levels"
        options={options}
        value="grand"
        onChange={() => {}}
      />,
    )

    expect(screen.getByRole('radiogroup', { name: 'Hotel levels' })).toHaveClass(
      'material-rich-option-list',
    )
    expect(screen.getByRole('radio', { name: 'Grand Hotel' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Grand Hotel' }).closest('label')).toHaveClass(
      'material-rich-option--selected',
    )
  })

  it('calls onChange with the selected option value', () => {
    const onChange = vi.fn()
    render(
      <MaterialRichOptionList
        ariaLabel="Hotel levels"
        options={options}
        value="basic"
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Grand Hotel' }))
    expect(onChange).toHaveBeenCalledWith('grand')
  })
})
