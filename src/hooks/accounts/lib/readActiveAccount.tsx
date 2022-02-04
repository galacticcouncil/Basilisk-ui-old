import { ApolloCache } from '@apollo/client';
import {
  GetActiveAccountQueryResponse,
  GET_ACTIVE_ACCOUNT,
} from '../queries/useGetActiveAccountQuery';

export const readActiveAccount = (cache: ApolloCache<object>) => {
  return cache.readQuery<GetActiveAccountQueryResponse>({
    query: GET_ACTIVE_ACCOUNT,
    /**
     * TODO: if the active account query does not return all the queried data,
     * such as vesting schedules (fields should be nullable, but they are simply not returned.
     * Then the cache is incomplete and would return null/undefined, thats why we need to
     * accept only partial data below.
     */
    returnPartialData: true,
  })?.activeAccount;
};
