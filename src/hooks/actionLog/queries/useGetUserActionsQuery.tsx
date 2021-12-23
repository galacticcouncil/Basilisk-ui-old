import { useApolloClient, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from '../../../generated/graphql';
import { useEffect } from 'react';
import { removeUserAction } from '../helpers/removeUserAction';
import { readActiveAccount } from '../../accounts/readActiveAccount';

export const GET_USER_ACTIONS = loader(
  '../graphql/GetUserActions.query.graphql'
);

export interface GetUserActionsQueryVariables {
  id: string;
  account: string;
}

export interface UseGetUserActionsQuery {
  userActions: Query['userActions'];
}
export const useGetUserActions = () => {
  const client = useApolloClient();

  const account = readActiveAccount(client.cache);
  const address = account?.id;

  if (!address) {
    // TODO: WHAT DO ?
  }

  const result = useQuery<UseGetUserActionsQuery>(GET_USER_ACTIONS, {
    notifyOnNetworkStatusChange: true,
    returnPartialData: true,
    pollInterval: 5000,
    variables: {
      account: address,
    },
  });

  useEffect(() => {
    result.data?.userActions?.forEach((value) => {
      removeUserAction(client.cache, value.id);
    });
  }, [client.cache, result.data?.userActions]);

  return result;
};
