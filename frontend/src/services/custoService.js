import api from './api';

export const getAllCustos = async () => {
  try {
    const response = await api.get('/custo/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar custos.');
  }
};

export const createCusto = async (custoData) => {
  try {
    const response = await api.post('/custo/create', custoData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar custo.');
  }
};