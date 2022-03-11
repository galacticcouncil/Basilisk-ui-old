import { useConstantsQueryResolver } from './query/constants/constants';
import { useLbpConstantsQueryResolver } from './query/lbpConstants/lbpConstants';

export const useConstantsQueryResolvers = () => {
  return {
    Query: {
      ...useConstantsQueryResolver(),
    },
    Constants: {
      ...useLbpConstantsQueryResolver(),
    }
  };
};
