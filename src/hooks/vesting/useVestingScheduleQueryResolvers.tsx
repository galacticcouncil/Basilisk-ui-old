import { useCallback } from 'react';
import { Account } from '../../generated/graphql';
import { useGetVestingScheduleByAddress } from './useGetVestingScheduleByAddress';
import { useResolverToRef } from '../accounts/resolvers/useAccountsResolvers';

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
    vestingSchedule,
  };
};
