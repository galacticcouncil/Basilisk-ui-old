import { useActiveAccountQueryResolver } from './query/activeAccount';

/**
 * Used to resolve queries for the `ActiveAccount` entity.
 */
export const useActiveAccountQueryResolvers = () => {
  const getActiveAccountQueryResolver = useActiveAccountQueryResolver();

  return {
    Query: {
      activeAccount: getActiveAccountQueryResolver,
    },
  };
};
