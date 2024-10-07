import { useContext } from 'react';
import { FornecedorContext } from '../context/FornecedorContext';

const useFornecedores = () => {
  const context = useContext(FornecedorContext);

  if (!context) {
    throw new Error('useFornecedores must be used within a FornecedorProvider');
  }

  return context;
};

export default useFornecedores;