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
import registry, { RegistryEntry } from '@substrate/ss58-registry';
import { knownGenesis } from '@polkadot/networks/genesis';

export interface AccountItemProps {
  account: Account;
  onClick: (account: Account) => void;
  active: boolean;
}

export const genesisHashToChain = (
  genesisHash: Maybe<string>
): RegistryEntry => {
  // This is how Polkadot.js treats addresses by default if you don't chose chain
  let chainInfo: RegistryEntry = {
    prefix: 42,
    network: 'substrate',
    displayName: 'Substrate account',
    symbols: [],
    decimals: [],
    standardAccount: '*25519',
    website: 'https://substrate.io/',
  };

  // If we don't have genesis hash use default
  if (!genesisHash) return chainInfo;

  for (let chain in knownGenesis) {
    if (knownGenesis[chain].includes(genesisHash)) {
      const chainIndex = registry.findIndex((entry) => entry.network === chain);
      if (chainIndex >= 0) {
        chainInfo = registry[chainIndex];
        break;
      }
    }
  }

  return chainInfo;
};

export const sourceToHuman = (source: Maybe<string>) => {
  switch (source) {
    case 'polkadot-js':
      return 'Polkadot.js';
    case 'talisman':
      return 'Talisman';
  }
};

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
      <div className="account-item__wrapper">
        <div className="account-item__heading">
          <div className="account-item__heading__left">
            <div className="account-item__heading__left__name">
              {account.name}
            </div>
            <div className="account-item__heading__left__source">
              {sourceToHuman(account.source)}
            </div>
          </div>
          <div className="account-item__heading__balance">
            {<FormattedBalance balance={getBsxBalance(account)} />}
          </div>
        </div>
        <div className="account-item__address-info">
          <div
            className="account-item__address-entry"
            onClick={(e) => e.stopPropagation()}
          >
            <Identicon
              className="account-item__identicon"
              value={account.id}
              size={32}
            />
            <div className="account-item__chain-info">
              <div className="account-item__chain-name">Basilisk</div>
              <div className="account-item__chain-address">
                {trimAddress(account.id, 24)}
              </div>
            </div>
          </div>
          {genesisHashToChain(account.genesisHash).network !== 'basilisk' ? (
            <div
              className="account-item__address-entry"
              onClick={(e) => e.stopPropagation()}
            >
              <Identicon
                className="account-item__identicon"
                value={encodeAddress(
                  decodeAddress(account.id),
                  genesisHashToChain(account.genesisHash)?.prefix
                )}
                size={32}
                theme="polkadot"
              />
              <div className="account-item__chain-info">
                <div className="account-item__chain-name">
                  {genesisHashToChain(account.genesisHash).displayName}
                </div>
                <div className="account-item__chain-address">
                  {trimAddress(
                    encodeAddress(
                      decodeAddress(account.id),
                      genesisHashToChain(account.genesisHash)?.prefix
                    ),
                    24
                  )}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
