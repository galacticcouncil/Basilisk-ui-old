import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from '../../../generated/graphql';

// graphql query
export const GET_SELECTED_ACCOUNT = loader(
  './../graphql/GetSelectedAccount.query.graphql'
);

// data shape returned from the query
export interface GetSelectedAccountQueryResponse {
  selectedAccount: Query['selectedAccount'];
}

// hook wrapping the built-in apollo useQuery hook with proper types & configuration
export const useGetSelectedAccountQuery = () =>
  useQuery<GetSelectedAccountQueryResponse>(GET_SELECTED_ACCOUNT, {
    notifyOnNetworkStatusChange: true,
  });
