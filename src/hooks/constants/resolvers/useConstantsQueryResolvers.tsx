import { useConstantsQueryResolver } from './query/constants/constants';
import { useLbpConstantsQueryResolver } from './query/lbpConstants/lbpConstants';
import { useRepayFeeQueryResolver } from './query/repayFee/repayFee';

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
