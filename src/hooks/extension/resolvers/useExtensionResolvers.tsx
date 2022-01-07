import { useExtensionQueryResolver } from './query/extension';

export const useExtensionResolvers = () => {
  return {
    Query: {
      ...useExtensionQueryResolver(),
    },
  };
};
