import { ApolloCache, ApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import { Account } from '../../generated/graphql';
import { withErrorHandler } from '../apollo/withErrorHandler';
import { useGetVestingScheduleByAddress } from './useGetVestingScheduleByAddress';

export const useVestingScheduleQueryResolvers = () => {
  const getVestingScheduleByAddress = useGetVestingScheduleByAddress();
  const vestingSchedule = withErrorHandler(
    useCallback(
      async (
        account: Account,
        _args: any,
        { client }: { client: ApolloClient<any> }
      ) => await getVestingScheduleByAddress(client, account.id),
      [getVestingScheduleByAddress]
    ),
    'vestingSchedule'
  );

  return {
    vestingSchedule,
  };
};
