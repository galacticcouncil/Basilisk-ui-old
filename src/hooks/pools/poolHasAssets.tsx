import { Pool } from '../../generated/graphql';

/**
 * Check if the given pool contains the selected assets
 * @param pool 
 * @param assetAId 
 * @param assetBId 
 * @returns 
 */
export const poolHasAssets = (pool: Pool, assetAId: string, assetBId: string) => {
    const poolAssets = [pool.assetAId, pool.assetBId];
    return poolAssets.includes(assetAId) && poolAssets.includes(assetBId);
}