import constate from 'constate';
import { useCallback, useEffect, useState } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'

// TODO: lift up using constate
export const useSubscribeNewBlockNumber = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const [lastBlockNumber, setLastBlockNumber] = useState<string | undefined>(undefined);

    const subscribeNewBlocks = useCallback(() => {
        if (!apiInstance) return;
        // TODO: how to unsubscribe?
        apiInstance.derive.chain
            .subscribeNewBlocks((block) => {
                setLastBlockNumber(block.block.header.number.toString())
            })

    }, [apiInstance]);

    useEffect(() => {
        if (loading) return;
        subscribeNewBlocks();
    }, [loading, subscribeNewBlocks])

    return lastBlockNumber;
}

export const [LastBlockNumberProvider, useLastBlockNumberContext] = constate(useSubscribeNewBlockNumber);