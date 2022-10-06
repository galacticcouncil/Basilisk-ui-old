// implement query that triggers the local balance resolver (as subfield?)
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import { Balance } from '../../../generated/graphql'

// graphql query
export const GET_BALANCES = loader('./../graphql/GetBalances.query.graphql')

// data shape returned from the query
export interface GetBalancesQueryResponse {
  assetId: Balance['assetId']
  balance: Balance['balance']
}

/**
 * Copied from docs
 * useQuery - this will immediately request data via the data layer's resolvers
 * useLazyQuery - this will return a callback, that can be timed or manually executed to request the data at a later time (e.g. after a timeout or on user interaction)
 * constate - both query types can be contextualized to avoid concurrency issues in a case where multiple containers use the same queries at the same times (at time of rendering)
 * cache.readQuery / cache.readFragment - this will only read already cached data, without making a roundtrip to the data resolver.
 */

// hook wrapping the built-in apollo useQuery hook with proper types & configuration
export const useGetBalancesQuery = () =>
  useQuery<GetBalancesQueryResponse>(GET_BALANCES, {
    notifyOnNetworkStatusChange: true
  })
