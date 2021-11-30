import { useBalanceQueryResolvers } from '../../balances/useBalanceQueryResolvers'
import { useGetPoolsQueryResolver } from './useGetPoolsQueryResolver'

export const usePoolsQueryResolver = () => {
    const getPoolsQueryResolver = useGetPoolsQueryResolver()
    const poolFieldsQueryResolvers = {
        ...useBalanceQueryResolvers()
    }

    return {
        Query: {
            pools: getPoolsQueryResolver,
        },
        XYKPool: poolFieldsQueryResolvers,
        LBPPool: poolFieldsQueryResolvers
    }
}