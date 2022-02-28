import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { readActiveAccount } from '../../accounts/lib/readActiveAccount';
import {
  withGracefulErrors,
  gracefulExtensionCancelationErrorHandler,
  vestingClaimHandler,
  resolve,
  reject,
} from '../../vesting/useVestingMutationResolvers';

export const xykBuyHandler = (
  resolve: resolve,
  reject: reject,
  apiInstance: ApiPromise
) => {
  return vestingClaimHandler(resolve, reject, apiInstance);
};

export const discount = false;

export const buy = async (
  cache: ApolloCache<NormalizedCacheObject>,
  apiInstance: ApiPromise,
  assetBuy: string, // 1
  assetSell: string, // 49.7 + 0.2% = 49.9
  amountBuy: string, // 99
  maxSold: string // 49.5 + 0.5%
) => {
  // await withGracefulErrors(
    // async (resolve, reject) => {
    await new Promise(async (resolve, reject) => {
      const activeAccount = readActiveAccount(cache);
      const address = activeAccount?.id;

      // TODO: extract this error
      try {
        if (!address) return reject(new Error('No active account found!'));

      const { signer } = await web3FromAddress(address);

      await apiInstance.tx.xyk
        .buy(assetBuy, assetSell, amountBuy, maxSold, discount)
        .signAndSend(
          address,
          { signer },
          xykBuyHandler(resolve, reject, apiInstance)
        );
      } catch (e) {
        reject(e)
      }
    })
  //   [gracefulExtensionCancelationErrorHandler]
  // );
};
