import { useApolloClient, useQuery } from '@apollo/client';
import constate from 'constate';
import { loader } from 'graphql.macro'
import { useEffect } from 'react';
import { Account, LastBlock, Query } from '../../../generated/graphql';
import { GET_CONFIG } from '../../config/useGetConfigQuery';

export const GET_ACTIVE_ACCOUNT = loader('./../graphql/GetActiveAccount.query.graphql');

export interface GetActiveAccountQueryResponse {
    account: Query['account'],
    lastBlock: Query['lastBlock'],
}

// TODO: turn this into a lazy query instead, so it does not get fetched right away
export const useGetActiveAccountQuery = () => {
    const client = useApolloClient();
    const result = useQuery<GetActiveAccountQueryResponse>(GET_ACTIVE_ACCOUNT, {
        notifyOnNetworkStatusChange: true,
    });

    // when the active account updates, refetch the config
    // since the config for `feePaymentAsset` depends on the active account
    useEffect(() => {
        client.refetchQueries({
            include: [GET_CONFIG]
        });
    }, [result.data?.account?.id])

    return result;
}
export const [GetActiveAccountQueryProvider, useGetActiveAccountQueryContext] = constate(useGetActiveAccountQuery);