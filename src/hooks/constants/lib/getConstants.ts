import '@polkadot/api-augment';
import { ApiPromise } from '@polkadot/api';
import { Constants } from '../../../generated/graphql';
import { unwrapRepayFeeToFee } from './unwrapRepayFeeToFee';

export const getConstants = (apiInstance: ApiPromise): Constants => ({
  lbp: {
    repayFee: unwrapRepayFeeToFee(apiInstance),
  },
});
