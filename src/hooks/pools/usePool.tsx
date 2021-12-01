import { Pool } from '../../generated/graphql';
import { useFromPrecision12 } from '../math/useFromPrecision';
import { useAssetBalance, useSpotPrice } from './useSpotPrice';

export const usePool = (
    pool?: Pool,
    assetInId?: string,
    assetOutId?: string,
) => {
    const liquidityAssetA = useAssetBalance(pool, assetInId);
    const liquidityAssetB = useAssetBalance(pool, assetOutId);

    const spotPriceAToB = useSpotPrice(pool, assetOutId, assetInId);
    const spotPriceBToA = useSpotPrice(pool, assetInId, assetOutId);

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