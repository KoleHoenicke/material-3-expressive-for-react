import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('package boundary', () => {
  it('does not ship media playback hooks or media assets in component source', () => {
    const componentDirectory = resolve(process.cwd(), 'src/components')
    const source = readdirSync(componentDirectory)
      .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
      .map((file) => readFileSync(resolve(componentDirectory, file), 'utf8'))
      .join('\n')

    expect(source).not.toMatch(/new Audio\s*\(|\.mp3|\.wav|\.ogg/i)
  })
})
