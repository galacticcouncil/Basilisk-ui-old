import React, { useEffect, useMemo, useState } from 'react';
import { useLastBlockQuery } from '../hooks/lastBlock/useLastBlockQuery';
import { Wallet } from './Wallet';
import Icon from '../components/Icon/Icon';
import './PageContainer.scss';
import moment from 'moment';
import classNames from 'classnames';
import { NetworkStatus } from '@apollo/client';
import { horizontalBar } from '../components/Chart/ChartHeader/ChartHeader';
import { useDebugBoxContext } from '../pages/TradePage/hooks/useDebugBox';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  const { data: lastBlockData } = useLastBlockQuery();

  const [lastBlockUpdate, setLastBlockUpdate] = useState(moment().valueOf());
  const [sinceLastBlockUpdate, setSinceLastBlockUpdate] = useState(0);

  useEffect(() => {
    setLastBlockUpdate(moment().valueOf());
  }, [lastBlockData?.lastBlock?.parachainBlockNumber]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const duration = moment
        .duration(moment().diff(moment(lastBlockUpdate)))
        .asSeconds();

      setSinceLastBlockUpdate(duration);
    }, 500);

    return () => clearInterval(intervalId);
  }, [lastBlockUpdate]);

  const { DebugBox } = useDebugBoxContext();

  return (
    <>
      <div className="page-container">
      <div className="page-header">
        <Icon name="BasiliskLogoFull" />
        <div className="page-header__wallet-wrapper">
          <a
            className="page-header__wallet-wrapper__help"
            href="https://discord.gg/9vR4bpx5vQ"
            rel="noreferrer"
            target="_blank"
          >
            Help
            <Icon name="Help" />
          </a>
          <Wallet />
        </div>
      </div>
      <div className="">{children}</div>

      <div className="footer">
        <div className="liveliness-wrapper">
          <div
            className={classNames('liveliness', {
              green: sinceLastBlockUpdate <= 30,
              orange: sinceLastBlockUpdate > 30,
              red: sinceLastBlockUpdate >= 60,
              gray: !lastBlockData?.lastBlock?.parachainBlockNumber
            })}
          ></div>
          <span>
            Block no.:
            {lastBlockData?.lastBlock?.parachainBlockNumber ? (
              ` ${lastBlockData.lastBlock.parachainBlockNumber}`
            ) : (
              ` ${horizontalBar}`
            )}
          </span>
        </div>
        <div>
          Version:{' '}
          {process.env.REACT_APP_GITHUB_SHA?.replaceAll('::7', '') !== ''
            ? process.env.REACT_APP_GITHUB_SHA?.slice(0, 7)
            : 'unknown'}
        </div>
      </div>
    </div>
    <DebugBox/>
    </>
  );
};
