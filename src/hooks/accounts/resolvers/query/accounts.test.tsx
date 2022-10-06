import { Resolvers } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import TestRenderer, { act } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'
import {
  GetAccountsQueryResponse,
  useGetAccountsQuery
} from '../../queries/useGetAccountsQuery'
import { useAccountsQueryResolver } from './accounts'

const mockGetAccounts = jest.fn()
jest.mock('../../lib/getAccounts.tsx', () => ({
  getAccounts: () => mockGetAccounts()
}))

// test component that returns the query result(s)
const Test = () => {
  const { data } = useGetAccountsQuery()

  return <>{JSON.stringify(data)}</>
}

const useResolvers = () => {
  return {
    Query: {
      ...useAccountsQueryResolver()
    }
  }
}

// testing helper to wrap a testing component into a provider with configured resolvers
const resolverProviderFactory =
  (useResolvers: () => Resolvers) =>
  ({ children }: { children: React.ReactNode }) => {
    return (
      <MockedProvider resolvers={useResolvers()}>{children}</MockedProvider>
    )
  }

describe('useAccountsQueryResolver', () => {
  // rendered 'Test' component wrapped in a 'MockedProvider'
  let component: TestRenderer.ReactTestRenderer
  // function to parse / cast the rendering result of 'Test' into the required testing data
  let data: () => GetAccountsQueryResponse | undefined = () =>
    JSON.parse(component.toJSON() as unknown as string)

  // combine resolvers and the 'Test' component and render them
  const render = () => {
    const ResolverProvider = resolverProviderFactory(useResolvers)
    component = TestRenderer.create(
      <ResolverProvider>
        <Test />
      </ResolverProvider>
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.resetModules()
  })

  describe('falsy case', () => {
    it('should resolve accounts as null when no accounts are found', async () => {
      mockGetAccounts.mockImplementation(() => null)

      render()

      await act(async () => {
        await waitForExpect(() => {
          expect(data()?.accounts).toBe(null)
        })
      })
    })
  })

  describe('truthy case', () => {
    it('should resolve accounts as an array with typename when accounts are found', async () => {
      mockGetAccounts.mockImplementation(() => [
        {
          id: 'mockId',
          name: 'Mocked Account',
          source: 'polkadot-js',
          balances: []
        }
      ])

      render()

      await act(async () => {
        await waitForExpect(() => {
          expect(data()?.accounts).toStrictEqual([
            {
              id: 'mockId',
              name: 'Mocked Account',
              source: 'polkadot-js',
              balances: [],
              __typename: 'Account'
            }
          ])
        })
      })
    })
  })
})
