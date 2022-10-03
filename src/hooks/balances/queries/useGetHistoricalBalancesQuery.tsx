import { QueryHookOptions, useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'

export const GET_HISTORICAL_BALANCES = loader(
  './../graphql/GetHistoricalBalances.query.graphql'
)

export interface HistoricalBalance {
  assetABalance: string
  assetBBalance: string
  relayChainBlockHeight: number
}

export interface GetHistoricalBalancesQueryResponse {
  historicalBalances: HistoricalBalance[]
}

export interface GetHistoricalBalancesQueryVariables {
  from: number
  to: number
  poolId: string
}

export const useGetHistoricalBalancesQuery = (
  variables: GetHistoricalBalancesQueryVariables,
  options?: QueryHookOptions
) => {
  console.log('useGetHistoricalBalancesQuery', variables, options)
  return useQuery<GetHistoricalBalancesQueryResponse>(GET_HISTORICAL_BALANCES, {
    variables: {
      ...variables
    }
  })
}
