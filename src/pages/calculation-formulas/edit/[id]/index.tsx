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
import { getCalculationFormulaById, updateCalculationFormulaById } from 'apiSdk/calculation-formulas';
import { Error } from 'components/error';
import { calculationFormulaValidationSchema } from 'validationSchema/calculation-formulas';
import { CalculationFormulaInterface } from 'interfaces/calculation-formula';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function CalculationFormulaEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CalculationFormulaInterface>(
    () => (id ? `/calculation-formulas/${id}` : null),
    () => getCalculationFormulaById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CalculationFormulaInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCalculationFormulaById(id, values);
      mutate(updated);
      resetForm();
      router.push('/calculation-formulas');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CalculationFormulaInterface>({
    initialValues: data,
    validationSchema: calculationFormulaValidationSchema,
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
            Edit Calculation Formula
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
            <FormControl id="formula" mb="4" isInvalid={!!formik.errors?.formula}>
              <FormLabel>Formula</FormLabel>
              <Input type="text" name="formula" value={formik.values?.formula} onChange={formik.handleChange} />
              {formik.errors.formula && <FormErrorMessage>{formik.errors?.formula}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CompanyInterface>
              formik={formik}
              name={'company_id'}
              label={'Select Company'}
              placeholder={'Select Company'}
              fetcher={getCompanies}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
  entity: 'calculation_formula',
  operation: AccessOperationEnum.UPDATE,
})(CalculationFormulaEditPage);
