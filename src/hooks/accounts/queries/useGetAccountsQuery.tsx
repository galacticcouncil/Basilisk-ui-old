import { useLazyQuery, useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import { Query } from '../../../generated/graphql'

export const GET_ACCOUNTS = loader('./../graphql/GetAccounts.query.graphql')
export interface GetAccountsQueryResponse {
  accounts: Query['accounts']
  lastBlock: Query['lastBlock']
}

export const useGetAccountsQuery = (skip: boolean = false) =>
  useQuery<GetAccountsQueryResponse>(GET_ACCOUNTS, {
    notifyOnNetworkStatusChange: true,
    skip: skip
  })

export const useGetAccountsLazyQuery = () =>
  useLazyQuery<GetAccountsQueryResponse>(GET_ACCOUNTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-only'
  })
