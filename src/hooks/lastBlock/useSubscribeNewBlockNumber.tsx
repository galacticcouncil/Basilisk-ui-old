import { VoidFn } from '@polkadot/api/types';
import { SignedBlock } from '@polkadot/types/interfaces';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const useSubscribeNewBlock = () => {
  const { apiInstance, loading } = usePolkadotJsContext();
  const [lastBlock, setLastBlock] = useState<SignedBlock | undefined>(
    undefined
  );

  const subscribeNewBlocks = useCallback(async () => {
    if (!apiInstance) {
      return;
    }

    if (loading) {
      return;
    }

    const unsubscribe = await apiInstance.derive.chain.subscribeNewBlocks(
      setLastBlock
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

  return lastBlock;
};
