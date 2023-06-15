import { CalculatedResultInterface } from 'interfaces/calculated-result';
import { UserInterface } from 'interfaces/user';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface TeamMemberInterface {
  id?: string;
  user_id: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  calculated_result?: CalculatedResultInterface[];
  user?: UserInterface;
  company?: CompanyInterface;
  _count?: {
    calculated_result?: number;
  };
}

export interface TeamMemberGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  company_id?: string;
}
