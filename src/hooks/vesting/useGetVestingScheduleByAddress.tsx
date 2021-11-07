import { useCallback } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { Vec } from '@polkadot/types';
import { VestingScheduleOf } from '@open-web3/orml-types/interfaces'
import { find, first } from 'lodash';

export const vestingBalanceDataType = 'Vec<BalanceLock>';
export const vestingBalanceLockId = 'ormlvest';

export const vestingScheduleDataType = 'Vec<VestingScheduleOf>';

export const useGetVestingScheduleByAddress = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    const getVestingScheduleByAddress = useCallback(async (address: string) => {
        if (!apiInstance) return;

        // TODO: instead of multiple .createType calls, use the following
        // https://github.com/AcalaNetwork/acala.js/blob/9634e2291f1723a84980b3087c55573763c8e82e/packages/sdk-core/src/functions/getSubscribeOrAtQuery.ts#L4
        const vestingSchedule = first(
            apiInstance.createType(
                vestingScheduleDataType,
                await apiInstance.query.vesting.vestingSchedules(address)
            ) as Vec<VestingScheduleOf>
        );

        const lockedVestingAmount = find(
            apiInstance.createType(
                vestingBalanceDataType,
                await apiInstance.query.balances.locks(address)
            ),
            lockedAmount => (
                lockedAmount.id.eq(vestingBalanceLockId)
            )
        );
        
        // TODO: are we sure this really conforms with the graphql VestingSchedule type
        // in all conditions?
        return {
            // TODO: add a claimableAmount (https://gist.github.com/maht0rz/53466af0aefba004d5a4baad23f8ce26)
            remainingVestingAmount: lockedVestingAmount?.amount.toString(),
            start: vestingSchedule?.start.toString(),
            period: vestingSchedule?.period.toString(),
            periodCount: vestingSchedule?.periodCount.toString(),
            perPeriod: vestingSchedule?.perPeriod.toString()
        }

    }, [apiInstance, loading]);

    return getVestingScheduleByAddress;
}