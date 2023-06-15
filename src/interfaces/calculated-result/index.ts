import { CalculationFormulaInterface } from 'interfaces/calculation-formula';
import { TeamMemberInterface } from 'interfaces/team-member';
import { GetQueryInterface } from 'interfaces';

export interface CalculatedResultInterface {
  id?: string;
  result: string;
  calculation_formula_id: string;
  team_member_id: string;
  created_at?: any;
  updated_at?: any;

  calculation_formula?: CalculationFormulaInterface;
  team_member?: TeamMemberInterface;
  _count?: {};
}

export interface CalculatedResultGetQueryInterface extends GetQueryInterface {
  id?: string;
  result?: string;
  calculation_formula_id?: string;
  team_member_id?: string;
}
