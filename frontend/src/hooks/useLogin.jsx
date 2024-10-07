import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';

const useLogin = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('useAuth must be used within an LoginContext');
  }

  return context;
};

export default useLogin;