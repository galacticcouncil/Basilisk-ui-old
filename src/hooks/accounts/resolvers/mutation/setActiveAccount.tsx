import { useCallback } from 'react';
import { useSetActiveAccount } from '../../lib/useSetActiveAccount';
import { SetActiveAccountMutationVariables } from '../../mutations/useSetActiveAccountMutation';
import { withErrorHandler } from '../../../apollo/withErrorHandler';

export const useSetActiveAccountMutationResolver = () => {
  const setActiveAccount = useSetActiveAccount();

  return {
    setActiveAccount: withErrorHandler(
      useCallback(
        async (_obj, args: SetActiveAccountMutationVariables) =>
          setActiveAccount(args.id),
        [setActiveAccount]
      ),
      'setActiveAccount'
    ),
  };
};
