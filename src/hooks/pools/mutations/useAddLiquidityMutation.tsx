import { MutationHookOptions, useMutation } from '@apollo/client'
import { loader } from 'graphql.macro'

const REMOVE_LIQUIDITY = loader('./../graphql/AddLiquidity.mutation.graphql')

export interface AddLiquidityMutationVariables {
  assetA: string
  assetB: string
  amountA: string
  amountBMaxLimit: string
}

export const useAddLiquidityMutation = (
  options?: MutationHookOptions<any, any>
) =>
  useMutation<void, AddLiquidityMutationVariables>(REMOVE_LIQUIDITY, {
    notifyOnNetworkStatusChange: true,
    ...options
  })
