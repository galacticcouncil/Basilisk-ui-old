import { MutableRefObject } from 'react';
import { FormattedBalance } from '../Balance/FormattedBalance/FormattedBalance';
import { Account } from '../../generated/graphql';
import { UnitStyle } from '../Balance/metricUnit';
import { Icon, IconType } from '../Icon/Icon';
import Identicon from '@polkadot/react-identicon';
import './Wallet.scss';

const horizontalBar = '―';

export interface WalletProps {
  modalContainerRef: MutableRefObject<HTMLDivElement | null>;
  account: Account;
}

export const Wallet = ({ modalContainerRef, account }: WalletProps) => {
  return (
    <div className="wallet d-flex justify-content-between">
      <div className="wallet__icons-wrapper">
        <span className="wallet__icon">
          <Icon type={IconType.HELP} />
        </span>
        <span className="wallet__icon">
          <Icon type={IconType.NOTIFICATION_INACTIVE} />
        </span>
      </div>
      <div className="d-flex wallet__info-wrapper">
        <div className="d-flex flex-column align-items-end">
          <FormattedBalance
            balance={account.balances[0]}
            unitStyle={UnitStyle.SHORT}
            precision={1}
          />
          <div className="wallet__fiat-balance">~$ {horizontalBar}</div>
        </div>
        <div>
          <Identicon value={account.id} size={32} />
        </div>
        <div className="wallet__account-name">{account.name}</div>
        <div>
          <Icon type={IconType.DROPDOWN_ARROW} />
        </div>
      </div>
    </div>
  );
};
