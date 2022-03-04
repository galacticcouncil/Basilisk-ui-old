import '@polkadot/api-augment';
import { ApiPromise } from '@polkadot/api';
import { Fee } from '../../../generated/graphql';
import { unwrapITupleU32ToFee } from './unwrapITupleU32ToFee';

export const getRepayFee = (apiInstance: ApiPromise): Fee =>
  unwrapITupleU32ToFee(apiInstance);
