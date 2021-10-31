import { useQuery } from '@apollo/client';
import { Account } from '../../generated/graphql';
import { loader } from 'graphql.macro';

export const GET_ACCOUNT_BY_ID = loader('./GetAccountById.graphql');
export interface GetAccountByIdQueryResponse {
    account: Account
}

export interface GetAccountByIdQueryVariables {
    id: string
}

export const useGetAccountById = (
    variables: GetAccountByIdQueryVariables
) => useQuery<GetAccountByIdQueryResponse, GetAccountByIdQueryVariables>(
    GET_ACCOUNT_BY_ID, 
    { variables }
);