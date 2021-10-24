import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import { Locale } from './shared/locale';
import { useApollo } from './hooks/apollo/useApollo';
import { ApolloProvider } from '@apollo/client'
import { useGetConfigQuery } from './hooks/config/useConfigQueries';
import { useGetPolkadotExtensionAccountsQuery } from './hooks/polkadot/usePolkadotJsExtensionAccountsQueries';
export interface AppProps {
  locale: Locale
}

export const Test = () => {
  const polkadotExtensionAccountsQuery = useGetPolkadotExtensionAccountsQuery();

  const fetchMore = async () => {
    polkadotExtensionAccountsQuery.fetchMore({});
  }

  return <>
    <h1>Accounts</h1>
    <p>Extension available {polkadotExtensionAccountsQuery.data?.polkadotExtension?.isAvailable ? 'true' : 'false'}</p>
    <p>Loading: {polkadotExtensionAccountsQuery.loading ? 'true' : 'false'}</p>
    <div>
      {polkadotExtensionAccountsQuery.data?.polkadotExtensionAccounts.map(account => {
        return <p>{account.alias}</p>
      })}
      <button onClick={_ => fetchMore()}>refetch</button>
    </div>
  </>
}

export const App = ({ locale }: AppProps) => {
  const client = useApollo();
  const [content, setContent] = useState([<Test/>, <Test/>])

  return (
    <ApolloProvider client={client}>
      {content.map(c => c)}
      <button onClick={_ => setContent(content.concat([<Test/>]))}>Add test</button>
    </ApolloProvider>
  );
}

export default App;
