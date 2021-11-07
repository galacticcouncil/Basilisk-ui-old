import './App.scss';
import { MultiProvider } from './containers/MultiProvider';
import { Account, LastBlock, Maybe } from './generated/graphql';
import { useGetAccountsQuery } from './hooks/accounts/useGetAccountsQuery';
import { useGetActiveAccountQuery } from './hooks/accounts/useGetActiveAccountQuery';
import { useSetActiveAccountMutation } from './hooks/accounts/useSetActiveAccountMutation';
import { usePolkadotJsContext } from './hooks/polkadotJs/usePolkadotJs';
import { useLastBlockQuery } from './hooks/lastBlock/useLastBlockQuery';
import { useClaimVestedAmountMutation } from './hooks/vesting/useClaimVestedAmountMutation';
import { useApolloNetworkStatus } from './hooks/apollo/useApollo';
import log from 'loglevel';

log.setLevel('info');

export const AccountDisplay = ({ account, lastBlock }: { account?: Maybe<Account> | undefined, lastBlock: Maybe<LastBlock> | undefined}) => {
  const [setActiveAccount] = useSetActiveAccountMutation({ id: account?.id })

  return <div>
    <span>{account?.__typename}</span>
    <p>Last block: {lastBlock?.number}</p>
    <p>{account?.id}</p>
    <p>{account?.name}</p>
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
  const [claimVestedAmount, { loading: claimLoading, error: claimError }] = useClaimVestedAmountMutation({
    address: data?.account?.id
  });

  console.log('active account error', claimError)

  return <>
    <h4>Active</h4>
    <p>Loading: {loading ? 'true' : 'false'}</p>
    <p>Claim loading: {claimLoading ? 'true' : 'false'}</p>
    <p>Network status: {networkStatus}</p>
    <button onClick={_ => refetch && refetch()}>refetch</button>
    <button onClick={_ => claimVestedAmount()}>claim</button>
    <AccountDisplay account={data?.account} lastBlock={data?.lastBlock} />
  </>
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

export const Page = () => {
  const { loading } = usePolkadotJsContext();
  const e = useApolloNetworkStatus();
  console.log('e', e);

  return <>
    {loading
      ? (
        <p>Loading...</p>
      )
      : (<>
        <LastBlockDisplay />
        <ActiveAccount />
        {/* <Accounts /> */}
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
