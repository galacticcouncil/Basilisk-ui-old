import { useSetActiveAccountMutationResolver } from './useSetActiveAccountMutationResolver';

/**
 * Used to resolve mutations regarding the Account entity
 * @returns
 */
export const useAccountsMutationResolvers = () => {
  const setActiveAccountMutationResolver =
    useSetActiveAccountMutationResolver();

  return {
    setActiveAccount: setActiveAccountMutationResolver,
  };
};
