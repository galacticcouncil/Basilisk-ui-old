import {
  ApolloCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import { useEffect } from 'react';
import { LastBlock } from '../../generated/graphql';
import { GetLastBlockQueryResponse, GET_LAST_BLOCK } from './useLastBlockQuery';
import { useLastBlockContext } from './useSubscribeNewBlockNumber';

export const __typename = 'LastBlock';
export const id = __typename;

export const writeLastBlock = (
  cache?: ApolloCache<NormalizedCacheObject>,
  lastBlock?: LastBlock
) => {
  return cache?.writeQuery<GetLastBlockQueryResponse>({
    query: GET_LAST_BLOCK,
    data: {
      lastBlock,
    },
  });
};
export const useRefetchWithNewBlock = (
  client?: ApolloClient<NormalizedCacheObject>
) => {
  const lastBlock = useLastBlockContext();

  useEffect(() => {
    if (!lastBlock) return;

    const lastBlockData = client?.cache.readQuery<GetLastBlockQueryResponse>({
      query: GET_LAST_BLOCK,
    });

    if (!lastBlockData?.lastBlock?.parachainBlockNumber) {
      // received the first real lastBlockNumber, don't refetch just yet
      writeLastBlock(client?.cache, {
        __typename,
        id,
        ...lastBlock,
      });
    } else {
      // lastBlockNumber has been updated, and it's not the first time
      // refetch queries that depend on the lastBlockNumber
      client?.refetchQueries({
        updateCache(cache) {
          writeLastBlock(cache, {
            __typename,
            id,
            ...lastBlock,
          });
        },
      });
    }
  }, [lastBlock, client]);
};
