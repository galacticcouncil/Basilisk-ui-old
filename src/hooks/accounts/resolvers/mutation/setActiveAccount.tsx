import { useCallback } from 'react';
import { useSetActiveAccount } from '../../lib/useSetActiveAccount';
import { SetActiveAccountMutationVariables } from '../../mutations/useSetActiveAccountMutation';
import { useResolverToRef } from '../useAccountsResolvers';

export const useSetActiveAccountMutationResolver = () => {
  const setActiveAccount = useSetActiveAccount();

  return {
    setActiveAccount: useResolverToRef(
      useCallback(
        async (_obj, args: SetActiveAccountMutationVariables) =>
          setActiveAccount(args.id),
        [setActiveAccount]
      ),
      'setActiveAccount'
    ),
  };
};
