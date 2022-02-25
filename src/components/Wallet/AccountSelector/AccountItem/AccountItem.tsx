import { Account } from '../../../../generated/graphql';
import classNames from 'classnames';
import { FormattedBalance } from '../../../Balance/FormattedBalance/FormattedBalance';
import './AccountItem.scss';

import Identicon from '@polkadot/react-identicon';
import getBsxBalance from '../../../../misc/utils/getBsxBalance';
export interface AccountItemProps {
  account: Account;
  onClick: (account: Account) => void;
  active: boolean;
}

export const AccountItem = ({ account, onClick, active }: AccountItemProps) => {
  return (
    <div
      className={classNames('account-item', {
        'account-item--active': active,
      })}
      onClick={() => {
        onClick(account);
      }}
    >
      <div className="account-item__heading">
        <div className="account-item__heading__name">{account.name}</div>
        <div className="account-item__heading__balance">
          {<FormattedBalance balance={getBsxBalance(account)} />}
        </div>
      </div>
      <div className="account-item__address-info">
        <div className="account-item__address-entry">
          <Identicon
            className="account-item__identicon"
            value={account.id}
            size={40}
          />
          <div className="account-item__chain-info">
            <div className="account-item__chain-name">Basilisk</div>
            <div className="account-item__chain-address">{account.id}</div>
          </div>
        </div>
        <div className="account-item__address-entry">
          <Identicon
            className="account-item__identicon"
            value={account.id}
            size={32}
            theme="polkadot"
          />
          <div className="account-item__chain-info">
            <div className="account-item__chain-name">Kusama</div>
            <div className="account-item__chain-address">{account.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
