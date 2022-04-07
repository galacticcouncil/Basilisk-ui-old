import { ApolloCache } from '@apollo/client';
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

export const sellHandler = (
  resolve: resolve,
  reject: reject,
  apiInstance: ApiPromise
) => {
  return vestingClaimHandler(resolve, reject, apiInstance);
};

export const estimateLbpSell = async (
  cache: ApolloCache<object>,
  apiInstance: ApiPromise,
  assetSell: string,
  assetBuy: string,
  amountSell: string,
  minBought: string
) => {
  const activeAccount = readActiveAccount(cache);
  const address = activeAccount?.id;
  if (!address)
    throw new Error(`Can't retrieve sender's address for estimation`);

  return apiInstance.tx.lbp
    .sell(assetSell, assetBuy, amountSell, minBought)
    .paymentInfo(address);
};

export const sell = async (
  cache: ApolloCache<object>,
  apiInstance: ApiPromise,
  assetSell: string,
  assetBuy: string,
  amountSell: string,
  minBought: string
) => {
  // await withGracefulErrors(
  await new Promise(
    async (resolve, reject) => {
      const activeAccount = readActiveAccount(cache);
      const address = activeAccount?.id;

      try {
        if (!address) return reject(new Error('No active account found'));

        const { signer } = await web3FromAddress(address);

        await apiInstance.tx.lbp
          .sell(assetSell, assetBuy, amountSell, minBought)
          .signAndSend(
            address,
            { signer },
            sellHandler(resolve, reject, apiInstance)
          );
      } catch (e) {
        reject(e);
      }
    }
    // [gracefulExtensionCancelationErrorHandler]
  );
};
