import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCalculatedResult } from 'apiSdk/calculated-results';
import { Error } from 'components/error';
import { calculatedResultValidationSchema } from 'validationSchema/calculated-results';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CalculationFormulaInterface } from 'interfaces/calculation-formula';
import { TeamMemberInterface } from 'interfaces/team-member';
import { getCalculationFormulas } from 'apiSdk/calculation-formulas';
import { getTeamMembers } from 'apiSdk/team-members';
import { CalculatedResultInterface } from 'interfaces/calculated-result';

function CalculatedResultCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CalculatedResultInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCalculatedResult(values);
      resetForm();
      router.push('/calculated-results');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CalculatedResultInterface>({
    initialValues: {
      result: '',
      calculation_formula_id: (router.query.calculation_formula_id as string) ?? null,
      team_member_id: (router.query.team_member_id as string) ?? null,
    },
    validationSchema: calculatedResultValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Calculated Result
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="result" mb="4" isInvalid={!!formik.errors?.result}>
            <FormLabel>Result</FormLabel>
            <Input type="text" name="result" value={formik.values?.result} onChange={formik.handleChange} />
            {formik.errors.result && <FormErrorMessage>{formik.errors?.result}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CalculationFormulaInterface>
            formik={formik}
            name={'calculation_formula_id'}
            label={'Select Calculation Formula'}
            placeholder={'Select Calculation Formula'}
            fetcher={getCalculationFormulas}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.formula}
              </option>
            )}
          />
          <AsyncSelect<TeamMemberInterface>
            formik={formik}
            name={'team_member_id'}
            label={'Select Team Member'}
            placeholder={'Select Team Member'}
            fetcher={getTeamMembers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'calculated_result',
  operation: AccessOperationEnum.CREATE,
})(CalculatedResultCreatePage);
