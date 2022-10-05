import { MutationHookOptions, useMutation } from '@apollo/client'
import { loader } from 'graphql.macro'
import { PoolType } from '../../../components/Chart/shared'
import { TradeType } from '../../../generated/graphql'

const REMOVE_LIQUIDITY = loader('./../graphql/RemoveLiquidity.mutation.graphql')

export interface RemoveLiquidityMutationVariables {
  assetA: string
  assetB: string
  amount: string
}

export const useRemoveLiquidityMutation = (
  options?: MutationHookOptions<any, any>
) =>
  useMutation<void, RemoveLiquidityMutationVariables>(REMOVE_LIQUIDITY, {
    notifyOnNetworkStatusChange: true,
    ...options
  })
