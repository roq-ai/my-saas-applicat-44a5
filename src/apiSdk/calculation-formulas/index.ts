import axios from 'axios';
import queryString from 'query-string';
import { CalculationFormulaInterface, CalculationFormulaGetQueryInterface } from 'interfaces/calculation-formula';
import { GetQueryInterface } from '../../interfaces';

export const getCalculationFormulas = async (query?: CalculationFormulaGetQueryInterface) => {
  const response = await axios.get(`/api/calculation-formulas${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCalculationFormula = async (calculationFormula: CalculationFormulaInterface) => {
  const response = await axios.post('/api/calculation-formulas', calculationFormula);
  return response.data;
};

export const updateCalculationFormulaById = async (id: string, calculationFormula: CalculationFormulaInterface) => {
  const response = await axios.put(`/api/calculation-formulas/${id}`, calculationFormula);
  return response.data;
};

export const getCalculationFormulaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/calculation-formulas/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCalculationFormulaById = async (id: string) => {
  const response = await axios.delete(`/api/calculation-formulas/${id}`);
  return response.data;
};
