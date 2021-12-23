import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from '../../../generated/graphql';

export const GET_ACTION_LOG = loader('../graphql/GetActionLog.query.graphql');

export interface GetActionLogQueryResponse {
  actionLog: Query['actionLog'];
}

export const useGetActionLogQuery = () =>
  useQuery<GetActionLogQueryResponse>(GET_ACTION_LOG, {
    notifyOnNetworkStatusChange: true,
    returnPartialData: true,
  });
