import * as yup from 'yup';
import { calculatedResultValidationSchema } from 'validationSchema/calculated-results';

export const teamMemberValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  company_id: yup.string().nullable().required(),
  calculated_result: yup.array().of(calculatedResultValidationSchema),
});
