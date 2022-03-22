import { useQuery } from '@apollo/client';
import { Constants } from '../../../../generated/graphql';
import { loader } from 'graphql.macro';

export const GET_CONSTANTS = loader(
  '../../graphql/GetLbpConstants.query.graphql'
);

export interface GetLbpConstantsQueryResponse {
  constants: Pick<Constants, 'lbp'>;
}

export const useGetLbpConstantsQuery = () =>
  useQuery<GetLbpConstantsQueryResponse>(GET_CONSTANTS);
