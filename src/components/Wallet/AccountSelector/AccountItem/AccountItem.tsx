import { Account } from '../../../../generated/graphql';
import classNames from 'classnames';
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
        active: active,
      })
    }
    onClick={onClick}
  >
    {account.id}
  </div>
);
