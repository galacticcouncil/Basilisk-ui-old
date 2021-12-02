import { useMathContext } from '../math/useMath';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'

export const useLoading = () => {
    const { apiInstance } = usePolkadotJsContext();
    const { math } = useMathContext();
    return !apiInstance || !math;
}