import { useContext } from 'react';
import { VendaContext } from '../context/VendaContext';

const useVendas = () => {
  const context = useContext(VendaContext);

  if (!context) {
    throw new Error('useVendas must be used within a VendaProvider');
  }

  return context;
};

export default useVendas;
