import { NetworkStatus } from '@apollo/client';
import { useMemo } from 'react';
import { useGetExtensionQuery } from '../../hooks/extension/queries/useGetExtensionQuery';

export const isReadyOrRefetching = (
  data: any | undefined,
  networkStatus: NetworkStatus
) =>
  data && [NetworkStatus.ready, NetworkStatus.refetch].includes(networkStatus);

export const Test = () => {
  const { data, refetch, networkStatus } = useGetExtensionQuery();

  const ready = useMemo(() => isReadyOrRefetching(data, networkStatus), [
    networkStatus,
    data,
  ]);

  return (
    <div>
      {ready
        ? data?.extension.isAvailable
          ? 'available'
          : 'unavailable'
        : 'not yet loaded'}
      {networkStatus}
      <button onClick={(_) => refetch()}>refetch</button>
    </div>
  );
};
