import { Account } from '../../../../generated/graphql';
import classNames from 'classnames';
import { FormattedBalance } from '../../../Balance/FormattedBalance/FormattedBalance';
import './AccountItem.scss';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import Identicon from '@polkadot/react-identicon';
import getBsxBalance from '../../../../misc/utils/getBsxBalance';
import { trimAddress } from '../../Wallet';
import { decode } from 'querystring';
import { Maybe } from 'graphql/jsutils/Maybe';

export interface AccountItemProps {
  account: Account;
  onClick: (account: Account) => void;
  active: boolean;
}

export const genesisHashToChain = (genesisHash: string) => {
  const genesishHashPrefixes: Record<string, any> = {
    '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe': {
      name: 'Kusama',
      prefix: 2
    },
    '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3': {
      name: 'Polkadot',
      prefix: 0
    },
    '0xbaf5aabe40646d11f0ee8abbdc64f4a4b7674925cba08e4a05ff9ebed6e2126b': {
      name: 'Karura',
      prefix: 8
    },
    '0xd2a620c27ec5cbc5621ff9a522689895074f7cca0d08e7134a7804e1a3ba86fc': {
      name: 'HydraDX',
      prefix: 63
    }
  }

  return genesishHashPrefixes[genesisHash];
}

export const sourceToHuman = (source: Maybe<string>) => {
  switch (source) {
    case 'polkadot-js':
      return 'Polkadot.js'
    case 'talisman':
     return 'Talisman'
  }
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
        <div className="account-item__heading__left">
          <div className="account-item__heading__left__name">{account.name}</div>
          <div className="account-item__heading__left__source">{sourceToHuman(account.source)}</div>
        </div>
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
            <div className="account-item__chain-address">{trimAddress(account.id, 24)}</div>
          </div>
        </div>
        {account.genesisHash && genesisHashToChain(account.genesisHash)
          ? (
            <div className="account-item__address-entry">
              <Identicon
                className="account-item__identicon"
                value={account.id}
                size={32}
                theme="polkadot"
              />
              <div className="account-item__chain-info">
                <div className="account-item__chain-name">{genesisHashToChain(account.genesisHash)?.name}</div>
                <div className="account-item__chain-address">{trimAddress(
                  encodeAddress(decodeAddress(account.id), genesisHashToChain(account.genesisHash)?.prefix), 
                  24
                )}</div>
              </div>
            </div>
          )
          : <></>
        }
      </div>
    </div>
  );
};
