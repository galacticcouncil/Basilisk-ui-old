import { ApiPromise } from '@polkadot/api';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { ReactNode } from 'react';
import { useGetConstantsQuery } from './useGetConstantsQuery';
import { useConstantsResolvers } from '../../resolvers/useConstantsResolvers';
import { __typename } from './../../resolvers/query/constants/constants';

const mockedApiInstance = jest.fn();
jest.mock('../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => mockedApiInstance(),
}));

const mockedGetRepayFee = jest.fn();
jest.mock('../../lib/getRepayFee', () => ({
  getRepayFee: () => mockedGetRepayFee(),
}));

describe('useGetConstantsQuery', () => {
  const mockedUsePolkadotJsContext = {
    apiInstance: {},
    loading: false,
  } as unknown as ApiPromise;

  const mockedGetRepayFeeValue = {
    numerator: '3',
    denominator: '4',
  };

  beforeEach(() => {
    mockedApiInstance.mockReturnValueOnce(mockedUsePolkadotJsContext);
    mockedGetRepayFee.mockReturnValueOnce(mockedGetRepayFeeValue);
  });

  describe('success case', () => {
    const cache: InMemoryCache = new InMemoryCache();
    const useTestResolvers = () => useConstantsResolvers();

    const renderHookOptions = (
      cache: InMemoryCache,
      resolvers: RenderResult<any>
    ) => {
      return {
        wrapper: (props: { children: ReactNode }) => {
          // 14.3.2022 ... https://github.com/testing-library/eslint-plugin-testing-library/issues/386
          // eslint-disable-next-line testing-library/no-node-access
          const children = props.children;
          return (
            <MockedProvider cache={cache} resolvers={resolvers.current}>
              {children}
            </MockedProvider>
          );
        },
      };
    };

    it('resolves, caches query result', async () => {
      const { result: resolvers } = renderHook(() => useTestResolvers());
      const { result: query, waitForNextUpdate } = renderHook(
        () => useGetConstantsQuery(),
        renderHookOptions(cache, resolvers)
      );

      await waitForNextUpdate();

      const cacheKey = `
        ${query?.current?.data?.constants.__typename}
        :
        ${query?.current?.data?.constants.id}
      `.replace(/\s+/g, ''); // no whitespace
      // 'Constants:Constants'

      const updatedCache = cache.extract();

      expect(updatedCache).toEqual({
        [cacheKey]: {
          __typename: __typename, // 'Constants'
          id: __typename,
          lbp: {
            repayFee: {
              denominator: mockedGetRepayFeeValue.denominator,
              numerator: mockedGetRepayFeeValue.numerator,
            },
          },
        },
        ROOT_QUERY: {
          __typename: 'Query',
          constants: { __ref: cacheKey },
        },
      });
    });
  });
});
