import { useEffect, useState } from 'react';
import { useLastBlockContext } from '../lastBlock/useSubscribeNewBlockNumber';
import { useMathContext } from '../math/useMath';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const useLoading = () => {
  const { loading: polkadotJsLoading } = usePolkadotJsContext();
  const { math } = useMathContext();
  const lastBlock = useLastBlockContext()

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!polkadotJsLoading && math && lastBlock) {
      setLoading(false);
    }
  }, [polkadotJsLoading, math, lastBlock]);

  return loading;
};
