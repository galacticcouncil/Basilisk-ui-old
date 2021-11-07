import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { LastBlock, Query } from '../../generated/graphql';


export const GET_LAST_BLOCK = loader('./GetLastBlock.query.graphql');
export interface GetLastBlockQueryResponse {
    lastBlock: Query['lastBlock']
}

export const useLastBlockQuery = () => useQuery<GetLastBlockQueryResponse>(GET_LAST_BLOCK);