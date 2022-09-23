import { useCallback } from 'react';
import { XykPool } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import type { StorageKey } from '@polkadot/types';
import type { AnyTuple, Codec } from '@polkadot/types/types';
import { ApiPromise } from '@polkadot/api';

export type PoolAssets = string[];
export const poolAssetsDataType = '(u32, u32)';

export const mapToPoolId = ([storageKey, codec]: [
  StorageKey<AnyTuple>,
  Codec
]): [string, Codec] => {
  const id = (storageKey.toHuman() as string[])[0];
  return [id, codec];
};

export const mapToPool = (apiInstance: ApiPromise) => ([
  id,
  codec,
  shareTokenId,
  totalLiquidity,
]: [string, Codec, Codec, Codec]) => {
  const poolAssets = codec.toHuman() as PoolAssets;

  console.log(
    'mapToPool',
    id,
    codec.toHuman(),
    shareTokenId.toHuman(),
    totalLiquidity.toHuman()
  );

  if (!poolAssets) return;

  return {
    id,
    assetInId: poolAssets[0],
    assetOutId: poolAssets[1],
    totalLiquidity: totalLiquidity.toString(),
    shareTokenId: shareTokenId.toString(),
  } as XykPool;
};

export const useGetXykPools = () => {
  const { apiInstance, loading } = usePolkadotJsContext();

  return useCallback(
    async (poolId?: string, assetIds?: string[]) => {
      if (!apiInstance || loading) return [];
      console.log('getting XYK pools');
      const pools =
        (await apiInstance.query.xyk.poolAssets.entries())
          .map(async (data) => {
            const pool = mapToPoolId(data);

            return {
              id: pool[0],
              data: [
                pool[1], // assets
                await apiInstance.query.xyk.shareToken(poolId || pool[0]),
                await apiInstance.query.xyk.totalLiquidity(poolId || pool[0]),
              ],
            };
          })
          .map(async (data) => {
            const d = await data;
            return mapToPool(apiInstance)([
              d.id,
              d.data[0],
              d.data[1],
              d.data[2],
            ]);
          }) || [];

      return await Promise.all(pools);
    },
    [apiInstance, loading]
  );
};
