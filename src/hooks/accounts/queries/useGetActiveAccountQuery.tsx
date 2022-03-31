import { QueryHookOptions, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from '../../../generated/graphql';

// graphql query
export const GET_ACTIVE_ACCOUNT = loader(
  './../graphql/GetActiveAccount.query.graphql'
);

// data shape returned from the query
export interface GetActiveAccountQueryResponse {
  activeAccount: Query['activeAccount'] & {
    vestingSchedules: any
  }
}

// hook wrapping the built-in apollo useQuery hook with proper types & configuration
export const useGetActiveAccountQuery = (options?: QueryHookOptions) =>
  useQuery<GetActiveAccountQueryResponse>(GET_ACTIVE_ACCOUNT, {
    notifyOnNetworkStatusChange: true,
    ...options
  });
