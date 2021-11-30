import { useSubmitTradeMutationResolver } from './useSubmitTradeMutationResolvers'

export const usePoolsMutationResolvers = () => {
    const submitTrade = useSubmitTradeMutationResolver();
    
    return {
        submitTrade
    }
}