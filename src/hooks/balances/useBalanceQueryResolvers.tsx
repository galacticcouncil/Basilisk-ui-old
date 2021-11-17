import { useCallback } from 'react'
import { Account, LbpPool, XykPool } from '../../generated/graphql';
import { useResolverToRef } from '../accounts/resolvers/useAccountsMutationResolvers'
import { useGetBalancesByAddress } from './useGetBalancesByAddress';

export const __typename = 'Balance';
export const useBalanceQueryResolvers = () => {
    const getBalancesByAddress = useGetBalancesByAddress();
    const balances = useResolverToRef(
        useCallback(
            /**
             * TODO: figure out how to use @export to fetch balances only for certain assetIds
             * then we don't have to pass in so many different entities as possible arugments here.
             * 
             * This should also allow caching of balances if they are not fetched as a nested field,
             * but rather a top level field per address.
             */ 
            async (entity: Account | LbpPool | XykPool, args) => {
                let assetIds;
                
                // TODO: how to extract the typename from the LbpPool[__typename] directly?
                if (entity.__typename === 'LBPPool' || entity.__typename === 'XYKPool') {
                    entity = (entity as LbpPool | XykPool);
                    assetIds = [entity.assetAId, entity.assetBId];
                }

                return (await getBalancesByAddress(entity.id, assetIds))
                    ?.map(balance => ({
                        ...balance,
                        __typename,
                        id: `${entity.id}-${balance.assetId}`,
                    }))
            }, 
            [getBalancesByAddress]
        ),
        'balances'
    );

    return {
        balances
    }
}