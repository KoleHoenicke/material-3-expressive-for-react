import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('motion usage guardrails', () => {
  const componentDirectory = resolve(process.cwd(), 'src/components')
  const componentCss = readdirSync(componentDirectory)
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(resolve(componentDirectory, file), 'utf8'))
    .join('\n')

  it('keeps motion curves centralized in the shared theme', () => {
    expect(componentCss).not.toContain('cubic-bezier(')
  })

  it('uses effects motion for opacity and spatial motion for transforms', () => {
    expect(componentCss).not.toMatch(
      /opacity[^;\n]*var\(--m3-motion-transition-(?:fast|default|slow)-spatial\)/,
    )
    expect(componentCss).not.toMatch(
      /transform[^;\n]*var\(--m3-motion-transition-(?:fast|default|slow)-effects\)/,
    )
  })
})
