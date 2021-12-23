import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from '../../../generated/graphql';

export const GET_USER_ACTION = loader(
  '../graphql/GetUserActionByID.query.graphql'
);

export interface GetUserActionByIdQueryVariables {
  id: string;
}

export interface GetUserActionResponse {
  action: Query['action'];
}

export const useGetUserActionByIDQuery = (
  variables: GetUserActionByIdQueryVariables
) =>
  useQuery<GetUserActionResponse>(GET_USER_ACTION, {
    variables,
    notifyOnNetworkStatusChange: true,
    returnPartialData: true,
  });
