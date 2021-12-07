import './App.scss';
import { MultiProvider } from './containers/MultiProvider';
import log from 'loglevel';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './containers/Router';
import { PageContainer } from './containers/PageContainer';

log.setLevel('debug');

export const branch = process.env.REACT_APP_GIT_BRANCH;
export const baseName = branch?.length ? `basilisk-ui/${branch}/app` : undefined;

export const App = () => {
  return (
    <MultiProvider>
      <BrowserRouter basename={baseName}>
        <PageContainer>
          <Router />
        </PageContainer>
      </BrowserRouter>
    </MultiProvider>
  );
}

export default App;
