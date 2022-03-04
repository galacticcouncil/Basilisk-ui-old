import React, { useEffect, useMemo, useState } from 'react';
import { useLastBlockQuery } from '../hooks/lastBlock/useLastBlockQuery';
import { Wallet } from './Wallet';
import Icon from '../components/Icon/Icon';
import './PageContainer.scss';
import moment from 'moment';
import classNames from 'classnames';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  const { data: lastBlockData } = useLastBlockQuery();
  
  const [lastBlockUpdate, setLastBlockUpdate] = useState(moment().valueOf());
  const [sinceLastBlockUpdate, setSinceLastBlockUpdate] = useState(0);

  useEffect(() => {
    setLastBlockUpdate(moment().valueOf());
  }, [lastBlockData?.lastBlock?.parachainBlockNumber]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const duration = moment.duration(
        moment().diff(moment(lastBlockUpdate))
      ).asSeconds();

      setSinceLastBlockUpdate(duration);
    }, 500);

    return () => clearInterval(intervalId);
  }, [lastBlockUpdate]);

  return (
    <div className="page-container">
      <div className="page-header">
        <Icon name="BasiliskLogoFull" />
        <Wallet />
      </div>
      <div className="">{children}</div>

      <div className="footer">
        <div className={classNames('liveliness', {
          'green': sinceLastBlockUpdate <= 30,
          'orange': sinceLastBlockUpdate > 30,
          'red': sinceLastBlockUpdate >= 60
        })}></div>
        <span>
          {lastBlockData?.lastBlock?.parachainBlockNumber ? (
            `Block no.: ${lastBlockData.lastBlock.parachainBlockNumber}`
          ) : (
            <></>
          )}
        </span>
      </div>
    </div>
  );
};
