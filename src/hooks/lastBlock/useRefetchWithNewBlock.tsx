import {
  ApolloCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import { useEffect } from 'react';
import { LastBlock } from '../../generated/graphql';
import {
  GetLastBlockQueryResponse,
  GET_LAST_BLOCK,
} from './queries/useLastBlockQuery';
import { useLastBlock } from './useLastBlock';

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
  const lastBlock = useLastBlock();

  useEffect(() => {
    if (!client || !lastBlock) {
      return;
    }

    console.log({ lastBlock });

    const lastBlockData = client.cache.readQuery<GetLastBlockQueryResponse>({
      query: GET_LAST_BLOCK,
    });

    if (!lastBlockData?.lastBlock?.parachain) {
      // received the first real lastBlockNumber, don't refetch just yet
      writeLastBlock(client.cache, lastBlock);
    } else {
      // lastBlockNumber has been updated, and it's not the first time
      // refetch queries that depend on the lastBlockNumber
      client.refetchQueries({
        updateCache(cache) {
          writeLastBlock(cache, lastBlock);
        },
      });
    }
  }, [lastBlock, client]);
};
