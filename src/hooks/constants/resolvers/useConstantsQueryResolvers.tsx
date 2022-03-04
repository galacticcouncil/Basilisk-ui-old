import { useConstantsQueryResolver } from './query/constants';
import { useLbpConstantsQueryResolver } from './query/lbpConstants';
import { useRepayFeeQueryResolver } from './query/repayFee';

export const useConstantsQueryResolvers = () => {
  return {
    Query: {
      ...useConstantsQueryResolver(),
    },
    Constants: {
      ...useLbpConstantsQueryResolver(),
    },
    LBPConstants: {
      ...useRepayFeeQueryResolver(),
    },
  };
};
