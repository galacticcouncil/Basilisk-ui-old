import './App.scss';
import { MultiProvider } from './containers/MultiProvider';
import log from 'loglevel';
import { HashRouter } from 'react-router-dom';
import { Router } from './containers/Router';
import { IntlProvider } from 'react-intl';
import { PageContainer } from './containers/PageContainer';
import { Locale } from './misc/locale';
import messages from './compiled-lang/en.json';
import { DebugBoxProvider } from './pages/TradePage/hooks/useDebugBox';
import ReactTooltip from 'react-tooltip';

log.setLevel('info');

export const branch = process.env.REACT_APP_GIT_BRANCH;
export const baseName = branch?.length ? `/basilisk-ui/${branch}/app` : '/';

export const App = () => {
  return (
    <MultiProvider>
      <HashRouter>
        <DebugBoxProvider>
          <IntlProvider
            messages={messages}
            locale={Locale.EN}
            defaultLocale="en"
          >
            <PageContainer>
              <Router />
            </PageContainer>
          </IntlProvider>
        </DebugBoxProvider>
      </HashRouter>
      <ReactTooltip />
    </MultiProvider>
  );
};

export default App;
