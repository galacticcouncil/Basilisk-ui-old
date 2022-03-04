import { useQuery } from '@apollo/client';
import constate from 'constate';
import { loader } from 'graphql.macro';
import { Query } from '../../../generated/graphql';

export const GET_CONSTANTS = loader('./../graphql/GetConstants.query.graphql');

export interface GetConstantsQueryResponse {
  constants: Query['constants'];
}

export const useGetConstantsQuery = () => {
  const result = useQuery<GetConstantsQueryResponse>(GET_CONSTANTS, {
    notifyOnNetworkStatusChange: true,
  });

  return result;
};

export const [GetConstantsQueryProvider, useGetConstantsQueryContext] =
  constate(useGetConstantsQuery);
