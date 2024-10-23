import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import SearchComponent from '../../components/SearchComponent';
import useVendedores from '../../hooks/useVendedor'
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const VendedorPage = () => {
  const { vendedor, loading, removeVendedor } = useVendedores();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [filteredVendedores, setFilteredVendedores] = useState([]);

  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  useEffect(() => {
    setFilteredVendedores(vendedor);
  }, [vendedor]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredVendedores(vendedor);
    } else {
      const filtered = vendedor.filter(vendedores =>
        vendedores.nome_vendedor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVendedores(filtered);
    }
  };

  const handleAddVendedor = async () => {
    navigate(`/vendedor/create`);
  };

  const handleEditVendedor = async (id_vendedor) => {
    navigate(`/vendedor/update/${id_vendedor}`);

  };

  const handleViewVendedor = async (id_vendedor) => {
    navigate(`/vendedor/view/${id_vendedor}`);
  };

  const handleDeleteVendedor = async (id_vendedor) => {
    await removeVendedor(id_vendedor);
    setAlertMessage("Vendedor deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_vendedor','nome_vendedor', 'tipo', 'percentual_comissao'];

  const actions = {
    view: handleViewVendedor,
    update: handleEditVendedor,
    delete: handleDeleteVendedor
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Vendedores</h2>

          <div className="actions-section d-flex align-items-center">
            <SearchComponent placeholder="Buscar vendedores..." onSearch={handleSearch} />

            {(userPermission === 'Admin' || userPermission === 'User') && (
              <button variant="primary" className="custom-button" onClick={handleAddVendedor}>
                Adicionar Vendedor
              </button>
            )}

          </div>
        </div>

        {alertMessage && (
          <Alert className="alert-success" variant={alertVariant} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : filteredVendedores.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum vendedor encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Vendedor</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Percentual de Comissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendedores.map((vendedor) => (
                <TableRow
                 key={vendedor.id_vendedor}
                 rowData={vendedor}
                 columns={columns}
                 actions={actions}
                 idField="id_vendedor"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default VendedorPage;
