import React from 'react';
import { useLastBlockQuery } from '../hooks/lastBlock/useLastBlockQuery';
import { Wallet } from './Wallet';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {

  const { data: lastBlockData } = useLastBlockQuery();

  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-8">
          <h1>Basilisk</h1>
          <span>
            {lastBlockData?.lastBlock?.parachainBlockNumber 
              ? `#${lastBlockData.lastBlock.parachainBlockNumber}/#${lastBlockData.lastBlock.relaychainBlockNumber}` 
              : <></>
            }
          </span>
        </div>
        <div className="col">
          <Wallet />
        </div>
      </div>
      <div className="row">{children}</div>
    </div>
  );
};
