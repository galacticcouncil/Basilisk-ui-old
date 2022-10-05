import { ApiPromise } from '@polkadot/api'
import { signAndSend } from './signAndSend'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { InMemoryCache } from '@apollo/client'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types'
import { readActiveAccount } from '../accounts/lib/readActiveAccount'

const web3FromAddressMocked = web3FromAddress as jest.Mock
const readActiveAccountMocked = readActiveAccount as jest.Mock

jest.mock('@polkadot/extension-dapp', () => {
  return { web3FromAddress: jest.fn() }
})
jest.mock('../accounts/readActiveAccount', () => {
  return { readActiveAccount: jest.fn() }
})

const extrinsicFailedIsMock = jest.fn()
const findMetaErrorMock = jest.fn()

export const getMockApiPromise = (): jest.Mocked<ApiPromise> =>
  ({
    events: { system: { ExtrinsicFailed: { is: extrinsicFailedIsMock } } },
    registry: { findMetaError: findMetaErrorMock }
  } as unknown as jest.Mocked<ApiPromise>)

describe('signAndSend', () => {
  let mockApiInstance: jest.Mocked<ApiPromise>
  let apolloCache = new InMemoryCache()
  let transactionSignAndSendMock = jest.fn()
  let transaction = {
    signAndSend: transactionSignAndSendMock
  } as unknown as SubmittableExtrinsic<'promise', ISubmittableResult>
  let signer = {}
  let unsubscribe = jest.fn()
  let address = {
    id: 'address-id'
  }

  const setupTransactionSignAndSendMock = (data: object) => {
    transactionSignAndSendMock.mockImplementation(
      async (_addressId, _signer, callback) => {
        setTimeout(() => callback(data), 0)

        return unsubscribe
      }
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
    mockApiInstance = getMockApiPromise()
    findMetaErrorMock.mockImplementation((arg) => arg)
    web3FromAddressMocked.mockResolvedValue({ signer })
    readActiveAccountMocked.mockReturnValue(address)
  })

  it('throws error if no active account is selected', async () => {
    readActiveAccountMocked.mockReturnValue(null)

    await expect(
      signAndSend(apolloCache, transaction, mockApiInstance)
    ).rejects.toThrow()
  })

  it('resolves if there are no errors in signAndSend', async () => {
    setupTransactionSignAndSendMock({
      status: { isInBlock: true },
      events: []
    })

    await expect(
      signAndSend(apolloCache, transaction, mockApiInstance)
    ).resolves.toBeNull()
    expect(web3FromAddressMocked).toBeCalledTimes(1)
    expect(web3FromAddressMocked).toBeCalledWith(address.id)
    expect(unsubscribe).toBeCalledTimes(1)
  })

  describe('extrinsic errors', () => {
    beforeEach(() => {
      extrinsicFailedIsMock.mockReturnValue(true)
    })

    it('rejects with catalog meta error', async () => {
      const mockedError = {
        error: 'mocked-error',
        isModule: true,
        asModule: {
          docs: ['mocked', 'docs'],
          method: 'mocked-method',
          section: 'mocked-section'
        }
      }
      setupTransactionSignAndSendMock({
        status: { isInBlock: true },
        events: [{ event: { data: [mockedError] } }]
      })

      await expect(
        signAndSend(apolloCache, transaction, mockApiInstance)
      ).rejects.toEqual({
        errors: expect.arrayContaining([mockedError.asModule])
      })
      expect(unsubscribe).toBeCalledTimes(1)
    })

    it('rejects with other error', async () => {
      const mockedError = {
        error: 'mocked-error',
        isModule: false
      }
      setupTransactionSignAndSendMock({
        status: { isInBlock: true },
        events: [{ event: { data: [mockedError] } }]
      })

      await expect(
        signAndSend(apolloCache, transaction, mockApiInstance)
      ).rejects.toEqual({
        errors: expect.arrayContaining([mockedError])
      })
      expect(unsubscribe).toBeCalledTimes(1)
    })
  })
})
