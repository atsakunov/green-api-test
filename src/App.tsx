import { BrowserRouter } from 'react-router-dom';
import { RootProvider } from './context/RootContext';
import { AppRoutes } from './routes';

const App = () => {
  return (
    <BrowserRouter>
      <RootProvider>
        <AppRoutes />
      </RootProvider>
    </BrowserRouter>
  );
}

export default App;
