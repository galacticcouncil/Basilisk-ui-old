import { ApolloCache } from '@apollo/client';
import { GetActiveAccountQueryResponse, GET_ACTIVE_ACCOUNT } from './queries/useGetActiveAccountQuery';

export const readActiveAccount = (
    cache: ApolloCache<object>
) => {
    return cache.readQuery<GetActiveAccountQueryResponse>({
        query: GET_ACTIVE_ACCOUNT
    })?.account
}