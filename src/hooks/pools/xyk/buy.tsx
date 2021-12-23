import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { readActiveAccount } from '../../accounts/readActiveAccount';
import {
  gracefulExtensionCancelationErrorHandler,
  handleTransactionStatus,
  withGracefulErrors,
} from '../../actionLog/handleTransactionStatus';
import { Status, UserActionType } from '../../../generated/graphql';

export const discount = false;

export const buy = async (
  cache: ApolloCache<NormalizedCacheObject>,
  apiInstance: ApiPromise,
  assetBuy: string, // 1
  assetSell: string, // 49.7 + 0.2% = 49.9
  amountBuy: string, // 99
  maxSold: string // 49.5 + 0.5%
) => {
  await withGracefulErrors(
    async (resolve, reject) => {
      const activeAccount = readActiveAccount(cache);
      const address = activeAccount?.id;

      if (!address) return reject(new Error('No active account found!'));

      const { signer } = await web3FromAddress(address);

      const call = apiInstance.tx.xyk.buy(
        assetBuy,
        assetSell,
        amountBuy,
        maxSold,
        discount
      );

      await call.signAndSend(
        address,
        { signer },
        handleTransactionStatus(resolve, reject, apiInstance, cache, () => {
          return {
            id: call.hash.toHex(),
            account: address,
            action: UserActionType.Buy,
            status: Status.Unapproved,
          };
        })
      );
    },
    [gracefulExtensionCancelationErrorHandler]
  );
};
