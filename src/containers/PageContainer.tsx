import React from 'react';
import { Wallet } from './Wallet';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-8">
          <h1>Basilisk</h1>
        </div>
        <div className="col">
          <Wallet />
        </div>
      </div>
      <div className="row">{children}</div>
    </div>
  );
};
