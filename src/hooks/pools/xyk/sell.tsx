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

export const sell = async (
  cache: ApolloCache<NormalizedCacheObject>,
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

      if (!address) return reject(new Error('No active account found!'));

      const { signer } = await web3FromAddress(address);

      const call = apiInstance.tx.xyk.sell(
        assetSell,
        assetBuy,
        amountSell,
        minBought,
        discount
      );

      await call.signAndSend(
        address,
        { signer },
        handleTransactionStatus(resolve, reject, apiInstance, cache, () => {
          return {
            id: call.hash.toString(),
            account: address,
            action: UserActionType.Sell,
            status: Status.Unapproved,
          };
        })
      );
    },
    [gracefulExtensionCancelationErrorHandler]
  );
};
