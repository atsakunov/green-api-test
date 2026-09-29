import { HashRouter } from 'react-router-dom';
import { RootProvider } from './context/RootContext';
import { AppRoutes } from './routes';

const App = () => {
  return (
    <HashRouter>
      <RootProvider>
        <AppRoutes />
      </RootProvider>
    </HashRouter>
  );
}

export default App;
