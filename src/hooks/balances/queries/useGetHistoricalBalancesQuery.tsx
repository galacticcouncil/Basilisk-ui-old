import { QueryHookOptions, useLazyQuery } from '@apollo/client'
import { loader } from 'graphql.macro'

export const GET_HISTORICAL_BALANCES = loader(
  './../graphql/GetHistoricalBalances.query.graphql'
)

export const GET_HISTORICAL_BALANCES_EXACT = loader(
  './../graphql/GetHistoricalBalancesExact.query.graphql'
)

export const GET_FIRST_HISTORICAL_BLOCK = loader(
  './../graphql/GetFirstHistoricalBlock.query.graphql'
)

export const GET_LAST_HISTORICAL_BLOCK = loader(
  './../graphql/GetLastHistoricalBlock.query.graphql'
)

export interface HistoricalBalance {
  assetABalance: string
  assetBBalance: string
  relayChainBlockHeight: number
  paraChainBlockHeight?: number
}

export interface HistoricalBlockHeights {
  relayChainBlockHeight: number
  paraChainBlockHeight: number
}

export interface FirstHistoricalBlockQueryResponse {
  firstHistoricalParachainBlock: [HistoricalBlockHeights]
}

export interface LastHistoricalBlockQueryResponse {
  lastHistoricalParachainBlock: [HistoricalBlockHeights]
}

export interface GetHistoricalBalancesQueryResponse {
  historicalBalances: HistoricalBalance[]
}

export interface GetHistoricalBalancesQueryVariables {
  from: number
  to: number
  poolId: string
}

export interface GetHistoricalBalancesExactQueryVariables {
  recordIds: string[]
}

export interface GetFirstHistoricalBlockQueryVariables {
  blockHeight: number
  poolId: string
}

export interface GetLastHistoricalBlockQueryVariables {
  blockHeight: number
  poolId: string
}

export const useGetHistoricalBalancesQuery = (
  variables: GetHistoricalBalancesQueryVariables,
  options?: QueryHookOptions
) => {
  console.log('useGetHistoricalBalancesQuery', variables, options)
  return useLazyQuery<GetHistoricalBalancesQueryResponse>(
    GET_HISTORICAL_BALANCES,
    {
      variables: {
        ...variables
      }
    }
  )
}

export const useGetHistoricalBalancesExactQuery = (
  variables: GetHistoricalBalancesExactQueryVariables,
  options?: QueryHookOptions
) => {
  console.log('useGetHistoricalBalancesExactQuery', variables, options)
  return useLazyQuery<GetHistoricalBalancesQueryResponse>(
    GET_HISTORICAL_BALANCES_EXACT,
    {
      variables: {
        ...variables
      }
    }
  )
}

export const useGetFirstHistoricalBlockQuery = (
  variables: GetFirstHistoricalBlockQueryVariables,
  options?: QueryHookOptions
) => {
  console.log('useGetFirstHistoricalBlockQuery', variables, options)
  return useLazyQuery<FirstHistoricalBlockQueryResponse>(
    GET_FIRST_HISTORICAL_BLOCK,
    {
      variables: {
        ...variables
      }
    }
  )
}

export const useGetLastHistoricalBlockQuery = (
  variables: GetFirstHistoricalBlockQueryVariables,
  options?: QueryHookOptions
) => {
  console.log('useGetLastHistoricalBlockQuery', variables, options)
  return useLazyQuery<LastHistoricalBlockQueryResponse>(
    GET_LAST_HISTORICAL_BLOCK,
    {
      variables: {
        ...variables
      }
    }
  )
}
