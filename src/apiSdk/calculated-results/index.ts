import axios from 'axios';
import queryString from 'query-string';
import { CalculatedResultInterface, CalculatedResultGetQueryInterface } from 'interfaces/calculated-result';
import { GetQueryInterface } from '../../interfaces';

export const getCalculatedResults = async (query?: CalculatedResultGetQueryInterface) => {
  const response = await axios.get(`/api/calculated-results${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCalculatedResult = async (calculatedResult: CalculatedResultInterface) => {
  const response = await axios.post('/api/calculated-results', calculatedResult);
  return response.data;
};

export const updateCalculatedResultById = async (id: string, calculatedResult: CalculatedResultInterface) => {
  const response = await axios.put(`/api/calculated-results/${id}`, calculatedResult);
  return response.data;
};

export const getCalculatedResultById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/calculated-results/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCalculatedResultById = async (id: string) => {
  const response = await axios.delete(`/api/calculated-results/${id}`);
  return response.data;
};
