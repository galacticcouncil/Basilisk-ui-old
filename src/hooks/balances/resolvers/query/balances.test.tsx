import {
  balancesByAddressQueryResolverFactory,
  BalancesByAddressResolverArgs,
  Entity,
  objectToArrayWithoutNull,
  useBalanceQueryResolvers,
} from './balances';

import { AssetIds, Balance } from '../../../../generated/graphql';
import { Resolvers, useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import TestRenderer, { act } from 'react-test-renderer';
import { gql } from 'graphql.macro';
import {
  getMockApiPromise,
  nativeAssetBalance,
  nonNativeAssetBalance,
} from '../../../polkadotJs/tests/mockUsePolkadotJsContext';
import { ApiPromise } from '@polkadot/api';
import waitForExpect from 'wait-for-expect';
waitForExpect.defaults.interval = 1;

jest.mock('../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    // jest executes before imports, that's why require is here
    const {
      mockUsePolkadotJsContext,
    } = require('../../../polkadotJs/tests/mockUsePolkadotJsContext');
    return mockUsePolkadotJsContext();
  },
}));

describe('hooks/balances/resolvers/query/balances', () => {
  describe('objectToArrayWithoutNull', () => {
    it('can convert an object to an array', () => {
      const assetIds = {
        a: '0',
        b: '1',
      };
      const assets = objectToArrayWithoutNull(assetIds);

      expect(assets).toEqual(['0', '1']);
    });

    it('can convert an object to an array with one null value', () => {
      const assetIds: AssetIds = {
        a: '0',
        b: null,
      };
      const assets = objectToArrayWithoutNull(assetIds);

      expect(assets).toEqual(['0']);
    });

    it('can convert an object to an array with one undefined value', () => {
      const assetIds: AssetIds = {
        a: '0',
        b: undefined,
      };
      const assets = objectToArrayWithoutNull(assetIds);

      expect(assets).toEqual(['0']);
    });

    it('does transform when an array is passed', () => {
      const assetIds = ['0', '1', '2'];
      const assets = objectToArrayWithoutNull(assetIds);

      expect(assets).toEqual(assetIds);
    });
  });

  describe('balancesByAddressQueryResolver', () => {
    function fetchBalancesSuccessCase(
      description: string,
      entity: Entity,
      args: BalancesByAddressResolverArgs,
      expectedBalances: any
    ) {
      // eslint-disable-next-line jest/valid-title
      it(description, async () => {
        const balancesByAddressQueryResolver =
          await balancesByAddressQueryResolverFactory(mockApiPromise);
        const balances = await balancesByAddressQueryResolver(entity, args);

        expect(balances).toEqual(expectedBalances);
      });
    }

    let mockApiPromise: ApiPromise;
    beforeEach(() => {
      jest.resetAllMocks();
      mockApiPromise = getMockApiPromise();
    });

    const address = 'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak';
    const entity: Entity = { id: address };
    const assetIdA = '0';
    const assetIdB = '1';

    fetchBalancesSuccessCase(
      'can fetch balance for entity with object as parameter (1 assetId)',
      entity,
      { assetIds: { a: assetIdA } },
      [
        {
          __typename: 'Balance',
          assetId: assetIdA,
          balance: nativeAssetBalance,
          id: `${address}-${assetIdA}`,
        },
      ]
    );

    fetchBalancesSuccessCase(
      'can fetch balance for entity with object as parameter (2 assetIds)',
      entity,
      { assetIds: { a: assetIdA, b: assetIdB } },
      [
        {
          __typename: 'Balance',
          assetId: assetIdA,
          balance: nativeAssetBalance,
          id: `${address}-${assetIdA}`,
        },
        {
          __typename: 'Balance',
          assetId: assetIdB,
          balance: nonNativeAssetBalance,
          id: `${address}-${assetIdB}`,
        },
      ]
    );

    fetchBalancesSuccessCase(
      'can fetch balance entity with array as parameter (1 assetId)',
      entity,
      { assetIds: [assetIdA] },
      [
        {
          __typename: 'Balance',
          assetId: assetIdA,
          balance: nativeAssetBalance,
          id: `${address}-${assetIdA}`,
        },
      ]
    );

    fetchBalancesSuccessCase(
      'can fetch balance entity with array as parameter (2 assetIds)',
      entity,
      { assetIds: [assetIdA, assetIdB] },
      [
        {
          __typename: 'Balance',
          assetId: assetIdA,
          balance: nativeAssetBalance,
          id: `${address}-${assetIdA}`,
        },
        {
          __typename: 'Balance',
          assetId: assetIdB,
          balance: nonNativeAssetBalance,
          id: `${address}-${assetIdB}`,
        },
      ]
    );
  });

  describe('useBalanceQueryResolvers', () => {
    interface TestQueryResponse {
      mockEntity: { balances: Balance[] };
    }
    const Test = () => {
      const { data } = useQuery<TestQueryResponse>(
        gql`
          query GetBalances {
            mockEntity @client {
              balances(assetIds: { a: "0" }) {
                assetId
                balance
              }
            }
          }
        `,
        { returnPartialData: true }
      );

      return <>{JSON.stringify(data)}</>;
    };

    const useResolvers = () => {
      return {
        Query: {
          // typename needs to begin with capital letter
          mockEntity: () => ({
            id: 'address',
            __typename: 'MockEntity',
          }),
        },
        // this key needs to be the same as __typename
        MockEntity: {
          ...useBalanceQueryResolvers(),
        },
      };
    };

    let component: TestRenderer.ReactTestRenderer;
    // testing helper to wrap a testing component into a provider with configured resolvers
    const resolverProviderFactory =
      (useResolvers: () => Resolvers) =>
      ({ children }: { children: React.ReactNode }): JSX.Element => {
        return (
          <MockedProvider resolvers={useResolvers()}>{children}</MockedProvider>
        );
      };

    // combine resolvers and the 'Test' component and render them
    const render = () => {
      const ResolverProvider = resolverProviderFactory(useResolvers);
      component = TestRenderer.create(
        <ResolverProvider>
          <Test />
        </ResolverProvider>
      );
    };

    beforeEach(() => {
      jest.resetModules();
      render();
    });
    let data: () => TestQueryResponse | undefined = () =>
      JSON.parse(component.toJSON() as unknown as string);

    it('can resolve the query within the rendered component', async () => {
      await act(async () => {
        await waitForExpect(() => {
          expect(data()?.mockEntity.balances).toEqual([
            { __typename: 'Balance', assetId: '0', balance: '10' },
          ]);
        });
      });
    });
  });
});
