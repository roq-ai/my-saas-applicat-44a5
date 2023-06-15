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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCalculatedResultById, updateCalculatedResultById } from 'apiSdk/calculated-results';
import { Error } from 'components/error';
import { calculatedResultValidationSchema } from 'validationSchema/calculated-results';
import { CalculatedResultInterface } from 'interfaces/calculated-result';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CalculationFormulaInterface } from 'interfaces/calculation-formula';
import { TeamMemberInterface } from 'interfaces/team-member';
import { getCalculationFormulas } from 'apiSdk/calculation-formulas';
import { getTeamMembers } from 'apiSdk/team-members';

function CalculatedResultEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CalculatedResultInterface>(
    () => (id ? `/calculated-results/${id}` : null),
    () => getCalculatedResultById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CalculatedResultInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCalculatedResultById(id, values);
      mutate(updated);
      resetForm();
      router.push('/calculated-results');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CalculatedResultInterface>({
    initialValues: data,
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
            Edit Calculated Result
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'calculated_result',
  operation: AccessOperationEnum.UPDATE,
})(CalculatedResultEditPage);
