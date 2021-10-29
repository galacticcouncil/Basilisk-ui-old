import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import { Locale } from './misc/locale';
import { useApollo } from './hooks/apollo/useApollo';
import { ApolloProvider, LazyQueryHookOptions, useReactiveVar, QueryResult, QueryTuple, useApolloClient } from '@apollo/client'
import { useGetConfigQuery } from './hooks/config/useConfigQueries';
import { GetPolkadotExtensionAccountsQueryResponse, GET_POLKADOT_EXTENSION_ACCOUNTS, LazyPolkadotJsExtensionAccountsProvider, useContextualGetActivePolkadotExtensionAccountLazyQuery, useContextualPolkadotJsExtensionAccountsLazyQuery } from './hooks/apollo/polkadotJs/extension/accounts/usePolkadotJsExtensionAccountsQueries';
import { useSetActivePolkadotExtensionAccountMutation, useUnsetActivePolkadotExtensionAccountMutation } from './hooks/apollo/polkadotJs/extension/accounts/usePolkadotJsExtensionAccountsMutations';
import { useEffect } from 'react';
import constate from 'constate';
import { useCallback } from 'react';
import { PolkadotJsExtensionAccount } from './generated/graphql';
import { usePersistActivePolkadotJsAccount } from './hooks/polkadotJs/extension/accounts/usePersistActivePolkadotJsAccount';
export interface AppProps {
  locale: Locale
}

export const Account = ({ account }: { account: PolkadotJsExtensionAccount }) => {
  const [select] = useSetActivePolkadotExtensionAccountMutation({ id: account.id })

  return <>
    <p>-----</p>
    <p>{account.alias}</p>
    <p>{account.id}</p>
    <p>{account.network}</p>
    <p>Selected: {account.isSelected ? 'true' : 'false'}</p>
    <button onClick={_ => select()}>select</button>
  </>
}

export const Test = () => {
  const [fetch, { data, refetch, loading, networkStatus }] = useContextualPolkadotJsExtensionAccountsLazyQuery();
  const [unset] = useUnsetActivePolkadotExtensionAccountMutation();
  // const [activePolkadotJsAccount] = usePersistActivePolkadotJsAccount();
  const [fetchActiveAccount, { data: activePolkadotJsAccount }] = useContextualGetActivePolkadotExtensionAccountLazyQuery()

  useEffect(() => {
    fetch();
    fetchActiveAccount();
  }, []);

  useEffect(() => console.log('test data changed'), [data?.polkadotExtensionAccounts]);

  return <>
    <h1>Accounts</h1>
    <button onClick={_ => fetch && fetch()}>fetch</button>
    <button onClick={_ => refetch && refetch()}>refetch</button>
    <button onClick={_ => unset && unset()}>unset</button>

    <p>Active: {activePolkadotJsAccount?.id}</p>

    <p>Network status: {networkStatus}</p>
    <p>Loading: {loading ? 'true' : 'false'}</p>
    {true
      ? (
        <div>
          <p>Extension available {data?.polkadotExtension?.isAvailable ? 'true' : 'false'}</p>
          {data?.polkadotExtensionAccounts?.map((account, i) => {
            return <div key={i}>
              <Account account={account}/>
            </div>
          })}

        </div>
      )
      : <></>
    }

  </>
}

export const App = ({ locale }: AppProps) => {
  const client = useApollo();
  const [content, setContent] = useState([<Test />, <Test />])

  return (
    <ApolloProvider client={client}>
      <LazyPolkadotJsExtensionAccountsProvider>
        {content.map((c, i) => <div key={i}>{c}</div>)}
        <button onClick={_ => setContent(content.concat([<Test />]))}>Add test</button>
      </LazyPolkadotJsExtensionAccountsProvider>
    </ApolloProvider>
  );
}

export default App;
