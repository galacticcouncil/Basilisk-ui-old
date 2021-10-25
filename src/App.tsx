import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import { Locale } from './misc/locale';
import { useApollo } from './hooks/apollo/useApollo';
import { ApolloProvider, LazyQueryHookOptions, useReactiveVar, QueryResult, QueryTuple, useApolloClient } from '@apollo/client'
import { useGetConfigQuery } from './hooks/config/useConfigQueries';
import { GetPolkadotExtensionAccountsQueryResponse, GET_POLKADOT_EXTENSION_ACCOUNTS, useEvictPolkadotExtensionAccount, useGetPolkadotExtensionAccountsLazyQuery, useGetPolkadotExtensionAccountsQuery } from './hooks/polkadot/usePolkadotJsExtensionAccountsQueries';
import { useEffect } from 'react';
import constate from 'constate';
import { useCallback } from 'react';
export interface AppProps {
  locale: Locale
}

export const contextualQuery = <TData, TArgs>(queryHook: () => QueryResult<TData, TArgs>) => constate(queryHook);
export const contextualLazyQuery = <TData, TArgs>(queryHook: () => QueryTuple<TData, TArgs>) => constate(queryHook);


const [AccountsProvider, useContextualAccountsQuery] = contextualQuery(() => {
  return useGetPolkadotExtensionAccountsQuery({
    // fetchPolicy: 'no-cache',
    // TODO: shall we make this a default for all our queries for consistency?
    notifyOnNetworkStatusChange: true,
  });
})

// this acts as 'a service' sharing the query between components that want to use it
// this is important in order for the components to share the loading status, not only the data from the apollo cache
const [LazyAccountsProvider, useContextualAccountsLazyQuery] = contextualLazyQuery(() => {
  return useGetPolkadotExtensionAccountsLazyQuery({
    // fetchPolicy: 'no-cache',
    // TODO: shall we make this a default for all our queries for consistency?
    notifyOnNetworkStatusChange: true,
  });
})

export const Test = () => {
  const [fetch, { data, refetch, loading, networkStatus}] = useContextualAccountsLazyQuery();
  const evict = useEvictPolkadotExtensionAccount();

  useEffect(() => {
    fetch();
  }, []);

  return <>
    <h1>Accounts</h1>
    <button onClick={_ => fetch && fetch()}>fetch</button>
    <button onClick={_ => refetch && refetch()}>refetch</button>
    
    <p>Network status: {networkStatus}</p>
    <p>Loading: {loading ? 'true' : 'false'}</p>
    {true
      ? (
        <div>
          <p>Extension available {data?.polkadotExtension?.isAvailable ? 'true' : 'false'}</p>
          {data?.polkadotExtensionAccounts?.map((account, i) => {
            return <>
              <p key={i}>{account.alias}</p>
              <button onClick={_ => evict(account.id)}>evict</button>
            </>
          })}
          
        </div>
      )
      : <></>
    }
     
  </>
}

export const App = ({ locale }: AppProps) => {
  const client = useApollo();
  const [content, setContent] = useState([<Test/>, <Test/>])

  return (
    <ApolloProvider client={client}>
      <LazyAccountsProvider>
        {content.map((c,i) => <div key={i}>{c}</div>)}
        <button onClick={_ => setContent(content.concat([<Test />]))}>Add test</button>
      </LazyAccountsProvider>
    </ApolloProvider>
  );
}

export default App;
