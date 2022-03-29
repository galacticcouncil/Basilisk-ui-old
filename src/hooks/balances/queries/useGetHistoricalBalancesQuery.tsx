import { QueryHookOptions, useQuery } from "@apollo/client";
import { loader } from "graphql.macro";

export const GET_HISTORICAL_BALANCES = loader('./../graphql/GetHistoricalBalances.query.graphql');

export interface HistoricalBalance {
    assetABalance: string,
    assetBBalance: string,
    createdAt: string
}

export interface GetHistoricalBalancesQueryResponse {
    historicalBalances: HistoricalBalance[]
    XYKPool: {
        assetAId: string,
        assetBId: string
    }
}

export interface GetHistoricalBalancesQueryVariables {
    from: string,
    to: string,
    quantity: number,
    poolId: string
}

export const useGetHistoricalBalancesQuery = (variables: GetHistoricalBalancesQueryVariables, options?: QueryHookOptions) => useQuery<GetHistoricalBalancesQueryResponse>(
    GET_HISTORICAL_BALANCES,
    {
        variables: {
            ...variables,
            poolIdID: variables.poolId
        },
        ...options
    }
)