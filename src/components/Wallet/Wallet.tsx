import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedBalance } from '../Balance/FormattedBalance/FormattedBalance';
import { Account, Maybe } from '../../generated/graphql';
import Icon from '../Icon/Icon';
import Identicon from '@polkadot/react-identicon';
import './Wallet.scss';
import { useModalPortal } from '../Balance/AssetBalanceInput/hooks/useModalPortal';
import { useModalPortalElement } from './AccountSelector/hooks/useModalPortalElement';
import { FormattedMessage } from 'react-intl';
import getBsxBalance from '../../misc/utils/getBsxBalance';
import classNames from 'classnames';

export const trimAddress = (address: string, length: number) => {
  const end = length / 2;
  if (address) {
    return `${address.substring(0, end)}...${address.substring(
      address.length - end
    )}`;
  } else return ' ';
};

export interface WalletProps {
  modalContainerRef: MutableRefObject<HTMLDivElement | null>;
  account?: Maybe<Account>;
  extensionLoading: boolean;
  isExtensionAvailable: boolean;
  onToggleAccountSelector: () => void,
  activeAccountLoading: boolean;
  faucetMint: () => void;
  faucetMintLoading?: boolean;
}

export const Wallet = ({
  modalContainerRef,
  account,
  extensionLoading,
  isExtensionAvailable,
  onToggleAccountSelector,
  activeAccountLoading,
  faucetMint,
  faucetMintLoading,
}: WalletProps) => {
  const handleAccountSelectorClick = useMemo(() => (
    onToggleAccountSelector
  ),[onToggleAccountSelector]);

  return (
    <div className="wallet">

      {/* <div className="wallet__icons-wrapper">
        {account ? (
          <div
            className={classNames(
              'wallet__info__account wallet__account-btn faucet',
              {
                loading: faucetMintLoading,
              }
            )}
            onClick={(_) => faucetMint()}
          >
            {faucetMintLoading ? 'Loading...' : 'Get test tokens 🚰'}
          </div>
        ) : (
          <></>
        )}
      </div> */}
      <div className="wallet__info">
        {extensionLoading || activeAccountLoading ? (
          <div
            className="wallet__info__account wallet__account-btn"
            onClick={(_) => handleAccountSelectorClick()}
          >
            {' '}
            <FormattedMessage id="Wallet.Loading" defaultMessage="Loading..." />
          </div>
        ) : isExtensionAvailable && account ? (
          <>
            <div className="wallet__info__account">
              {<FormattedBalance balance={getBsxBalance(account)} />}
              <div className="wallet__address">
                {trimAddress(account.id, 10)}
              </div>
            </div>
            <Identicon value={account?.id} size={32} />
            <div
              className="wallet__account-btn"
              onClick={(_) => handleAccountSelectorClick()}
            >
              {account?.name}
            </div>
          </>
        ) : (
          <div
            className="wallet__info__account wallet__account-btn"
            onClick={(_) => handleAccountSelectorClick()}
          >
            <FormattedMessage
              id="Wallet.ConnectAccount"
              defaultMessage="Connect account"
            />
          </div>
        )}
      </div>
    </div>
  );
};
