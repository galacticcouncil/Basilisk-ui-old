import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import { Pool } from '../../../generated/graphql'

export const GET_POOL_BY_ASSETS = loader(
  './../graphql/GetPoolByAssets.query.graphql'
)

export interface GetPoolByAssetsQueryVariables {
  assetInId?: string
  assetOutId?: string
}
export interface GetPoolQueryResponse {
  pool: Pool
}

export const useGetPoolByAssetsQuery = (
  variables: GetPoolByAssetsQueryVariables,
  skip: boolean
) =>
  useQuery<GetPoolQueryResponse>(GET_POOL_BY_ASSETS, {
    variables,
    notifyOnNetworkStatusChange: true,
    skip
  })
