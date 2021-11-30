import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'

export const useLoading = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    return !apiInstance || loading;
}