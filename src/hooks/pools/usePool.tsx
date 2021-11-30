import { Pool } from '../../generated/graphql';
import { useFromPrecision12 } from '../math/useFromPrecision';
import { useAssetBalance, useSpotPrice } from './useSpotPrice';

export const usePool = (
    pool?: Pool,
    assetAId?: string,
    assetBId?: string,
) => {
    const liquidityAssetA = useAssetBalance(pool, assetAId);
    const liquidityAssetB = useAssetBalance(pool, assetBId);

    const spotPriceAToB = useSpotPrice(pool, assetBId, assetAId);
    const spotPriceBToA = useSpotPrice(pool, assetAId, assetBId);

    return {
        liquidity: {
            assetA: {
                balance: liquidityAssetA,
            },
            assetB: {
                balance: liquidityAssetB,
            }
        },
        spotPrice: {
            aToB: spotPriceAToB,
            bToA: spotPriceBToA
        }
    }
}