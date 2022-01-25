import { QueryHookOptions, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Extension } from '../../../generated/graphql';

// graphql query
export const GET_EXTENSION = loader('./../graphql/GetExtension.query.graphql');

// data shape returned from the query
export interface GetExtensionQueryResponse {
  extension: Pick<Extension, 'isAvailable'>;
}

// hook wrapping the built-in apollo useQuery hook with proper types & configuration
export const useGetExtensionQuery = (options?: QueryHookOptions) =>
  useQuery<GetExtensionQueryResponse>(GET_EXTENSION, {
    notifyOnNetworkStatusChange: true,
    ...options,
  });
