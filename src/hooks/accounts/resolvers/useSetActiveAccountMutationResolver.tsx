import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useCallback } from 'react';
import { useSetActiveAccount } from '../useSetActiveAccount';
import { SetActiveAccountMutationVariables } from '../mutations/useSetActiveAccountMutation';
import { withErrorHandler } from '../../apollo/withErrorHandler';

export const useSetActiveAccountMutationResolver = () => {
  const setActiveAccount = useSetActiveAccount();

  return withErrorHandler(
    useCallback(
      async (
        _obj,
        args: SetActiveAccountMutationVariables,
        { client }: { client: ApolloClient<NormalizedCacheObject> }
      ) => setActiveAccount(client, args.id),
      [setActiveAccount]
    ),
    'setActiveAccount'
  );
};
