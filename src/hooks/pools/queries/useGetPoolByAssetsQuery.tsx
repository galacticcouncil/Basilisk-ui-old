import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { PoolType } from '../../../components/Chart/shared';
import { Pool } from '../../../generated/graphql';
import { GetPoolsQueryResponse } from './useGetPoolsQuery';

export const GET_POOL_BY_ASSETS = loader(
  './../graphql/GetPoolByAssets.query.graphql'
);
export const GET_LBP_POOL_BY_ASSETS = loader(
  './../graphql/GetLBPPoolByAssets.query.graphql'
);
export const GET_XYK_POOL_BY_ASSETS = loader(
  './../graphql/GetLBPPoolByAssets.query.graphql'
);

export interface GetPoolByAssetsQueryVariables {
  assetInId?: string;
  assetOutId?: string;
  poolType?: PoolType;
}
export interface GetPoolQueryResponse {
  pool: Pool;
}

export const useGetPoolByAssetsQuery = (
  variables: GetPoolByAssetsQueryVariables,
  skip: boolean
) =>
  useQuery<GetPoolQueryResponse>(GET_POOL_BY_ASSETS, {
    variables,
    notifyOnNetworkStatusChange: true,
    skip,
  });
