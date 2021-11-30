import { AccountId, AssetId } from '@open-web3/orml-types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { useCallback } from 'react';
import { LbpAssetWeights, LbpFee, LbpPool } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import type { Codec } from '@polkadot/types/types';
import { mapToPoolId } from './useGetXykPools';
import { calculateOppositeAssetWeight } from './lbp/calculateOppositeAssetWeight';
import { HydraDxMath, useMath, useMathContext } from '../math/useMath';
import { calculateCurrentAssetWeight } from './lbp/calculateCurrentAssetWeight';
import { partial } from 'lodash';
import { ApolloClient, useApolloClient } from '@apollo/client';
import { readLastBlock } from '../lastBlock/readLastBlock';

export type AssetPair = number[];
export interface PoolData {
    assets: AssetPair,
    feeCollector: string,
    fee: {
        numerator: number,
        denominator: number
    },
    repayTarget: number,
    initialWeight: number,
    finalWeight: number,
    start: number,
    end: number,
}

/**
 * @param math 
 * @param client 
 * @returns Function to format the given codec into an LBPPool
 */
export const mapToPool = (
    math: HydraDxMath,
    client: ApolloClient<object>
) => 
    /**
     * @param [id, codec]
     * @returns LBPPool parsed from the coded provided as an argument
     */
    ([id, codec]: [string, Codec]) => {
        // TODO this is possibly VERY unsafe and needs to be revisited for type parsing / creation
        const poolData = codec.toJSON() as unknown as PoolData;
        const lastBlockData = readLastBlock(client);
        const relaychainBlockNumber = lastBlockData?.lastBlock?.relaychainBlockNumber;
        
        if (!poolData || !relaychainBlockNumber) return;

        // construct the pool entity without weights
        const partialPool: Omit<LbpPool, 'assetBWeights' | 'assetAWeights'> = {
            id,
            assetAId: poolData.assets[0].toString(),
            assetBId: poolData.assets[1].toString(),
            feeCollector: poolData.feeCollector,
            fee: {
                numerator: poolData.fee.numerator.toString(),
                denominator: poolData.fee.denominator.toString(),
            },
            repayTarget: poolData.repayTarget.toString(),
            startBlock: poolData.start.toString(),
            endBlock: poolData.end.toString()
        }

        // determine weights for asset A
        const partialAssetAWeights: Omit<LbpAssetWeights, 'current'> = {
            initial: poolData.initialWeight.toString(),
            final: poolData.finalWeight.toString(),
        }

        const assetAWeights: LbpAssetWeights = {
            ...partialAssetAWeights,
            current: calculateCurrentAssetWeight(
                math,
                partialPool,
                partialAssetAWeights,
                relaychainBlockNumber
            )
        }
        
        // determine weights for asset B
        const assetBWeights: LbpAssetWeights = {
            initial: calculateOppositeAssetWeight(assetAWeights.initial),
            final: calculateOppositeAssetWeight(assetAWeights.final),
            current: calculateOppositeAssetWeight(assetAWeights.current)
        }

        const pool: LbpPool = {
            ...partialPool,
            assetAWeights,
            assetBWeights
        };

        return pool;
    }

export const getLbpPools = async (
    apiInstance: ApiPromise,
    math: HydraDxMath,
    client: ApolloClient<object>
) => {
    return (await apiInstance.query.lbp.poolData.entries())
        .map(mapToPoolId) 
        .map(mapToPool(math, client)) || [];
}

/**
 * Hook to fetch and map LBPPool data
 * @returns Function that returns the on-chain LBPPool(s)
 */
export const useGetLbpPools = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const { math } = useMathContext()

    return useCallback(async (client: ApolloClient<object>) => {
        // return an empty array by default
        if (!apiInstance || loading || !math) return [];
        return getLbpPools(apiInstance, math, client);
    }, [apiInstance, loading, math])
}