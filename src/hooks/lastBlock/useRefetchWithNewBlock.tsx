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
    console.log('lastBlock', lastBlock);

    if (!lastBlockData?.lastBlock?.parachainBlockNumber) {
      // received the first real lastBlockNumber, don't refetch just yet
      writeLastBlock(client?.cache, {
        __typename,
        id,
        ...lastBlock,
      });
    } else {
      writeLastBlock(client?.cache, {
        __typename,
        id,
        ...lastBlock,
      });

      // lastBlockNumber has been updated, and it's not the first time
      // refetch queries that depend on the lastBlockNumber
      setTimeout(() => {
        client?.refetchQueries({
          updateCache(cache) {
            cache.modify({
              fields: {
                lastBlock(value, { INVALIDATE }) {
                  return INVALIDATE
                }
              }
            })
          },
          optimistic: true,
        })
      }, 0)
    }
  }, [lastBlock, client]);
};
