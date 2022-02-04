import { useCallback } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { ClaimVestedAmountMutationVariables } from './useClaimVestedAmountMutation';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { DispatchError, EventRecord } from '@polkadot/types/interfaces/system';
import log from 'loglevel';
import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import {
  GetActiveAccountQueryResponse,
  GET_ACTIVE_ACCOUNT,
} from '../accounts/queries/useGetActiveAccountQuery';
import { ApiPromise } from '@polkadot/api';
import { useResolverToRef } from '../accounts/resolvers/useAccountsResolvers';

/**
 * Run an async function and handle the thrown errors
 * with an array of error handlers, which may handle the errors gracefully
 *
 * @param fn
 * @param errorHandlers
 * @returns
 */
export type resolve = (result?: any) => void;
export type reject = (error?: any) => void;
export const withGracefulErrors = async (
  fn: (resolve: resolve, reject: reject) => Promise<any>,
  errorHandlers: ((error: any) => void)[]
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      resolve(await fn(resolve, reject));
    } catch (e: any) {
      console.log('graceful error', e);
      // eslint-disable-next-line no-ex-assign
      e = errorHandlers.reduce((e, errorHandler) => errorHandler(e), e);
      // rejecting this promise with an error instead of throwing an error
      // is necessary to reflect the apollo resolver loading state correctly
      e ? reject(e) : resolve(null);
    }
  });
};

export const cancelledErrorMessage = 'Cancelled';

/**
 * This is an example graceful error handler,
 * if this would return `e` instead of `void`,
 * then the following graceful error handler would be triggered,
 * or by default the error would be thrown.
 *
 * @param e
 * @returns
 */
export const gracefulExtensionCancelationErrorHandler = (e: any) => {
  if ((e as Error)?.message === cancelledErrorMessage) {
    log.error(
      'Operation presumably cancelled by the user in the Polkadot.js extension'
    );
    return;
  }
  return e;
};

export const vestingClaimHandler =
  (resolve: resolve, reject: reject, apiInstance?: ApiPromise) =>
  ({
    status,
    events = [],
    dispatchError,
  }: {
    status: ExtrinsicStatus;
    events: EventRecord[];
    dispatchError?: DispatchError;
  }) => {
    if (status.isFinalized) log.info('operation finalized');

    // TODO: extract intention registred for exchange buy/sell
    events.forEach(({ event: { data, method, section }, phase }) => {
      console.log(
        'event handler',
        phase.toString(),
        `: ${section}.${method}`,
        data.toString()
      );
    });

    // TODO: handle status via the action log / notification stack
    if (status.isInBlock) {
      console.log('is in block', status.createdAtHash?.toString());
      if (dispatchError?.isModule) {
        return log.info(
          'operation unsuccessful',
          !apiInstance
            ? dispatchError
            : apiInstance.registry.findMetaError(dispatchError.asModule)
        );
      }

      return log.info('operation successful');
    }

    // if the operation has been broadcast, finish the mutation
    if (status.isBroadcast) {
      log.info('transaction has been broadcast', status.hash.toHuman());
      return resolve();
    }
    if (dispatchError) {
      log.error('There was a dispatch error', dispatchError);
      return reject('Dispatch error');
    }
  };

export const noAccountSelectedError = 'No Account selected';
export const polkadotJsNotReadyYetError = 'Polkadot.js is not ready yet';

export const useVestingMutationResolvers = () => {
  const { apiInstance, loading } = usePolkadotJsContext();

  const claimVestedAmount = useResolverToRef(
    useCallback(
      async (
        _obj,
        variables: ClaimVestedAmountMutationVariables,
        { cache }: { cache: ApolloCache<NormalizedCacheObject> }
      ) => {
        const address = variables?.address
          ? variables.address
          : cache.readQuery<GetActiveAccountQueryResponse>({
              query: GET_ACTIVE_ACCOUNT,
            })?.activeAccount?.id;

        // TODO: error handling?
        if (!address) throw new Error(noAccountSelectedError);
        if (loading || !apiInstance)
          throw new Error(polkadotJsNotReadyYetError);

        // // TODO: why does this not return a tx hash?
        return await withGracefulErrors(
          async (resolve, reject) => {
            const { signer } = await web3FromAddress(address);
            await apiInstance.tx.vesting
              .claim()
              .signAndSend(
                address,
                { signer },
                vestingClaimHandler(resolve, reject)
              );
          },
          [gracefulExtensionCancelationErrorHandler]
        );
      },
      [loading, apiInstance]
    ),
    'claimVestedAmount'
  );

  return {
    claimVestedAmount,
  };
};
