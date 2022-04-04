import {
  Entity,
  lockedBalancesByLockIdQueryResolverFactory,
  useLockedBalanceQueryResolvers,
} from './lockedBalances';
import { LockedBalance, QueryLockedBalancesArgs } from '../../../../generated/graphql';
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
  const entityAddress = 'bXmoSgp2Vtvctj5c292YDYu1vcYC4A5Hs1gdMjRhfXUf7Ht6x';
  const entity: Entity = { id: entityAddress };
  const lockId = '0x6f726d6c76657374';
  const mockLockedNativeBalancesApi = [{ id: lockId, amount: '10' }];
  const typeName = 'LockedBalance';
  // TODO type lockedBalancesByLockIdQueryResolver in implementation
  let lockedBalancesByLockIdQueryResolver: any;

  describe('balancesByAddressQueryResolver', () => {
    let mockApiInstance: ApiPromise;

    beforeEach(async () => {
      mockApiInstance = getMockApiPromise();

      mockedLockedNativeBalances.mockReturnValueOnce(
        mockLockedNativeBalancesApi
      );

      lockedBalancesByLockIdQueryResolver =
        await lockedBalancesByLockIdQueryResolverFactory(mockApiInstance);
    });

    describe('fail cases', () => {
      it('fails to fetch without PolkadotJS ApiPromise', async () => {
        const brokenApiInstance = undefined as unknown as ApiPromise;
        const lockedBalancesByLockIdQueryResolver =
          await lockedBalancesByLockIdQueryResolverFactory(brokenApiInstance);

        const lockedBalancesByLockIdQueryResolverPromise =
          lockedBalancesByLockIdQueryResolver(entity, {
            address,
            lockId,
          });

        await expect(
          lockedBalancesByLockIdQueryResolverPromise
        ).rejects.toMatchObject(Error(errors.apiInstanceNotInitialized));
      });

      it('fails to fetch with wrong arguments', async () => {
        const brokenArgs = {
          lockId: undefined,
        } as unknown as QueryLockedBalancesArgs;

        const lockedBalancesByLockIdQueryResolverPromise =
          lockedBalancesByLockIdQueryResolver(entity, brokenArgs);

        await expect(
          lockedBalancesByLockIdQueryResolverPromise
        ).rejects.toMatchObject(
          Error(errors.missingArgumentsLockedBalanceQuery)
        );
      });

      it('fails to fetch with wrong arguments and missing parent entity', async () => {
        const brokenArgs = {
          lockId: 'lockId',
        } as unknown as QueryLockedBalancesArgs;
        const brokenEntity = {} as unknown as Entity;

        const lockedBalancesByLockIdQueryResolverPromise =
          lockedBalancesByLockIdQueryResolver(brokenEntity, brokenArgs);

        await expect(
          lockedBalancesByLockIdQueryResolverPromise
        ).rejects.toMatchObject(
          Error(errors.missingArgumentsLockedBalanceQuery)
        );
      });
    });

    it('can fetch lockedBalance by lockId and address', async () => {
      const lockedBalances = await lockedBalancesByLockIdQueryResolver(entity, {
        address,
        lockId,
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
      expect(mockedLockedNativeBalances).toHaveBeenCalledWith(address);
    });

    it('can fetch lockedBalance by lockId and entity address', async () => {
      const lockedBalances = await lockedBalancesByLockIdQueryResolver(entity, {
        // address is not specified in this case
        lockId,
      });

      expect(lockedBalances).toEqual([
        {
          __typename: typeName,
          // entity address
          id: `${entityAddress}-${constants.nativeAssetId}-${lockId}`,
          assetId: constants.nativeAssetId,
          balance: mockLockedNativeBalancesApi[0].amount,
          lockId: mockLockedNativeBalancesApi[0].id,
        },
      ]);
      expect(mockedLockedNativeBalances).toHaveBeenCalledWith(entityAddress);
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
              lockedBalances(
                address: "bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak"
                lockId: "0x6f726d6c76657374"
              ) {
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
