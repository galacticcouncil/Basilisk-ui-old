import {
  ApolloCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import { PersistedValidationData } from '@polkadot/types/interfaces';
import { useCallback, useEffect } from 'react';
import { LastBlock } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import {
  GetLastBlockQueryResponse,
  GET_LAST_BLOCK,
} from './queries/useLastBlockQuery';
import { useSubscribeNewBlock } from './useSubscribeNewBlockNumber';

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

export const validationDataDataType =
  'Option<PolkadotPrimitivesV1PersistedValidationData>';

export type ValidationData = PersistedValidationData;

export const useRefetchWithNewBlock = (
  client?: ApolloClient<NormalizedCacheObject>
) => {
  const chainLastBlock = useSubscribeNewBlock();
  const { apiInstance } = usePolkadotJsContext();

  const getValidationData = useCallback(async () => {
    if (!apiInstance) {
      return;
    }

    const validationData =
      await apiInstance.query.parachainSystem.validationData();

    const validationDataOption = apiInstance.createType(
      validationDataDataType,
      validationData
    );

    if (validationDataOption.isSome) {
      const validationData =
        validationDataOption.toJSON() as unknown as PersistedValidationData;

      return {
        relaychain: validationData.relayParentNumber.toString(),
      };
    }

    return null;
  }, [apiInstance]);

  useEffect(() => {
    if (!client) {
      return;
    }
    if (!chainLastBlock) {
      return;
    }

    getValidationData().then((validationData) => {
      if (!validationData) {
        return;
      }

      const lastBlock: LastBlock = {
        __typename,
        id,
        relaychain: validationData.relaychain,
        parachain: chainLastBlock.block.header.number.toString(),
      };

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
    });
  }, [chainLastBlock, client, getValidationData]);
};
