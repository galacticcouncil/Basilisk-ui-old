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
import { LastBlock } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { getValidationData } from './lib/getValidationData';
import { subscribeNewBlock } from './lib/subscribeNewBlock';

export const __typename = 'LastBlock';
export const id = __typename;
export const getRelaychainNumber = (validationData: PersistedValidationData) =>
  validationData.relayParentNumber.toString();
export const getParachainNumber = (chainLastBlock: SignedBlock) =>
  chainLastBlock.block.header.number.toString();

export const useLastBlock = () => {
  const { apiInstance, loading } = usePolkadotJsContext();
  const [lastBlock, setLastBlock] = useState<LastBlock>();

  const subscribeNewBlocks = useCallback(async () => {
    if (!apiInstance || loading) {
      return;
    }

    const unsubscribe = await subscribeNewBlock(apiInstance, async (block) => {
      const parachain = getParachainNumber(block);

      const validationData = await getValidationData(apiInstance, block);

      if (!validationData) return;

      const relaychain = getRelaychainNumber(validationData);

      setLastBlock({
        __typename,
        id,
        relaychain,
        parachain,
      });
    });

    return unsubscribe;
  }, [apiInstance, loading]);

  const unsubsribeRef: MutableRefObject<VoidFn | undefined> = useRef(undefined);

  useEffect(() => {
    (async () => {
      unsubsribeRef.current = await subscribeNewBlocks();
    })();

    return () => {
      if (unsubsribeRef.current) {
        unsubsribeRef.current();
      }
    };
  }, [subscribeNewBlocks]);

  return lastBlock;
};
