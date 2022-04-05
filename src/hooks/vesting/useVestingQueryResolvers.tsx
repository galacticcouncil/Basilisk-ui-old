import {  ApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import { Account } from '../../generated/graphql';
import { withErrorHandler } from '../apollo/withErrorHandler';
import { useGetVestingByAddress } from './useGetVestingByAddress';

export const useVestingQueryResolvers = () => {
  const getVestingByAddress = useGetVestingByAddress();
  const vestingSchedule = withErrorHandler(
    useCallback(
      async (
        account: Account,
        _args: any,
        { client }: { client: ApolloClient<any> }
      ) => await getVestingByAddress(client, account.id),
      [getVestingByAddress]
    ),
    'vestingSchedule'
  );

  return {
    vestingSchedule,
  };
};
