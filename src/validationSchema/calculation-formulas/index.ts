import * as yup from 'yup';
import { calculatedResultValidationSchema } from 'validationSchema/calculated-results';

export const calculationFormulaValidationSchema = yup.object().shape({
  formula: yup.string().required(),
  company_id: yup.string().nullable().required(),
  calculated_result: yup.array().of(calculatedResultValidationSchema),
});
