import { useGetActionLogQueryResolver } from './resolvers/useGetActionLogQueryResolver';

export const useActionLogQueryResolvers = () => {
  const getActionLogQueryResolver = useGetActionLogQueryResolver();

  return {
    actionLog: getActionLogQueryResolver,
  };
};
