import {
  balancesByAddressQueryResolverFactory,
  BalancesByAddressResolverArgs,
  Entity,
  objectToArrayWithFilter,
  useBalanceQueryResolvers,
} from './balances';
import { Balance } from '../../../../generated/graphql';
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
import errors from '../../../../errors';
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
    return mockUsePolkadotJsContext;
  },
}));

describe('balances', () => {
  describe('objectToArrayWithFilter', () => {
    describe.each([
      [
        {
          a: '0',
          b: '1',
        },
        ['0', '1'],
      ],
      [
        {
          a: '0',
          b: null,
        },
        ['0'],
      ],
      [
        {
          a: '0',
          b: undefined,
        },
        ['0'],
      ],
      [
        ['0', '1', '2'],
        ['0', '1', '2'],
      ],
    ])('can convert an object to an array', (assetIds, expectedAssetIds) => {
      const assetIdsFilteredTransformed = objectToArrayWithFilter(assetIds);

      expect(assetIdsFilteredTransformed).toEqual(expectedAssetIds);
    });
  });

  describe('balancesByAddressQueryResolver', () => {
    let mockApiInstance: ApiPromise;

    beforeEach(() => {
      jest.resetAllMocks();
      mockApiInstance = getMockApiPromise();
    });

    const address = 'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak';
    const entity: Entity = { id: address };
    const assetIdA = '0';
    const assetIdB = '1';

    describe.each([
      [
        'can fetch balance for entity with object as parameter (1 assetId)',
        entity,
        { assetIds: { a: assetIdA } },
        [
          [assetIdA, nativeAssetBalance], // tuple
        ],
      ],
      [
        'can fetch balance for entity with object as parameter (2 assetIds)',
        entity,
        { assetIds: { a: assetIdA, b: assetIdB } },
        [
          [assetIdA, nativeAssetBalance],
          [assetIdB, nonNativeAssetBalance],
        ],
      ],
      [
        'can fetch balance entity with array as parameter (1 assetId)',
        entity,
        { assetIds: [assetIdA] },
        [[assetIdA, nativeAssetBalance]],
      ],
      [
        'can fetch balance entity with array as parameter (2 assetIds)',
        entity,
        { assetIds: [assetIdA, assetIdB] },
        [
          [assetIdA, nativeAssetBalance],
          [assetIdB, nonNativeAssetBalance],
        ],
      ],
    ])(
      'balancesByAddressQueryResolver',
      (
        description: string,
        entity: Entity,
        args: BalancesByAddressResolverArgs,
        expected: any
      ) => {
        // eslint-disable-next-line jest/valid-title
        test(description, async () => {
          const balancesByAddressQueryResolver =
            await balancesByAddressQueryResolverFactory(mockApiInstance);

          const balances = await balancesByAddressQueryResolver(entity, args);

          const expectedBalances = expected.map(
            (expectedBalance: [string, string]) => {
              return {
                __typename: 'Balance',
                assetId: expectedBalance[0],
                balance: expectedBalance[1],
                id: `${address}-${expectedBalance[0]}`,
              };
            }
          );
          expect(balances).toEqual(expectedBalances);
        });
      }
    );

    it('fails to fetch without PolkadotJS ApiPromise', async () => {
      const brokenApiInstance = undefined as unknown as ApiPromise;
      const balancesByAddressQueryResolver =
        await balancesByAddressQueryResolverFactory(brokenApiInstance);

      const balancesByAddressQueryResolverPromise =
        balancesByAddressQueryResolver(entity, { assetIds: { a: assetIdA } });

      await expect(balancesByAddressQueryResolverPromise).rejects.toMatchObject(
        Error(errors.apiInstanceNotInitialized)
      );
    });

    it('fails to fetch with wrong arguments', async () => {
      const balancesByAddressQueryResolver =
        await balancesByAddressQueryResolverFactory(mockApiInstance);
      const brokenArgs = {
        assetIds: undefined,
      } as unknown as BalancesByAddressResolverArgs;
      const balancesByAddressQueryResolverPromise =
        balancesByAddressQueryResolver(entity, brokenArgs);

      await expect(balancesByAddressQueryResolverPromise).rejects.toMatchObject(
        Error(errors.noArgumentsProvidedBalanceQuery)
      );
    });
  });

  describe('useBalanceQueryResolvers', () => {
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
    // testing helper to wrap a testing component into a provider with configured resolvers
    const resolverProviderFactory =
      (useResolvers: () => Resolvers) =>
      ({ children }: { children: React.ReactNode }): JSX.Element => {
        return (
          <MockedProvider resolvers={useResolvers()}>{children}</MockedProvider>
        );
      };

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
        `
      );

      return <>{JSON.stringify(data)}</>;
    };

    let component: TestRenderer.ReactTestRenderer;
    // combine resolvers and the 'Test' component and render them
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

    beforeEach(() => {
      jest.resetModules();
    });

    it('can resolve the query within the rendered component', async () => {
      render();

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
