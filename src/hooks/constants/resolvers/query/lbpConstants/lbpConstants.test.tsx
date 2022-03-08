import { Resolvers, useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from 'graphql.macro';
import { ApiPromise } from '@polkadot/api';
import TestRenderer, { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import { useLbpConstantsQueryResolver } from './lbpConstants';
import { LbpConstants } from '../../../../../generated/graphql';

jest.mock('../../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    /**
     * mock more in apiInstance for this resolver
     * as required in future.
     */
    return {
      apiInstance: {},
      loading: false,
    } as unknown as ApiPromise;
  },
}));

describe('lbpConstants', () => {
  describe('useLbpConstantsQueryResolvers', () => {
    const useResolvers = () => {
      return {
        Query: {
          mockEntity: () => ({
            lbp: {
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
              lbp
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
          });
        });
      });
    });
  });
});
