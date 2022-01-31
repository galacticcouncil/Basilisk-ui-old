import { useSelectedAccountQueryResolver } from './query/selectedAccount';

/**
 * Used to resolve queries for the `ActiveAccount` entity.
 */
export const useSelectedAccountQueryResolvers = () => {
  const getSelectedAccountQueryResolver = useSelectedAccountQueryResolver();

  return {
    Query: {
      selectedAccount: getSelectedAccountQueryResolver,
    },
  };
};
