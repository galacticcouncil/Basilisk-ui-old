import React from 'react';
import { useGetExtensionQuery } from '../hooks/extension/queries/useGetExtensionQuery';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  const { data: extensionData } = useGetExtensionQuery();

  return (
    <>
      {extensionData?.extension.isAvailable
        ? 'extension available'
        : 'extension unavailable'}
    </>
  );
};
