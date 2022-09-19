import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { LbpPool } from '../../../generated/graphql';

export const GET_LBP_POOL_BY_ASSETS = loader(
  './../graphql/GetLBPPoolByAssets.query.graphql'
);

export interface GetPoolByAssetsQueryVariables {
  assetInId?: string;
  assetOutId?: string;
}
export interface GetPoolQueryResponse {
  pool: LbpPool;
}

export const useGetPoolByAssetsQuery = (
  variables: GetPoolByAssetsQueryVariables,
  skip: boolean
) =>
  useQuery<GetPoolQueryResponse>(GET_LBP_POOL_BY_ASSETS, {
    variables,
    notifyOnNetworkStatusChange: true,
    skip,
  });
