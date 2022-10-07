import { QueryHookOptions, useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import { Balance } from '../../../generated/graphql'
const GET_ACTIVE_ACCOUNT_TRADE_BALANCES = loader(
  '../../TradePage/graphql/GetActiveAccountTradeBalances.query.graphql'
)

export interface GetActiveAccountTradeBalancesQueryVariables {
  assetInId?: string
  assetOutId?: string
}

export interface GetActiveAccountTradeBalancesQueryResponse {
  activeAccount?: {
    balances: Balance[]
  }
}

export const useGetActiveAccountTradeBalances = (
  options: QueryHookOptions<
    GetActiveAccountTradeBalancesQueryResponse,
    GetActiveAccountTradeBalancesQueryVariables
  >
) =>
  useQuery<
    GetActiveAccountTradeBalancesQueryResponse,
    GetActiveAccountTradeBalancesQueryVariables
  >(GET_ACTIVE_ACCOUNT_TRADE_BALANCES, {
    notifyOnNetworkStatusChange: true,
    ...options
  })
