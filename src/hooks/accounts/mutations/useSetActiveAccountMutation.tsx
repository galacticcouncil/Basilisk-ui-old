import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
export const GET_SELECTED_ACCOUNT = loader(
  './../graphql/GetSelectedAccount.query.graphql'
);
export const SET_ACTIVE_ACCOUNT = loader(
  './../graphql/SetActiveAccount.mutation.graphql'
);

export interface SetActiveAccountMutationVariables {
  id: string | undefined;
}

export const useSetActiveAccountMutation = (options?: Object) =>
  useMutation<void, SetActiveAccountMutationVariables>(SET_ACTIVE_ACCOUNT, {
    ...options,
    refetchQueries: [
      // TODO: figure out why do we need to refetch active account manually,
      // while all accounts query gets updated automatically
      GET_SELECTED_ACCOUNT,
    ],
  });
