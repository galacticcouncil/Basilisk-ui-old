import React from 'react';
import { Wallet } from './Wallet';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Wallet />
      {children}
    </>
  );
};
