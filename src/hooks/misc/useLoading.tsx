import { useMathContext } from '../math/useMath';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const useLoading = () => {
  const { loading } = usePolkadotJsContext();
  const { math } = useMathContext();
  return loading || !math;
};
