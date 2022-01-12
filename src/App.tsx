import './App.scss';
import { MultiProvider } from './containers/MultiProvider';
import log from 'loglevel';
import { HashRouter } from 'react-router-dom';
import { Router } from './containers/Router';
import { PageContainer } from './containers/PageContainer';

log.setLevel('debug');

export const branch = process.env.REACT_APP_GIT_BRANCH;
export const baseName = branch?.length ? `/basilisk-ui/${branch}/app` : '/';

export const App = () => {
  return (
    <MultiProvider>
      <HashRouter>
        <PageContainer>
          <Router />
        </PageContainer>
      </HashRouter>
    </MultiProvider>
  );
};

export default App;
