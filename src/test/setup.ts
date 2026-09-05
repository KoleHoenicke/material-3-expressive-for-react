import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

configure({ asyncUtilTimeout: process.env.CI ? 5_000 : 1_000 })

class TestResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    void callback
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    void target
    void options
  }

  unobserve(target: Element) {
    void target
  }

  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = TestResizeObserver
}

if (!globalThis.PointerEvent) {
  class TestPointerEvent extends MouseEvent {
    pointerId: number
    isPrimary: boolean
    pointerType: string

    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 0
      this.isPrimary = init.isPrimary ?? false
      this.pointerType = init.pointerType ?? ''
    }
  }

  globalThis.PointerEvent = TestPointerEvent as typeof PointerEvent
}

afterEach(() => {
  cleanup()
})
