import { beforeEach, vi } from 'vitest'

export function setupStorageMock() {
  let localStorageMock: Record<string, string> = {}

  beforeEach(() => {
    vi.restoreAllMocks()
    localStorageMock = {}

    const mockStorage = {
      getItem: (key: string) => localStorageMock[key] || null,
      setItem: (key: string, value: string) => { localStorageMock[key] = value.toString() },
      clear: () => { localStorageMock = {} },
      removeItem: (key: string) => { delete localStorageMock[key] },
      length: 0,
      key: (index: number) => Object.keys(localStorageMock)[index] || null
    }

    // Force injection onto both execution contexts to bypass native runtime properties
    Object.defineProperty(window, 'localStorage', { value: mockStorage, configurable: true, writable: true })
    Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, configurable: true, writable: true })
  })
}
