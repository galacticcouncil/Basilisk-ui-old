import { Extension } from '../../../generated/graphql'
import { getExtension } from './getExtension'

export const clearMockInjectedWeb3 = () => {
  delete (window as any).injectedWeb3
}

export const mockInjectedWeb3 = (injected: boolean) => {
  const injectedWeb3 = injected
    ? {
        'polkadot-js': {}
      }
    : {}

  clearMockInjectedWeb3()
  ;(window as any).injectedWeb3 = injectedWeb3
}

describe('getExtension', () => {
  let extension: Extension

  beforeEach(async () => {
    clearMockInjectedWeb3()
    extension = await getExtension()
  })

  describe('extension unavailable', () => {
    it('should set `isAvailable = false`', () => {
      expect(extension.isAvailable).toBe(false)
    })
  })

  describe('extension available', () => {
    beforeEach(async () => {
      mockInjectedWeb3(true)

      extension = await getExtension()
    })

    it('should set `isAvailable = true`', () => {
      expect(extension.isAvailable).toBe(true)
    })
  })
})
