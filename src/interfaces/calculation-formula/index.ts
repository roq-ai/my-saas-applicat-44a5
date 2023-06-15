import { CalculatedResultInterface } from 'interfaces/calculated-result';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface CalculationFormulaInterface {
  id?: string;
  formula: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  calculated_result?: CalculatedResultInterface[];
  company?: CompanyInterface;
  _count?: {
    calculated_result?: number;
  };
}

export interface CalculationFormulaGetQueryInterface extends GetQueryInterface {
  id?: string;
  formula?: string;
  company_id?: string;
}
