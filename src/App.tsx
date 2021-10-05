import React from 'react';
import logo from './logo.svg';
import './App.css';
import {IntlProvider, FormattedMessage, FormattedNumber} from 'react-intl';

export enum Locale {
  EN = 'en'
}
export interface AppProps {
  locale: Locale
}

function App({ locale }: AppProps) {
  return (
    <IntlProvider
      messages={{}}
      locale={locale}
      defaultLocale='en'
    >
      <p>
        <FormattedMessage
          id='greeting'
          description='Application wide greeting'
          defaultMessage='Today is {ts, date, ::yyyyMMdd}'
          values={{
            ts: Date.now()
          }}
        />

        <br/>

        <FormattedNumber
          value={19}
          style='currency'
          currency='EUR'
        />
      </p>
    </IntlProvider>
  );
}

export default App;
