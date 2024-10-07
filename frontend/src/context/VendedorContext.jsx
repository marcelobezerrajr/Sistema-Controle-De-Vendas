import React, { createContext, useState, useEffect } from 'react';
import { getAllVendedores, getVendedorById, createVendedor, updateVendedor, deleteVendedor } from '../services/vendedorService';

export const VendedorContext = createContext();

export const VendedorProvider = ({ children }) => {
  const [vendedor, setVendedor] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendedores() {
      try {
        const data = await getAllVendedores();
        setVendedor(data);
      } catch (error) {
        console.error("Erro ao carregar Vendedores:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVendedores();
  }, []);

  const addVendedor = async (vendedor) => {
    try {
      const newVendedor = await createVendedor(vendedor);
      setVendedor((prev) => [...prev, newVendedor]);
    } catch (error) {
      console.error("Erro ao adicionar vendedor:", error);
    }
  };
  const updateVendedorById = async (id, vendedorData) => {
    try {
      const updatedVendedor = await updateVendedor(id, vendedorData);
      setVendedor((prev) =>
        prev.map((vendedor) => (vendedor.id === id ? updatedVendedor : vendedor))
      );
    } catch (error) {
      console.error("Erro ao atualizar vendedor:", error);
    }
  };

  const getVendedor = async (id) => {
    try {
      const vendedor = await getVendedorById(id);
      return vendedor;
    } catch (error) {
      console.error("Erro ao obter vendedor:", error);
    }
  };

  const removeVendedor = async (id) => {
    try {
      await deleteVendedor(id);
      setVendedor((prev) => prev.filter((vendedor) => vendedor.id !== id));
    } catch (error) {
      console.error("Erro ao deletar vendedor:", error);
    }
  };

  return (
    <VendedorContext.Provider value={{ vendedor, loading, addVendedor, updateVendedorById, getVendedor, removeVendedor }}>
      {children}
    </VendedorContext.Provider>
  );
};