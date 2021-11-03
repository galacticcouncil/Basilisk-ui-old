import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Account, LastBlock } from '../../generated/graphql';
import { loader } from 'graphql.macro';

export const GET_ACCOUNTS = loader('./GetAccounts.query.graphql');
export interface GetAccountsQueryResponse {
    accounts: Account[]
    lastBlock: LastBlock
}

export const useGetAccountsQuery = () => useQuery<GetAccountsQueryResponse>(GET_ACCOUNTS, {
    notifyOnNetworkStatusChange: true
});