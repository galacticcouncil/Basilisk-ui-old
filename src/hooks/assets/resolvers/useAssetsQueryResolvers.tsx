import { useGetAssetsQueryResolver } from './useGetAssetsQueryResolver'

export const useAssetsQueryResolvers = () => {
    const getAssetsQueryResolver = useGetAssetsQueryResolver();

    return {
        assets: getAssetsQueryResolver
        // TODO: add stuff like a total circulating supply or other data we might need
        // Asset:
    }
}