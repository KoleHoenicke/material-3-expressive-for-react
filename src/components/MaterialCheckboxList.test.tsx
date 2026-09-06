import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MaterialCheckboxList, MaterialCheckboxListItem } from './MaterialCheckboxList'

describe('MaterialCheckboxList', () => {
  it('labels a checkbox group and gives each checkbox the full row label', () => {
    const onChange = vi.fn()
    render(
      <MaterialCheckboxList ariaLabel="Download formats">
        <MaterialCheckboxListItem
          checkboxProps={{ checked: false, onChange }}
          label="Original photos"
          supportingText="Keep full resolution"
        />
      </MaterialCheckboxList>,
    )

    expect(screen.getByRole('group', { name: 'Download formats' })).toBeInTheDocument()
    const checkbox = screen.getByRole('checkbox', { name: /Original photos/ })
    fireEvent.click(screen.getByText('Original photos'))
    expect(onChange).toHaveBeenCalledOnce()
    expect(checkbox).toHaveAccessibleName('Original photos Keep full resolution')
  })

  it('supports leading controls and disabled list content', () => {
    const { container } = render(
      <MaterialCheckboxList ariaLabel="Options">
        <MaterialCheckboxListItem
          checkboxPosition="leading"
          checkboxProps={{ disabled: true }}
          label="Unavailable option"
        />
      </MaterialCheckboxList>,
    )

    const item = container.querySelector('.material-checkbox-list-item')
    expect(item).toHaveClass('material-checkbox-list-item--checkbox-leading')
    expect(item).toHaveClass('material-checkbox-list-item--disabled')
    expect(screen.getByRole('checkbox', { name: 'Unavailable option' })).toBeDisabled()
  })

  it('supports a parent checkbox that controls child items', () => {
    function ParentChildList() {
      const [items, setItems] = useState([true, false])
      const selectedCount = items.filter(Boolean).length

      return (
        <MaterialCheckboxList ariaLabel="Albums">
          <MaterialCheckboxListItem
            checkboxProps={{
              checked: selectedCount === items.length,
              indeterminate: selectedCount > 0 && selectedCount < items.length,
              onChange: (event) => setItems(items.map(() => event.currentTarget.checked)),
            }}
            label="Select all albums"
          />
          {items.map((checked, index) => (
            <MaterialCheckboxListItem
              key={index}
              checkboxProps={{
                checked,
                onChange: (event) =>
                  setItems(items.map((value, itemIndex) =>
                    itemIndex === index ? event.currentTarget.checked : value,
                  )),
              }}
              label={`Album ${index + 1}`}
            />
          ))}
        </MaterialCheckboxList>
      )
    }

    render(<ParentChildList />)
    const parent = screen.getByRole('checkbox', { name: 'Select all albums' })

    expect(parent).toHaveAttribute('aria-checked', 'mixed')
    fireEvent.click(parent)
    expect(screen.getByRole('checkbox', { name: 'Album 1' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Album 2' })).toBeChecked()
    expect((parent as HTMLInputElement).indeterminate).toBe(false)

    fireEvent.click(screen.getByText('Album 2'))
    expect(parent).toHaveAttribute('aria-checked', 'mixed')
    expect((parent as HTMLInputElement).indeterminate).toBe(true)
  })
})
