import { ApiPromise } from '@polkadot/api';
import { Callback, handleNotifyNewBlock } from './handleNotifyNewBlock';

// dependencies for the higher order function `makeSubscribeNewBlocks`
export type SubscribeNewBlocksDeps = {
  apiInstance: ApiPromise;
};

export const subscribeNewBlocks = async (
  { apiInstance }: SubscribeNewBlocksDeps,
  callback: Callback
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // api call to setup a new block subscription
  return await apiInstance.derive.chain.subscribeNewBlocks(
    // make the `handleNotifyNewBlock` function with `apiInstance` as a dependency
    handleNotifyNewBlock({ apiInstance }, callback)
  );
};
