import { useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from 'graphql.macro';
import { ApiPromise } from '@polkadot/api';
import {
  lbpConstantsQueryResolverFactory,
  useLbpConstantsQueryResolver,
} from './lbpConstants';
import { LbpConstants } from '../../../../../generated/graphql';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { ReactNode } from 'react';
import errors from '../../../../../errors';

jest.mock('../../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    return {
      apiInstance: {},
      loading: false,
    } as unknown as ApiPromise;
  },
}));

const mockedGetRepayFee = jest.fn();
jest.mock('../../../lib/getRepayFee', () => ({
  getRepayFee: () => mockedGetRepayFee(),
}));

describe('lbpConstants', () => {
  describe('useLbpConstantsQueryResolver', () => {
    const mockedGetRepayFeeValue = {
      numerator: '3',
      denominator: '4',
    };

    beforeEach(() => {
      mockedGetRepayFee.mockReturnValueOnce(mockedGetRepayFeeValue);
    });

    describe('success case', () => {
      const useTestResolvers = () => {
        return {
          Query: {
            ...useLbpConstantsQueryResolver(),
          },
        };
      };

      interface TestQueryResponse {
        lbp: LbpConstants;
      }

      const useTestQuery = () => {
        return useQuery<TestQueryResponse>(
          gql`
            query GetLbp {
              lbp @client
            }
          `
        );
      };

      const renderHookOptions = (resolvers: RenderResult<any>) => {
        return {
          wrapper: (props: { children: ReactNode }) => {
            // https://github.com/testing-library/eslint-plugin-testing-library/issues/386
            // eslint-disable-next-line testing-library/no-node-access
            const children = props.children;
            return (
              <MockedProvider resolvers={resolvers.current}>
                {children}
              </MockedProvider>
            );
          },
        };
      };

      it('can resolve the query within the rendered component', async () => {
        const { result: resolvers } = renderHook(() => useTestResolvers());

        const { result: query, waitForNextUpdate } = renderHook(
          () => useTestQuery(),
          renderHookOptions(resolvers)
        );

        await waitForNextUpdate();

        expect(query.current.data).toEqual({
          lbp: {
            repayFee: {
              numerator: mockedGetRepayFeeValue.numerator,
              denominator: mockedGetRepayFeeValue.denominator,
            },
          },
        });
      });
    });

    describe('fail case', () => {
      it('fails to resolve with missing ApiInstance', () => {
        const brokenApiInstance = undefined as unknown as ApiPromise;
        const lbpConstantsQueryResolver =
          lbpConstantsQueryResolverFactory(brokenApiInstance);

        expect(lbpConstantsQueryResolver).toThrowError(
          errors.apiInstanceNotInitialized
        );
      });
    });
  });
});
