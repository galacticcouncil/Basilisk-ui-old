import { ApiPromise } from '@polkadot/api';
import { Callback, makeHandleNotifyNewBlock } from './handleNotifyNewBlock';

// dependencies for the higher order function `makeSubscribeNewBlocks`
export type SubscribeNewBlocksDeps = {
  apiInstance: ApiPromise;
};

// `make` denotes a function that acts as a factory a.k.a. a higher order function
export const makeSubscribeNewBlocks =
  ({ apiInstance }: SubscribeNewBlocksDeps) =>
  // actual implementation of `subscribeNewBlocks`
  async (callback: Callback) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // api call to setup a new block subscription
    return await apiInstance.derive.chain.subscribeNewBlocks(
      // make the `handleNotifyNewBlock` function with `apiInstance` as a dependency
      makeHandleNotifyNewBlock({
        apiInstance,
      })(callback)
    );
  };
