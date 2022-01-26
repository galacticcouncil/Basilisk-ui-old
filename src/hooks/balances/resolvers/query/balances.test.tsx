import {
  balancesByAddressQueryResolverFactory,
  BalancesByAddressResolverArgs,
  useBalanceQueryResolvers,
} from './balances';
import {
  getMockApiPromise,
  nativeAssetBalance,
  nonNativeAssetBalance,
} from '../../lib/getBalancesByAddress.test';
import {
  Account,
  Balance,
  LbpPool,
  XykPool,
} from '../../../../generated/graphql';
import { ApiPromise } from '@polkadot/api';
import { Resolvers, useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import TestRenderer, { act } from 'react-test-renderer';
import { gql } from 'graphql.macro';

let mockApiPromise: ApiPromise;

function fetchBalancesSuccessCase(
  description: string,
  entity: Account | LbpPool | XykPool,
  args: BalancesByAddressResolverArgs,
  expectedBalances: any
) {
  // eslint-disable-next-line jest/valid-title
  it(description, async () => {
    const balancesByAddressQueryResolver =
      await balancesByAddressQueryResolverFactory(mockApiPromise);
    const balances = await balancesByAddressQueryResolver(entity, args);

    // number of returned balances equals requested assets
    expect(balances.length).toEqual(Object.keys(args.assetIds).length);
    expect(balances).toEqual(expectedBalances);
  });
}

describe('hooks/balances/resolvers/query/balances', () => {
  describe('balancesByAddressQueryResolver', () => {
    const address = 'address';
    const account = { id: address } as unknown as Account;
    const lbpPool = { id: address } as unknown as LbpPool;
    const xykPool = { id: address } as unknown as XykPool;
    const assetIdA = '0';
    const assetIdB = '1';

    beforeEach(() => {
      jest.resetAllMocks();
      mockApiPromise = getMockApiPromise();
    });

    fetchBalancesSuccessCase(
      'can fetch balance for Account entity',
      account,
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
      'can fetch balance for LBP pool entity',
      lbpPool,
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
      'can fetch balance for XYK pool entity',
      xykPool,
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
  });

  describe('useBalanceQueryResolvers', () => {
    interface TestQueryResponse {
      mockEntity: { balances: Balance[] };
    }

    const Test = () => {
      const { data } = useQuery<TestQueryResponse>(gql`
        query TestQuery {
          mockEntity {
            balances {
              assetId
              balance
            }
          }
        }
      `);

      return <>{JSON.stringify(data)}</>;
    };

    const useResolvers = () => {
      return {
        Query: {
          // typename needs to begin with capital letter
          mockEntity: () => ({ id: 'address', __typename: 'MockEntity' }),
        },
        // this key needs to be the same as __typename
        MockEntity: {
          ...useBalanceQueryResolvers(),
        },
      };
    };

    let component: TestRenderer.ReactTestRenderer;

    // testing helper to wrap a testing component into a provider with configured resolvers
    // TODO import this function
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
        // TODO mock <PolkadotJsProvider> with mockApiPromise and remove following disable
        /* eslint-disable @typescript-eslint/no-unused-vars */
        <ResolverProvider>
          <Test />
        </ResolverProvider>
      );
    };

    // testing helper to wait for the query to resolve / return data
    // TODO import this function
    const waitForQuery = async () =>
      await new Promise((resolve) => setTimeout(resolve, 0));

    describe('render', () => {
      beforeEach(() => {
        render();
      });
      let data: () => TestQueryResponse | undefined = () =>
        JSON.parse(component.toJSON() as unknown as string);

      it('can render the component', async () => {
        await act(async () => {
          await waitForQuery();
          console.log(data);
        });
      });
    });
  });
});
