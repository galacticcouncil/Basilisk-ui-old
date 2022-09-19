import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { XykPool } from '../../../generated/graphql';

export const GET_XYK_POOL_BY_ASSETS = loader(
  './../graphql/GetXYKPoolByAssets.query.graphql'
);

export interface GetPoolByAssetsQueryVariables {
  assetInId?: string;
  assetOutId?: string;
}
export interface GetPoolQueryResponse {
  pool: XykPool;
}

export const useGetPoolByAssetsQuery = (
  variables: GetPoolByAssetsQueryVariables,
  skip: boolean
) =>
  useQuery<GetPoolQueryResponse>(GET_XYK_POOL_BY_ASSETS, {
    variables,
    notifyOnNetworkStatusChange: true,
    skip,
  });
