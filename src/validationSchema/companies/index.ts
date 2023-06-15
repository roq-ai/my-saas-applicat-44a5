import * as yup from 'yup';
import { calculationFormulaValidationSchema } from 'validationSchema/calculation-formulas';
import { teamMemberValidationSchema } from 'validationSchema/team-members';

export const companyValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  calculation_formula: yup.array().of(calculationFormulaValidationSchema),
  team_member: yup.array().of(teamMemberValidationSchema),
});
