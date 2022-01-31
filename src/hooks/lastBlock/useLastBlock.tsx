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
  const [validationData, setValidationData] =
    useState<PersistedValidationData | null>();
  const [lastParachainBlock, setLastParachainBlock] =
    useState<SignedBlock | null>();
  const [lastBlock, setLastBlock] = useState<LastBlock | null>();

  const subscribeNewBlocks = useCallback(async () => {
    if (!apiInstance || loading) {
      return;
    }

    const unsubscribe = await subscribeNewBlock(
      apiInstance,
      setLastParachainBlock
    );

    return unsubscribe;
  }, [apiInstance, loading]);

  const unsubsribeRef: MutableRefObject<VoidFn | undefined> = useRef(undefined);

  useEffect(() => {
    subscribeNewBlocks().then((unsubscribe) => {
      unsubsribeRef.current = unsubscribe;
    });

    return () => {
      if (unsubsribeRef.current) {
        unsubsribeRef.current();
      }
    };
  }, [subscribeNewBlocks]);

  useEffect(() => {
    if (!apiInstance || loading || !lastParachainBlock) {
      return;
    }

    getValidationData(apiInstance, lastParachainBlock).then(setValidationData);
  }, [apiInstance, loading, lastParachainBlock]);

  useEffect(() => {
    if (!lastParachainBlock || !validationData) {
      return;
    }

    setLastBlock({
      __typename,
      id,
      relaychain: getRelaychainNumber(validationData),
      parachain: getParachainNumber(lastParachainBlock),
    });
  }, [lastParachainBlock, validationData]);

  return lastBlock;
};
