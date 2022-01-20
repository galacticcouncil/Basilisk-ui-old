import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { GET_SELECTED_ACCOUNT } from '../queries/useGetSelectedAccountQuery';
export const SET_ACTIVE_ACCOUNT = loader(
  './../graphql/SetActiveAccount.mutation.graphql'
);

export interface SetActiveAccountMutationVariables {
  id: string | undefined;
}

export const useSetActiveAccountMutation = (options?: Object) =>
  useMutation<void, SetActiveAccountMutationVariables>(SET_ACTIVE_ACCOUNT, {
    ...options,
    refetchQueries: [{ query: GET_SELECTED_ACCOUNT }],
  });
