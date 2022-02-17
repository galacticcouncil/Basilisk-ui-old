import { useConstantsQueryResolver } from './query/constants';

export const useConstantsResolvers = () => {
  return {
    Query: {
      ...useConstantsQueryResolver(),
    },
  };
};
