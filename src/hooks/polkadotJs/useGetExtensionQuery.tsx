import { useLazyQuery, useQuery } from '@apollo/client';
import constate from 'constate';
import { loader } from 'graphql.macro';
import { Query } from '../../generated/graphql';

export const GET_EXTENSION = loader('./graphql/GetExtension.query.graphql');

export interface GetExtensionQueryResponse {
    extension: Query['extension']
}

export const useGetExtensionQuery = () => useQuery<GetExtensionQueryResponse>(GET_EXTENSION, {
    notifyOnNetworkStatusChange: true,
});

export const useGetExtensionLazyQuery = () => useLazyQuery<GetExtensionQueryResponse>(GET_EXTENSION, {
    notifyOnNetworkStatusChange: true
})

export const [GetExtensionQueryProvider, useContextualGetExtensionLazyQuery] = constate(useGetExtensionLazyQuery);