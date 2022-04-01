import { ApiPromise } from '@polkadot/api';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import errors from '../../../../errors';
import { ApolloCache, useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import {
  withGracefulErrors,
  gracefulExtensionCancelationErrorHandler as gracefulExtensionCancellationErrorHandler,
} from '../../../vesting/useVestingMutationResolvers';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { DispatchError, ExtrinsicStatus } from '@polkadot/types/interfaces';
import log from 'loglevel';
import { withErrorHandler } from '../../../apollo/withErrorHandler';
import { useMemo } from 'react';
import { readActiveAccount } from '../../../accounts/lib/readActiveAccount';

export const TRANSFER_BALANCE = loader(
  './graphql/TransferBalance.mutation.graphql'
);

export interface TransferBalanceMutationVariables {
  from?: string;
  to?: string;
  currencyId?: string;
  amount?: string;
}

export const useTransferBalanceMutation = (
  variables: TransferBalanceMutationVariables
) =>
  useMutation<void, TransferBalanceMutationVariables>(TRANSFER_BALANCE, {
    variables,
  });

export type resolve = (result?: any) => void;
export type reject = (error?: any) => void;

// TODO: use handler from #71
export const transferBalanceHandler =
  (apiInstance: ApiPromise, resolve: resolve, reject: reject) =>
  ({
    status,
    dispatchError,
  }: {
    status: ExtrinsicStatus;
    dispatchError?: DispatchError;
  }) => {
    if (status.isFinalized) log.info('operation finalized');

    // TODO: handle status via the action log / notification stack
    if (status.isInBlock) {
      if (dispatchError?.isModule) {
        return log.error(
          'transfer unsuccessful',
          apiInstance.registry.findMetaError(dispatchError.asModule)
        );
      }

      return log.info('transfer successful');
    }

    // if the operation has been broadcast, finish the mutation
    if (status.isBroadcast) {
      log.info('transaction has been broadcast');
      return resolve();
    }
    if (dispatchError) {
      log.error(
        'There was a dispatch error',
        apiInstance.registry.findMetaError(dispatchError.asModule)
      );
      return reject();
    }
  };

const transferBalanceExtrinsic = (apiInstance: ApiPromise) =>
  apiInstance.tx.currencies.transfer;

export const estimateBalanceTransfer = async (
  cache: ApolloCache<object>,
  apiInstance: ApiPromise,
  args: TransferBalanceMutationVariables
) => {
  const activeAccount = readActiveAccount(cache);
  const address = activeAccount?.id;

  if (!address)
    throw new Error(`Can't retrieve sender's address for estimation`);
  if (!args.from || !args.to || !args.currencyId || !args.amount)
    throw new Error(errors.invalidTransferVariables);

  return transferBalanceExtrinsic(apiInstance)
    .apply(apiInstance, [args.to, args.currencyId, args.amount])
    .paymentInfo(address);
};

const balanceTransferMutationResolverFactory =
  (apiInstance?: ApiPromise) =>
  async (_obj: any, args: TransferBalanceMutationVariables) => {
    if (!args.from || !args.to || !args.currencyId || !args.amount)
      throw new Error(errors.invalidTransferVariables);
    if (!apiInstance) throw new Error(errors.apiInstanceNotInitialized);

    return withGracefulErrors(
      async (resolve, reject) => {
        const { signer } = await web3FromAddress(args.from!);

        await transferBalanceExtrinsic(apiInstance)
          .apply(apiInstance, [args.to, args.currencyId, args.amount])
          .signAndSend(
            args.from!,
            { signer },
            transferBalanceHandler(apiInstance, resolve, reject)
          );
      },
      [gracefulExtensionCancellationErrorHandler]
    );
  };

export const useBalanceMutationsResolvers = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    transferBalance: withErrorHandler(
      useMemo(
        () => balanceTransferMutationResolverFactory(apiInstance),
        [apiInstance]
      ),
      'transferBalance'
    ),
  };
};
