import './App.scss';
import { MultiProvider } from './containers/MultiProvider';
import log from 'loglevel';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './containers/Router';
import { PageContainer } from './containers/PageContainer';

log.setLevel('info');

export const App = () => {
  return (
    <MultiProvider>
      <BrowserRouter>
        <PageContainer>
          <Router />
        </PageContainer>
      </BrowserRouter>
    </MultiProvider>
  );
}

export default App;
