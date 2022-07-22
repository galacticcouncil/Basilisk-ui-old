import { useAddLiquidityMutationResolver } from './useAddLiquidityMutationResolver';
import { useRemoveLiquidityMutationResolver } from './useRemoveLiquidityMutationResolver';
import { useSubmitTradeMutationResolver } from './useSubmitTradeMutationResolvers'

export const usePoolsMutationResolvers = () => {
    return {
        submitTrade: useSubmitTradeMutationResolver(),
        removeLiquidity: useRemoveLiquidityMutationResolver(),
        addLiquidity: useAddLiquidityMutationResolver()
    }
}