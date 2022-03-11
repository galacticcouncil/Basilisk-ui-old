import { ApiPromise } from '@polkadot/api';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks'
import { useGetConstantsQuery } from './useGetConstantsQuery'
import { useConstantsQueryResolvers } from '../../resolvers/useConstantsQueryResolvers'

// think about, do 👇
//  auto mock
// test apollo cache
// error states. copy the bad api instance test from balances I think ?
// parameters/dependencies besides api instance ?

const mockedGetRepayFeeValue = {
  numerator: '3',
  denominator: '4',
};

jest.mock('../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    return {
      apiInstance: {},
      loading: false,
    } as unknown as ApiPromise;
  },
}));

jest.mock('../../lib/getRepayFee', () => ({
  getRepayFee: () => mockedGetRepayFeeValue,
}));

describe('useGetConstantsQuery', () => {
  
  it('can resolve the query', async () => {

    const { result: resolvers } = renderHook(() => useConstantsQueryResolvers()) 

    console.log(JSON.stringify(resolvers.current, null, 2))

    const { result: query, waitForNextUpdate } = renderHook(() => useGetConstantsQuery(), {
      wrapper: (props) => (
        // https://github.com/testing-library/eslint-plugin-testing-library/issues/386
        // eslint-disable-next-line testing-library/no-node-access
        <MockedProvider resolvers={resolvers.current}>{props.children}</MockedProvider>
      )
    })

    await waitForNextUpdate()
    
    expect(query.current.data).toEqual({
      constants: {
        __typename: 'Constants',
        id: 'Constants', // id shows up in dev tools and cache,  but not here.  WHY?
        lbp: {
          repayFee: {
            denominator: mockedGetRepayFeeValue.denominator,
            numerator: mockedGetRepayFeeValue.numerator,
          }
        }
      },
    })
  
  });
})