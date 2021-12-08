import constate from 'constate';
import { useCallback, useEffect, useState } from 'react';
import { LastBlock } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { Option } from '@polkadot/types'
import BN from 'bn.js';
import { Codec } from '@polkadot/types/types';

export const validationDataDataType = 'Option<PolkadotPrimitivesV1PersistedValidationData>';
export interface PolkadotPrimitivesV1PersistedValidationData {
    relayParentNumber: number
}
export type ValidationData = PolkadotPrimitivesV1PersistedValidationData

// TODO: lift up using constate
export const useSubscribeNewBlock = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const [lastBlock, setLastBlock] = useState<Partial<LastBlock> | undefined>(undefined);

    const subscribeNewBlocks = useCallback(() => {
        if (!apiInstance) return;
        // TODO: how to unsubscribe?
        apiInstance.derive.chain
            .subscribeNewBlocks(async (block) => {
                const validationData = await apiInstance.query.parachainSystem.validationData();

                const validationDataOption = apiInstance.createType(
                    validationDataDataType,
                    validationData
                );
                
                // TODO: this will only update the block if the relay chain block number is known
                if (validationDataOption.isSome) {
                    const validationData = validationDataOption.toJSON() as unknown as PolkadotPrimitivesV1PersistedValidationData;
                    setLastBlock({
                        parachainBlockNumber: block.block.header.number.toString(),
                        relaychainBlockNumber: '821' || validationData.relayParentNumber.toString()
                    })
                }                
            })

    }, [apiInstance]);

    useEffect(() => {
        if (loading) return;
        subscribeNewBlocks();
    }, [loading, subscribeNewBlocks])

    return lastBlock;
}

export const [LastBlockProvider, useLastBlockContext] = constate(useSubscribeNewBlock);