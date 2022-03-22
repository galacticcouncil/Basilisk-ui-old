import { ApiPromise } from '@polkadot/api';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { ReactNode } from 'react';
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs';
import { getRepayFee } from '../lib/getRepayFee';
import { useGetLbpConstantsQuery } from '../queries/useGetLbpConstantsQuery/useGetLbpConstantsQuery';
import { useConstantsResolvers } from './useConstantsResolvers';
import { __typename } from './query/constants/constants';

interface HooksTestParams {
  name: string;
  hook: () => any;
  specificMocks: () => any;
  expectedData: any;
  expectedCache: any;
}

jest.mock('../../polkadotJs/usePolkadotJs');
jest.mock('../lib/getRepayFee');

describe('useConstantsResolvers', () => {
  const usePolkadotJsContextMock = usePolkadotJsContext as unknown as jest.Mock<
    typeof usePolkadotJsContext
  >;
  const getMockedPolkadotJsContext = () => ({
    apiInstance: {} as ApiPromise,
    loading: false,
  });
  const cacheKey = `${__typename}:${__typename}`;
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

  beforeEach(() => {
    usePolkadotJsContextMock.mockImplementationOnce(() =>
      jest.fn().mockImplementationOnce(getMockedPolkadotJsContext)()
    );
  });

  const testHooks = [
    {
      name: 'useGetLbpConstantsQuery',
      hook: useGetLbpConstantsQuery,
      specificMocks: () => {
        const getRepayFeeMock = getRepayFee as unknown as jest.Mock<
          typeof getRepayFee
        >;
        getRepayFeeMock.mockImplementationOnce(() =>
          jest.fn().mockReturnValueOnce({
            numerator: 'mock',
            denominator: 'mock',
          })()
        );
      },
      expectedData: {
        constants: {
          __typename: __typename,
          lbp: {
            repayFee: {
              numerator: expect.anything(),
              denominator: expect.anything(),
            },
          },
        },
      },
      expectedCache: {
        [cacheKey]: {
          __typename: __typename,
          id: __typename,
          lbp: {
            repayFee: {
              numerator: expect.anything(),
              denominator: expect.anything(),
            },
          },
        },
        ROOT_QUERY: {
          __typename: 'Query',
          constants: { __ref: cacheKey },
        },
      },
    },
  ];

  describe.each(testHooks)(
    'useConstantsResolvers',
    ({
      name,
      hook,
      specificMocks,
      expectedData,
      expectedCache,
    }: HooksTestParams) => {
      test(`${name}`, async () => {
        specificMocks();
        const { result: resolvers } = renderHook(() => useTestResolvers());
        const { result: query, waitForNextUpdate } = renderHook(
          () => hook(),
          renderHookOptions(cache, resolvers)
        );

        await waitForNextUpdate();
        expect(query.current.data).toEqual(expectedData);
        const updatedCache = cache.extract();
        expect(updatedCache).toEqual(expectedCache);
      });
    }
  );
});
