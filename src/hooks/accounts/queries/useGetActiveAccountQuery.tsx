import { QueryHookOptions, useQuery } from '@apollo/client';
import constate from 'constate';
import { loader } from 'graphql.macro';
import { Query, Vesting } from '../../../generated/graphql';
import {
  useGetExtensionQuery,
  useGetExtensionQueryContext,
} from '../../extension/queries/useGetExtensionQuery';
import { useLoading } from '../../misc/useLoading';

// graphql query
export const GET_ACTIVE_ACCOUNT = loader(
  './../graphql/GetActiveAccount.query.graphql'
);

// data shape returned from the query
export interface GetActiveAccountQueryResponse {
  activeAccount: Query['activeAccount'];
}

// hook wrapping the built-in apollo useQuery hook with proper types & configuration
export const useGetActiveAccountQuery = (options?: QueryHookOptions) =>
  useQuery<GetActiveAccountQueryResponse>(GET_ACTIVE_ACCOUNT, {
    notifyOnNetworkStatusChange: true,
    ...options,
  });

export const [
  GetActiveAccountQueryProvider,
  useGetActiveAccountQueryContext,
] = constate(() => {
  const depsLoading = useLoading();
  const { loading: extensionLoading } = useGetExtensionQueryContext();
  return useGetActiveAccountQuery({
    skip: depsLoading || extensionLoading,
  });
});
