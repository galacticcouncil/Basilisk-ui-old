import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import { Asset } from '../../../generated/graphql'

export const GET_ASSETS = loader('../graphql/GetAssets.query.graphql')

export interface GetAssetsQueryResponse {
  assets: Asset[]
}

export const useGetAssetsQuery = () =>
  useQuery<GetAssetsQueryResponse>(GET_ASSETS, {
    notifyOnNetworkStatusChange: true
  })
