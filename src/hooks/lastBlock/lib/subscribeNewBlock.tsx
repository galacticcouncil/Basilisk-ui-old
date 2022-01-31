import { SignedBlock } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';

export const subscribeNewBlock = async (
  apiInstance: ApiPromise,
  callback: (block: SignedBlock) => any
) => {
  const unsubscribe = await apiInstance.derive.chain.subscribeNewBlocks(
    callback
  );

  return unsubscribe;
};
