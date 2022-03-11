import { Resolvers, useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from 'graphql.macro';
import { ApiPromise } from '@polkadot/api';
import TestRenderer, { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import { useLbpConstantsQueryResolver } from './lbpConstants';
import { LbpConstants } from '../../../../../generated/graphql';

const mockedGetRepayFeeValue = {
  numerator: '3',
  denominator: '4',
};

jest.mock('../../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    return {
      apiInstance: {},
      loading: false,
    } as unknown as ApiPromise;
  },
}));

jest.mock('../../../lib/getRepayFee', () => ({
  getRepayFee: () => mockedGetRepayFeeValue,
}));

describe('lbpConstants', () => {
  describe('lbpConstantsQueryResolvers', () => {
    const useResolvers = () => {
      return {
        Query: {
          ...useLbpConstantsQueryResolver(),
        },
      };
    };
    const resolverProviderFactory =
      (useResolvers: () => Resolvers) =>
      ({ children }: { children: React.ReactNode }): JSX.Element => {
        return (
          <MockedProvider resolvers={useResolvers()}>{children}</MockedProvider>
        );
      };

    interface TestQueryResponse {
      lbp: LbpConstants;
    }
    const Test = () => {
      const { data } = useQuery<TestQueryResponse>(
        gql`
          query GetLbpConstants {
            lbp @client
          }
        `
      );

      return <>{JSON.stringify(data)}</>;
    };

    let component: TestRenderer.ReactTestRenderer;
    const render = () => {
      const ResolverProvider = resolverProviderFactory(useResolvers);
      component = TestRenderer.create(
        <ResolverProvider>
          <Test />
        </ResolverProvider>
      );
    };

    let data: () => TestQueryResponse | undefined = () =>
      JSON.parse(component.toJSON() as unknown as string);

    it('can resolve the query within the rendered component', async () => {
      render();

      await act(async () => {
        await waitForExpect(() => {
          expect(data()?.lbp).toEqual({
            repayFee: {
              denominator: mockedGetRepayFeeValue.denominator,
              numerator: mockedGetRepayFeeValue.numerator,
            },
          });
        });
      });
    });
  });
});
