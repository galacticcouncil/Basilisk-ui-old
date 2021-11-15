import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Account, LastBlock, Query } from '../../generated/graphql';
import { loader } from 'graphql.macro';
import { QueryData } from '@apollo/client/react/data/QueryData';

export const GET_ACCOUNTS = loader('./graphql/GetAccounts.query.graphql');
export interface GetAccountsQueryResponse {
    accounts: Query['accounts'],
    lastBlock: Query['lastBlock']
}

export const useGetAccountsQuery = () => useQuery<GetAccountsQueryResponse>(GET_ACCOUNTS, {
    notifyOnNetworkStatusChange: true
});