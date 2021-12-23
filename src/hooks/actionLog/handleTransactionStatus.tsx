import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { DispatchError, EventRecord } from '@polkadot/types/interfaces/system';
import log from 'loglevel';
import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { Status, ClientUserAction } from '../../generated/graphql';
import {
  updateUserAction,
  updateUserActionId,
} from './helpers/updateUserAction';
import { addAction } from './helpers/addAction';
import { findIndex, find } from 'lodash';
import { readLastBlock } from '../lastBlock/readLastBlock';
import { readUserAction } from './helpers/readUserAction';

const isOk = (api: ApiPromise, events: EventRecord[]) => {
  const errorEvent = find(events, (event) =>
    api.events.system.ExtrinsicFailed.is(event.event)
  );

  if (!errorEvent) {
    const isOk = find(events, (event) =>
      api.events.system.ExtrinsicSuccess.is(event.event)
    );

    return { result: isOk !== undefined, reason: undefined };
  } else {
    // TODO: find error and better error reason?
    const [dispatchError] = errorEvent.event.data;

    const errorInfo = dispatchError.toString();

    log.error(
      `UserAction: ${errorEvent.event.section}.${errorEvent.event.method}:: ExtrinsicFailed:: ${errorInfo}`
    );
    return { result: false, reason: errorInfo };
  }
};

/**
 * Formats the event id into a fixed-length string. When formatted the natural string ordering
 * is the same as the ordering
 * in the blockchain (first ordered by block height, then by block ID)
 *
 * @return  id in the format 000000..00<blockNum>-000<index>-<shorthash>
 *
 */
const formatId = (height: string, index: number | undefined, hash: string) => {
  const BLOCK_PAD_LENGTH = 10;
  const INDEX_PAD_LENGTH = 6;
  const HASH_PAD_LENGTH = 5;

  const blockPart = `${String(height).padStart(BLOCK_PAD_LENGTH, '0')}`;
  const indexPart =
    index !== undefined
      ? `-${String(index).padStart(INDEX_PAD_LENGTH, '0')}`
      : '';
  const _hash = hash.startsWith('0x') ? hash.substring(2) : hash;
  const shortHash =
    _hash.length < HASH_PAD_LENGTH
      ? _hash.padEnd(HASH_PAD_LENGTH, '0')
      : _hash.slice(0, HASH_PAD_LENGTH);
  return `${blockPart}${indexPart}-${shortHash}`;
};

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
      log.error('graceful error', e);
      let ex = errorHandlers.reduce((e, errorHandler) => errorHandler(e), e);
      // rejecting this promise with an error instead of throwing an error
      // is necessary to reflect the apollo resolver loading state correctly
      e ? reject(ex) : resolve(null);
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

export const handleTransactionStatus =
  (
    resolve: resolve,
    reject: reject,
    api: ApiPromise,
    cache: ApolloCache<NormalizedCacheObject>,
    txData: () => ClientUserAction
  ) =>
  async ({
    status,
    events = [],
    dispatchError,
  }: {
    status: ExtrinsicStatus;
    events: EventRecord[];
    dispatchError?: DispatchError;
  }) => {
    if (status.isReady) {
      // At this point, it is not yet in the action log cache
      const lastBlockData = readLastBlock(cache);
      addAction(cache, {
        ...txData(),
        status: Status.IsReady,
        clientDetails: {
          blockHeight: lastBlockData?.lastBlock?.parachainBlockNumber,
          inBlockHash: undefined,
        },
      });
    }

    if (status.isBroadcast) {
      updateUserAction(cache, txData().id, Status.IsBroadcast);
    }

    if (status.isInBlock) {
      const { result: isSuccess, reason: errorReason } = isOk(api, events);

      if (isSuccess) {
        updateUserAction(
          cache,
          txData().id,
          Status.IsInBlock,
          status.asInBlock.hash.toHex()
        );
      } else {
        //TODO: do something with error reason
        log.error(errorReason);
        updateUserAction(cache, txData().id, Status.IsError);
      }
    }
    if (status.isFinalized) {
      updateUserAction(cache, txData().id, Status.IsFinalized);

      const userAction = readUserAction(txData().id, cache);

      // If inBlockHash does not match finalized hash,
      // It was finalized in another block
      // Need to check if extrinsic is success again
      let txSuccess = true;
      if (
        userAction?.clientDetails?.inBlockHash !==
        status.asFinalized.hash.toHex()
      ) {
        log.debug(
          'UserAction: checking ExtrinsicSuccess after IsFinalized due to InBlock Hash mismatch'
        );

        const { result: isSuccess, reason: errorReason } = isOk(api, events);

        txSuccess = isSuccess;
        if (!isSuccess) {
          //TODO: do something with error reason
          updateUserAction(cache, txData().id, Status.IsError);
        } else {
          log.error(errorReason);
        }
      }

      if (txSuccess) {
        const blockHash = status.asFinalized.toHex();
        const signedBlock = await api.rpc.chain.getBlock(blockHash);
        const paraChainBlockHeight = signedBlock.block.header.number.toString();

        const txHash = txData().id;

        let txBlockIndex = findIndex(
          signedBlock.block.extrinsics,
          (ex) => ex.hash.toHex() === txHash
        );

        if (txBlockIndex === -1) {
          //TODO: WHAT DO?
          log.warn('UserAction: Transaction index not found in block ', txHash);
          return;
        }

        const txId = formatId(paraChainBlockHeight, txBlockIndex, blockHash);

        updateUserActionId(cache, txData().id, txId);
      }
    }
  };
