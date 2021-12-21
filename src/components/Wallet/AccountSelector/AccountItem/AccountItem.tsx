import { Account } from '../../../../generated/graphql';
import classNames from 'classnames';
import { FormattedBalance } from '../../../Balance/FormattedBalance/FormattedBalance';
import { UnitStyle } from '../../../Balance/metricUnit';
export interface AccountItemProps {
  account: Account;
  onClick: () => void;
  active: boolean;
}

export const AccountItem = ({ account, onClick, active }: AccountItemProps) => (
  <div
    className={
      'account-selector__account-item ' +
      classNames({
        'account-selector__account-item--active': active,
      })
    }
    onClick={onClick}
  >
    <div className="d-flex flex-align-space">
      <div className="account-selector__account-item-heading">
        {account.name}
      </div>
      <div>
        {' '}
        <FormattedBalance
          balance={account?.balances[0]}
          unitStyle={UnitStyle.SHORT}
          precision={1}
        />
      </div>
    </div>
  </div>
);
