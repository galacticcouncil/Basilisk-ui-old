import { useQuery } from '@apollo/client';
import constate from 'constate';
import { loader } from 'graphql.macro'
import { Account, LastBlock } from '../../generated/graphql';

export const GET_ACTIVE_ACCOUNT = loader('./GetActiveAccount.graphql');
export interface GetActiveAccountQueryResponse {
    account: Account,
    lastBlock: LastBlock,
}

// TODO: turn this into a lazy query instead, so it does not get fetched right away
export const useGetActiveAccountQuery = () => useQuery<GetActiveAccountQueryResponse>(GET_ACTIVE_ACCOUNT);
export const [GetActiveAccountQueryProvider, useGetActiveAccountQueryContext] = constate(useGetActiveAccountQuery);