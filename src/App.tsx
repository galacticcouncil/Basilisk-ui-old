import './App.scss';
import { MultiProvider } from './containers/MultiProvider';
import { Account, LastBlock, Maybe } from './generated/graphql';
import { useGetAccountsQuery } from './hooks/accounts/useGetAccountsQuery';
import { useGetActiveAccountQuery } from './hooks/accounts/useGetActiveAccountQuery';
import { useSetActiveAccountMutation } from './hooks/accounts/useSetActiveAccountMutation';
import { usePolkadotJsContext } from './hooks/polkadotJs/usePolkadotJs';
import { useLastBlockQuery } from './hooks/lastBlock/useLastBlockQuery';
import { useClaimVestedAmountMutation } from './hooks/vesting/useClaimVestedAmountMutation';
import log from 'loglevel';
import { useTransferBalanceMutation } from './hooks/balances/useTransferBalanceMutation';
import { useEstimateTransferBalance } from './hooks/balances/useBalanceMutationResolvers';
import { useCallback, useEffect, useMemo } from 'react';
import { useContextualGetExtensionLazyQuery } from './hooks/polkadotJs/useGetExtensionQuery';
import { useGetConfigQuery } from './hooks/config/useGetConfigQuery';
import { usePrevious } from 'react-use';
import { isEqual } from 'lodash';
import { useSetConfigMutation } from './hooks/config/useSetConfigMutation';

log.setLevel('info');

export const AccountDisplay = ({ account, lastBlock }: { account?: Maybe<Account> | undefined, lastBlock: Maybe<LastBlock> | undefined}) => {
  const [setActiveAccount] = useSetActiveAccountMutation({ id: account?.id })
  const [claimVestedAmount, { loading: claimLoading, error: claimError }] = useClaimVestedAmountMutation();
  const transferBalanceVariables = {
    from: account?.id,
    to: 'bXi1Xh8UZvKUFCezgut35kv7U7ss3mK2BnEj3rdEen1tkaSoy',
    currencyId: '0',
    amount: '123456'
  };
  const [transferBalance, { loading: transferLoading, error: errorLoading }] = useTransferBalanceMutation(transferBalanceVariables);
  const { paymentInfo, estimatePaymentInfo } = useEstimateTransferBalance(transferBalanceVariables);

  useEffect(() => {
    estimatePaymentInfo();
  }, [lastBlock?.number])

  return <div>
    <span>{account?.__typename}</span>
    <p>Last block: {lastBlock?.number}</p>
    <p>{account?.id}</p>
    <p>{account?.name}</p>
    <p>Claim loading: {claimLoading ? 'true' : 'false'}</p>
    <button onClick={_ => claimVestedAmount()}>claim</button>
    <button onClick={_ => transferBalance()}>transfer</button>
    <p>Transfer estimate: {paymentInfo?.partialFee.toHuman()}</p>
    <p>Active: {account?.isActive ? 'true' : 'false'}</p>


    {account?.vestingSchedule
      ? 
        <>
          <p>Vesting schedule start: {account.vestingSchedule.start}</p>
        </>
      : <></>
    }

    <div>
      <p>Balances:</p>
      {account?.balances.map((balance, i) => (
        <p key={i}>{balance.assetId}: {balance.balance}</p>
      ))}
    </div>
    <button onClick={_ => setActiveAccount()}>Set active</button>
    <p>-------</p>
  </div>
}

export const ActiveAccount = () => {
  const { data, loading, refetch, networkStatus, error } = useGetActiveAccountQuery();

  return <div className="active-account">
    <h4 className="active-account__heading">Active</h4>
    <p>Loading: {loading ? 'true' : 'false'}</p>
    <p>Network status: {networkStatus}</p>
    <button onClick={_ => refetch && refetch()}>refetch</button>
    <AccountDisplay account={data?.account} lastBlock={data?.lastBlock} />
  </div>
}

export const Accounts = () => {
  const { data, loading, refetch, networkStatus } = useGetAccountsQuery();
  return <>
    <h4>Accounts</h4>
    <p>Loading: {loading ? 'true' : 'false'}</p>
    <p>Network status: {networkStatus}</p>
    <button onClick={_ => refetch && refetch()}>refetch</button>
    {/* <p>Error: {error}</p> */}
    {data?.accounts?.map((account, i) => (
      <div key={i}>
        <AccountDisplay account={account} lastBlock={data.lastBlock} />
      </div>
    ))}
  </>
}

export const LastBlockDisplay = () => {
  const { data, loading } = useLastBlockQuery();

  return <div>
    <h4>Last block</h4>
    <p>Block: {data?.lastBlock?.number}</p>
    <p>Loading: {loading ? 'true' : 'false'}</p>
  </div>
}

export const ExtensionConnector = () => {
  const [getExtension, { data }] = useContextualGetExtensionLazyQuery();
  return <button onClick={_ => getExtension()}>Connect extension</button>
}

export const ConfigDisplay = () => {
  const { data, error, refetch } = useGetConfigQuery();
  const [setConfigMutation] = useSetConfigMutation();
  const feePaymentAsset = data?.config?.feePaymentAsset === '0' ? '1' : '0'

  const setConfig = useCallback(() => data?.config ? setConfigMutation({
    variables: {
      config: {
        ...data.config,
        feePaymentAsset
      }
    }
  }): null, [data]);
  
  if (error) console.error(error);

  return <div>
    <p>App name: {data?.config?.appName}</p>
    <p>Fee payment asset: {data?.config?.feePaymentAsset}</p>
    <button onClick={_ => setConfig()}>set config</button>
  </div>
}

export const Page = () => {
  const { loading } = usePolkadotJsContext();

  return <>
    {loading
      ? (
        <p>Loading...</p>
      )
      : (<>
        {/* <ExtensionConnector /> */}
        <ConfigDisplay />
        {/* <LastBlockDisplay /> */}
        <ActiveAccount />
        <Accounts />
      </>)
    }
  </>
}

export const App = () => {
  return (
    <MultiProvider>
      <Page />
    </MultiProvider>
  );
}

export default App;
