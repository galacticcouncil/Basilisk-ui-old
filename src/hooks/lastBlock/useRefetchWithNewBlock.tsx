import { ApolloCache, ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { relativeTimeRounding } from 'moment';
import { useEffect } from 'react';
import { LastBlock } from '../../generated/graphql';
import { GetLastBlockQueryResponse, GET_LAST_BLOCK } from './useLastBlockQuery';
import { useLastBlockNumberContext, useSubscribeNewBlockNumber } from './useSubscribeNewBlockNumber'

export const __typename = 'LastBlock';
export const id = __typename;

export const writeLastBlock = (cache: ApolloCache<NormalizedCacheObject>, lastBlock: LastBlock) => {
    return cache.writeQuery<GetLastBlockQueryResponse>({
        query: GET_LAST_BLOCK,
        data: {
            lastBlock
        }
    })
}
export const useRefetchWithNewBlock = (client: ApolloClient<NormalizedCacheObject>) => {
    const lastBlockNumber = useLastBlockNumberContext();

    useEffect(() => {
        writeLastBlock(client.cache, {
            __typename,
            id,
            number: lastBlockNumber
        });
    }, []);

    useEffect(() => {
        if (!lastBlockNumber) return;

        const lastBlockData = client.cache.readQuery<GetLastBlockQueryResponse>({
            query: GET_LAST_BLOCK
        });

        if (!lastBlockData?.lastBlock?.number) {
            // received the first real lastBlockNumber, don't refetch just yet
            writeLastBlock(client.cache, {
                __typename,
                id,
                number: lastBlockNumber
            })
        } else {
            // lastBlockNumber has been updated, and it's not the first time
            // refetch queries that depend on the lastBlockNumber
            client.refetchQueries({
                updateCache(cache) {
                    writeLastBlock(cache, {
                        __typename,
                        id,
                        number: lastBlockNumber
                    })
                }
            })
        }
    }, [lastBlockNumber]);
}