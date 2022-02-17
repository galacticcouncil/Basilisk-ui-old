import { VoidFn } from '@polkadot/api/types';
import {
  PersistedValidationData,
  SignedBlock,
} from '@polkadot/types/interfaces';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { Callback, PartialLastBlock } from './lib/handleNotifyNewBlock';
import { makeSubscribeNewBlocks } from './lib/subscribeNewBlocks';

export const __typename = 'LastBlock';
export const id = __typename;
export const getRelaychainNumber = (validationData: PersistedValidationData) =>
  validationData.relayParentNumber.toString();
export const getParachainNumber = (chainLastBlock: SignedBlock) =>
  chainLastBlock.block.header.number.toString();

export const useLastBlock = () => {
  console.log('useLastBlock', 'render');
  const { apiInstance, loading } = usePolkadotJsContext();
  const [lastBlock, setLastBlock] = useState<PartialLastBlock>();

  const subscribeNewBlocks = useCallback(
    (callback: Callback) => {
      if (!apiInstance || loading) return;
      return makeSubscribeNewBlocks({ apiInstance })(callback);
    },
    [apiInstance, loading]
  );

  const unsubsribeRef: MutableRefObject<VoidFn | undefined> = useRef(undefined);

  useEffect(() => {
    (async () => {
      console.log(
        'useLastBlock',
        'subscribeNewBlocks',
        'starting subscription',
        subscribeNewBlocks
      );
      unsubsribeRef.current = await subscribeNewBlocks(setLastBlock);
    })();

    return () => {
      console.log(
        'useLastBlock',
        'subscribeNewBlocks',
        'trying to unsubscribe',
        unsubsribeRef
      );
      if (unsubsribeRef.current) {
        console.log('useLastBlock', 'subscribeNewBlocks', 'unsubscribing');
        unsubsribeRef.current();
      }
    };
  }, [subscribeNewBlocks]);

  return lastBlock;
};
