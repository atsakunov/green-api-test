import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type RootContextValue = {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  login: (idInstance: string, apiTokenInstance: string) => void;
  logout: () => void;
  setChatId: (chatId: string) => void;
  isAuthorized: boolean;
};

const RootContext = createContext<RootContextValue | null>(null);

type RootProviderProps = {
  children: ReactNode;
};

export const RootProvider = ({ children }: RootProviderProps) => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [chatId, setChatIdState] = useState('');

  const login = useCallback((nextIdInstance: string, nextApiTokenInstance: string) => {
    setIdInstance(nextIdInstance.trim());
    setApiTokenInstance(nextApiTokenInstance.trim());
  }, []);

  const logout = useCallback(() => {
    setIdInstance('');
    setApiTokenInstance('');
    setChatIdState('');
  }, []);

  const setChatId = useCallback((nextChatId: string) => {
    setChatIdState(nextChatId.trim());
  }, []);

  const isAuthorized = idInstance.trim().length > 0 && apiTokenInstance.trim().length > 0;

  const value = useMemo<RootContextValue>(
    () => ({
      idInstance,
      apiTokenInstance,
      chatId,
      login,
      logout,
      setChatId,
      isAuthorized,
    }),
    [idInstance, apiTokenInstance, chatId, login, logout, setChatId, isAuthorized]
  );

  return (
    <RootContext.Provider value={value}>{children}</RootContext.Provider>
  );
}

export const useRootContext = () => {
  const context = useContext(RootContext);

  if (!context) {
    throw new Error('useRootContext must be used within RootProvider');
  }

  return context;
}
