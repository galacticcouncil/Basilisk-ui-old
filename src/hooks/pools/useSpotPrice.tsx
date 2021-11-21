import { first } from 'lodash';
import { useCallback, useMemo } from 'react';
import { Pool } from '../../generated/graphql';
import { useMathContext } from '../math/useMath';

export const getAssetBalance = (pool?: Pool, assetId?: string) => (
    first(
        pool?.balances
            ?.filter(balance => balance.assetId === assetId)
    )?.balance
)
// export const oneWithPrecision = '1000000000000'; // 10^12 doesnt work, use 10^9 instead
export const oneWithPrecision = '1000000000000'; // 10^12 doesnt work, use 10^9 instead
export const useSpotPrice = (
    pool?: Pool,
    assetAId?: string,
    assetBId?: string
) => {
    const { math } = useMathContext();

    return useMemo(() => {
        const assetABalance = getAssetBalance(pool, assetAId)
        const assetBBalance = getAssetBalance(pool, assetBId)

        console.log('asset balances', assetABalance, assetBBalance, math);

        if (!assetABalance || !assetBBalance || !math) return;

        return math.get_spot_price(
            assetABalance,
            assetBBalance,
            oneWithPrecision,
        )
    }, [math, pool]);
}