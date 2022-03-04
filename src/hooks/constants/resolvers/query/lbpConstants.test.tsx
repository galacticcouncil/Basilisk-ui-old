import { useLbpConstantsQueryResolver } from './lbpConstants';
import { LbpConstants } from '../../../../generated/graphql';
import { Resolvers, useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import TestRenderer, { act } from 'react-test-renderer';
import { gql } from 'graphql.macro';
import waitForExpect from 'wait-for-expect';

jest.mock('../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    /**
     * Jest.mock executes before any import. Requiring a module inside a mock is
     * what makes this work, if the mock-module or value is defined/required
     * outside of jest.mock(...) then this mock does not work.
     */
    const {
      mockUsePolkadotJsContext,
    } = require('../../../polkadotJs/tests/mockUsePolkadotJsContext');
    return mockUsePolkadotJsContext();
  },
}));

describe('lbpConstants', () => {
  describe('useLbpConstantsQueryResolvers', () => {
    const useResolvers = () => {
      return {
        Query: {
          mockEntity: () => ({
            lbp: {
              repayFee: {
                numerator: '2',
                denominator: '10',
                __typename: 'Fee',
              },
              __typename: 'LBPConstants',
            },
            __typename: 'Constants',
          }),
        },
        MockEntity: {
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
      mockEntity: { lbp: LbpConstants };
    }
    const Test = () => {
      const { data } = useQuery<TestQueryResponse>(
        gql`
          query GetLbpConstants {
            mockEntity @client {
              lbp {
                repayFee
              }
            }
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
          expect(data()?.mockEntity.lbp).toEqual({
            __typename: 'LBPConstants',
            repayFee: {
              __typename: 'Fee',
              numerator: '2',
              denominator: '10',
            },
          });
        });
      });
    });
  });
});
