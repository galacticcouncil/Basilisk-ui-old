import { useGetActionLogQuery } from '../hooks/actionLog/queries/useGetActionLogQuery';
import { useGetUserActions } from '../hooks/actionLog/queries/useGetUserActionsQuery';
import { useMemo } from 'react';
import { UserAction } from '../generated/graphql';
import { cloneDeep } from 'lodash';

export const __typename: UserAction['__typename'] = 'UserAction';

export const ActionLogPage = () => {
  const { data: clientActionLogData, loading: clientLoading } =
    useGetActionLogQuery();
  const { data: actionLogData, loading } = useGetUserActions();

  const cachedData = useMemo(
    () => clientActionLogData?.actionLog,
    [clientActionLogData?.actionLog]
  );
  const userActions = useMemo(
    () => actionLogData?.userActions,
    [actionLogData?.userActions]
  );

  const data = useMemo(() => {
    if (cachedData && cachedData.length > 0) {
      let d = cloneDeep(userActions) || [];

      cachedData.forEach((action) => {
        d.unshift({ ...action, __typename });
      });

      return d;
    } else {
      return userActions || [];
    }
  }, [cachedData, userActions]);

  return (
    <div
      style={{
        textAlign: 'left',
      }}
    >
      <h1>ActionLog</h1>

      {loading || clientLoading ? (
        <i>[WalletPage] Loading action log...</i>
      ) : (
        <i>[WalletPage] Everything is up to date</i>
      )}

      <br />
      <br />

      {data.map((action, i) => (
        <p>
          {i} : {action.action} - {action.status} - {action.id}
        </p>
      ))}
    </div>
  );
};
