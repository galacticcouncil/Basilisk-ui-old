import { Pool } from '../../generated/graphql';

/**
 * Check if the given pool contains the selected assets
 * @param pool 
 * @param assetInId 
 * @param assetOutId 
 * @returns 
 */
export const poolHasAssets = (pool: Pool, assetInId: string, assetOutId: string) => {
    const poolAssets = [pool.assetInId, pool.assetOutId];
    return poolAssets.includes(assetInId) && poolAssets.includes(assetOutId);
}