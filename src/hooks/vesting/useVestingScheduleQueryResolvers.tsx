import { useCallback } from 'react'
import { Account } from '../../generated/graphql';
import { useResolverToRef } from '../apollo/useResolverToRef'
import { useGetVestingScheduleByAddress } from './useGetVestingScheduleByAddress';

export const useVestingScheduleQueryResolvers = () => {
    const getVestingScheduleByAddress = useGetVestingScheduleByAddress();
    const vestingSchedule = useResolverToRef(
        useCallback(
            async (account: Account) => await getVestingScheduleByAddress(account.id), 
            [getVestingScheduleByAddress]
        ),
        'vestingSchedule'
    );

    return {
        vestingSchedule
    }
}