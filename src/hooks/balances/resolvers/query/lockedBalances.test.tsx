import {
  Entity,
  lockedBalancesByLockIdQueryResolverFactory,
  LockedBalancesByLockIdResolverArgs,
  useLockedBalanceQueryResolvers,
} from './lockedBalances';
import { LockedBalance } from '../../../../generated/graphql';
import { Resolvers, useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import TestRenderer, { act } from 'react-test-renderer';
import { gql } from 'graphql.macro';
import { ApiPromise } from '@polkadot/api';
import errors from '../../../../errors';
import waitForExpect from 'wait-for-expect';
import constants from '../../../../constants';

const mockedLockedNativeBalances = jest.fn();
const getMockApiPromise = () =>
  ({
    query: {
      balances: {
        locks: mockedLockedNativeBalances,
      },
    },
  } as unknown as ApiPromise);

jest.mock('../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    return { apiInstance: getMockApiPromise() };
  },
}));

describe('lockedBalances', () => {
  const address = 'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak';
  const entity: Entity = { id: address };
  const lockId = '0x6f726d6c76657374';
  const mockLockedNativeBalancesApi = [{ id: lockId, amount: '10' }];
  const typeName = 'LockedBalance';

  describe('balancesByAddressQueryResolver', () => {
    let mockApiInstance: ApiPromise;

    beforeEach(() => {
      mockApiInstance = getMockApiPromise();

      mockedLockedNativeBalances.mockReturnValueOnce(
        mockLockedNativeBalancesApi
      );
    });

    it('fails to fetch without PolkadotJS ApiPromise', async () => {
      const brokenApiInstance = undefined as unknown as ApiPromise;
      const lockedBalancesByLockIdQueryResolver =
        await lockedBalancesByLockIdQueryResolverFactory(brokenApiInstance);

      const lockedBalancesByLockIdQueryResolverPromise =
        lockedBalancesByLockIdQueryResolver(entity, { lockId: lockId });

      await expect(
        lockedBalancesByLockIdQueryResolverPromise
      ).rejects.toMatchObject(Error(errors.apiInstanceNotInitialized));
    });

    it('fails to fetch with wrong arguments', async () => {
      const lockedBalancesByLockIdQueryResolver =
        await lockedBalancesByLockIdQueryResolverFactory(mockApiInstance);
      const brokenArgs = {
        assetIds: undefined,
      } as unknown as LockedBalancesByLockIdResolverArgs;

      const lockedBalancesByLockIdQueryResolverPromise =
        lockedBalancesByLockIdQueryResolver(entity, brokenArgs);

      await expect(
        lockedBalancesByLockIdQueryResolverPromise
      ).rejects.toMatchObject(
        Error(errors.noArgumentsProvidedLockedBalanceQuery)
      );
    });

    it('can fetch lockedBalance by lockId', async () => {
      const lockedBalancesByLockIdQueryResolver =
        await lockedBalancesByLockIdQueryResolverFactory(mockApiInstance);

      const lockedBalances = await lockedBalancesByLockIdQueryResolver(entity, {
        lockId: lockId,
      });

      expect(lockedBalances).toEqual([
        {
          __typename: typeName,
          id: `${address}-${constants.nativeAssetId}-${lockId}`,
          assetId: constants.nativeAssetId,
          balance: mockLockedNativeBalancesApi[0].amount,
          lockId: mockLockedNativeBalancesApi[0].id,
        },
      ]);
    });
  });

  describe('useLockedBalanceQueryResolvers', () => {
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
          ...useLockedBalanceQueryResolvers(),
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
      mockEntity: { lockedBalances: LockedBalance[] };
    }
    const Test = () => {
      const { data } = useQuery<TestQueryResponse>(
        gql`
          query GetLockedBalances {
            mockEntity @client {
              lockedBalances(lockId: "0x6f726d6c76657374") {
                assetId
                balance
                lockId
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
      mockedLockedNativeBalances.mockReturnValueOnce(
        mockLockedNativeBalancesApi
      );
    });

    it('can resolve the query within the rendered component', async () => {
      render();

      await act(async () => {
        await waitForExpect(() => {
          expect(data()?.mockEntity.lockedBalances).toEqual([
            {
              __typename: 'LockedBalance',
              assetId: constants.nativeAssetId,
              balance: mockLockedNativeBalancesApi[0].amount,
              lockId: lockId,
            },
          ]);
        });
      });
    });
  });
});
