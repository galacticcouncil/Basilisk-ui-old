import { useCallback } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { Vec } from '@polkadot/types';
import { VestingScheduleOf, BalanceOf } from '@open-web3/orml-types/interfaces'
import { find, first } from 'lodash';
import { ApiPromise } from '@polkadot/api';
import { Codec } from '@polkadot/types/types';

export const balanceLockDataType = 'Vec<BalanceLock>';
export const tokensLockDataType = balanceLockDataType;

export const vestingBalanceLockId = 'ormlvest';

export const vestingScheduleDataType = 'Vec<VestingScheduleOf>';

export interface OrmlTokensBalanceLock {
    id?: string,
    amount?: number,
}

export const getLockedBalanceByAddressAndLockId = async (
    apiInstance: ApiPromise,
    address: string,
    lockId: string
) => {
    const lockedNativeBalance = find(
        apiInstance.createType(
            balanceLockDataType,
            await apiInstance.query.balances.locks(address)
        ),
        lockedAmount => (
            lockedAmount.id.eq(lockId)
        )
    );

    const tokenBalanceLocks = (await apiInstance.query.tokens.locks.entries(address))
        .map(([_storageKey, codec]: [any, Codec]) => {
            const tokenBalanceLock = (codec.toJSON() as any)[0] as unknown as OrmlTokensBalanceLock;
            return {
                id: tokenBalanceLock?.id,
                amount: tokenBalanceLock?.amount?.toString()
            }
        });
    
    const lockedTokensBalance = find(
        tokenBalanceLocks,
        lockedAmount => (
            lockedAmount?.id === lockId 
        )
    );
    
    return lockedNativeBalance || lockedTokensBalance;
}

export const useGetVestingScheduleByAddress = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    const getVestingScheduleByAddress = useCallback(async (address?: string) => {
        if (!apiInstance || !address) return;

        // TODO: instead of multiple .createType calls, use the following
        // https://github.com/AcalaNetwork/acala.js/blob/9634e2291f1723a84980b3087c55573763c8e82e/packages/sdk-core/src/functions/getSubscribeOrAtQuery.ts#L4
        const vestingSchedule = first(
            apiInstance.createType(
                vestingScheduleDataType,
                await apiInstance.query.vesting.vestingSchedules(address)
            ) as Vec<VestingScheduleOf>
        );

        const lockedVestingAmount = await getLockedBalanceByAddressAndLockId(
            apiInstance,
            address,
            vestingBalanceLockId
        );

        // TODO: are we sure this really conforms with the graphql VestingSchedule type
        // in all conditions?
        return {
            // TODO: add a claimableAmount (https://gist.github.com/maht0rz/53466af0aefba004d5a4baad23f8ce26)
            remainingVestingAmount: lockedVestingAmount?.amount?.toString(),
            start: vestingSchedule?.start.toString(),
            period: vestingSchedule?.period.toString(),
            periodCount: vestingSchedule?.periodCount.toString(),
            perPeriod: vestingSchedule?.perPeriod.toString()
        }

    }, [apiInstance, loading]);

    return getVestingScheduleByAddress;
}