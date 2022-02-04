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

export const sell = async (
  cache: ApolloCache<object>,
  apiInstance: ApiPromise,
  assetSell: string,
  assetBuy: string,
  amountSell: string,
  minBought: string
) => {
  await withGracefulErrors(
    async (resolve, reject) => {
      const activeAccount = readActiveAccount(cache);
      const address = activeAccount?.id;

      if (!address) return reject(new Error('No active account found'));

      const { signer } = await web3FromAddress(address);

      await apiInstance.tx.lbp
        .sell(assetSell, assetBuy, amountSell, minBought)
        .signAndSend(
          address,
          { signer },
          sellHandler(resolve, reject, apiInstance)
        );
    },
    [gracefulExtensionCancelationErrorHandler]
  );
};
