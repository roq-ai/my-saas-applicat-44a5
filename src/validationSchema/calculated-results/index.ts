import * as yup from 'yup';

export const calculatedResultValidationSchema = yup.object().shape({
  result: yup.string().required(),
  calculation_formula_id: yup.string().nullable().required(),
  team_member_id: yup.string().nullable().required(),
});
