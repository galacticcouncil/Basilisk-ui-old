import { useQuery } from '@apollo/client';
import { Query } from '../../../generated/graphql';
import { loader } from 'graphql.macro';

export const GET_CONSTANTS = loader('./../graphql/GetConstants.query.graphql');
export interface GetConstantsQueryResponse {
  constants: Query['constants'];
}

export const useGetConstantsQuery = () =>
  useQuery<GetConstantsQueryResponse>(GET_CONSTANTS);
