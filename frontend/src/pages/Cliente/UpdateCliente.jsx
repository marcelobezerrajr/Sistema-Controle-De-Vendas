import React, { useState, useEffect, useRef } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import InputMask from 'react-input-mask';
import useCliente from '../../hooks/useCliente';
import MainLayout from '../../layouts/MainLayout';
import { useParams } from 'react-router-dom';
import "../../styles/Cliente/UpdateCliente.css";

const validateName = (value) => value.trim() === '' ? 'Nome é obrigatório.' : null;
const validateCpfCnpj = (value) => {
  const plainValue = value.replace(/\D/g, '');
  const pattern = /^(\d{11}|\d{14})$/;
  return !pattern.test(plainValue) ? 'CPF/CNPJ inválido. Use 11 ou 14 dígitos.' : null;
};

const UpdateCliente = () => {
  const { id_cliente } = useParams();
  const { getCliente, updateClienteData } = useCliente();
  const [clienteData, setClienteData] = useState({ nome_cliente: '', cpf_cnpj: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const cpf_cnpjRef = useRef(null);

  useEffect(() => {
    if (!id_cliente) {
      setErrors({ form: 'ID de cliente não definido.' });
      return;
    }

    const fetchCliente = async () => {
      setLoading(true);
      try {
        const data = await getCliente(id_cliente);
        setClienteData(data);
      } catch (error) {
        setErrors({ form: 'Erro ao carregar os dados do cliente.' });
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id_cliente, getCliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteData({
      ...clienteData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const getCpfCnpjMask = () => {
    const digitsOnly = clienteData.cpf_cnpj.replace(/\D/g, '');
    return digitsOnly.length > 11 ? '99.999.999/9999-99' : '999.999.999-99';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(null);

    const nameError = validateName(clienteData.nome_cliente);
    const cpf_cnpjError = validateCpfCnpj(clienteData.cpf_cnpj);
    if (nameError || cpf_cnpjError) {
      setErrors({
        nome_cliente: nameError,
        cpf_cnpj: cpf_cnpjError,
      });
      setLoading(false);
      return;
    }

    try {
      await updateClienteData(id_cliente, clienteData);
      setSuccess('Cliente atualizado com sucesso!');
    } catch (error) {
      setErrors({ form: 'Erro ao atualizar o cliente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="update-cliente-container">
        <Card className="update-cliente-card">
          <Card.Header className="update-cliente-card-header">
            <h4>Atualizar Cliente</h4>
          </Card.Header>
          <Card.Body className="update-cliente-card-body">
            {loading && (
              <div className="update-cliente-spinner">
                <Spinner animation="border" />
              </div>
            )}
            {errors.form && (
              <Alert variant="danger" className="alert-error">
                {errors.form}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="alert-success">
                {success}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="nome-form-label" controlId="nome_cliente">
                    <Form.Label className="cliente-form-label">Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_cliente"
                      value={clienteData.nome_cliente}
                      onChange={handleChange}
                      isInvalid={!!errors.nome_cliente}
                      placeholder="Digite o Nome"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome_cliente}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="cpf-cnpj-form-label" controlId="cpf_cnpj">
                    <Form.Label className="cliente-form-label">CPF/CNPJ</Form.Label>
                    <InputMask
                      mask={getCpfCnpjMask()}
                      value={clienteData.cpf_cnpj}
                      onChange={handleChange}
                      name="cpf_cnpj"
                      className={`form-control ${errors.cpf_cnpj ? 'is-invalid' : ''}`}
                      placeholder="Digite o CPF ou CNPJ"
                      ref={cpf_cnpjRef}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cpf_cnpj}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : <FaSave />} Salvar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UpdateCliente;