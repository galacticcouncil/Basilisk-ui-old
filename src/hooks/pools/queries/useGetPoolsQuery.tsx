import { QueryHookOptions, useQuery } from '@apollo/client';
import { Query } from '../../../generated/graphql';
import { loader } from 'graphql.macro';
import constate from 'constate';
import { useLoading } from '../../misc/useLoading';

export const GET_POOLS = loader('./../graphql/GetPools.query.graphql');

export interface GetPoolsQueryResponse {
  pools: Query['pools'];
}

export const useGetPoolsQuery = (options?: QueryHookOptions) => {
  const loading = useLoading();
  return useQuery<GetPoolsQueryResponse>(GET_POOLS, {
    notifyOnNetworkStatusChange: true,
    skip: loading,
    ...options,
  });
};

export const [GetPoolsQueryProvider, useGetPoolsQueryProvider] = constate(
  useGetPoolsQuery
);
