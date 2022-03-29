import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { readActiveAccount } from '../../accounts/lib/readActiveAccount';
import {
  gracefulExtensionCancelationErrorHandler,
  reject,
  resolve,
  vestingClaimHandler,
  withGracefulErrors,
} from '../../vesting/useVestingMutationResolvers';

export const xykBuyHandler = (
  resolve: resolve,
  reject: reject,
  apiInstance: ApiPromise
) => {
  return vestingClaimHandler(resolve, reject, apiInstance);
};

export const discount = false;

export const estimateSell = async (
  cache: ApolloCache<object>,
  apiInstance: ApiPromise,
  assetSell: string,
  assetBuy: string,
  amountSell: string,
  minBought: string
) => {
  const activeAccount = readActiveAccount(cache);
  const address = activeAccount?.id;

  if (!address) return;
  
  return apiInstance.tx.xyk
    .sell(assetSell, assetBuy, amountSell, minBought, discount)
    .paymentInfo(address);
}

export const sell = async (
  cache: ApolloCache<NormalizedCacheObject>,
  apiInstance: ApiPromise,
  assetSell: string,
  assetBuy: string,
  amountSell: string,
  minBought: string
) => {
  // await withGracefulErrors(
    await new Promise(async (resolve, reject) => {
      const activeAccount = readActiveAccount(cache);
      const address = activeAccount?.id;

      try {
        if (!address) return reject(new Error('No active account found!'));

        const { signer } = await web3FromAddress(address);

        await apiInstance.tx.xyk
          .sell(assetSell, assetBuy, amountSell, minBought, discount)
          .signAndSend(
            address,
            { signer },
            xykBuyHandler(resolve, reject, apiInstance)
          );
      } catch (e) {
        reject(e);
      }
    })
    // [gracefulExtensionCancelationErrorHandler]
  // );
};
