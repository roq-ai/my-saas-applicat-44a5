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
import { createCalculationFormula } from 'apiSdk/calculation-formulas';
import { Error } from 'components/error';
import { calculationFormulaValidationSchema } from 'validationSchema/calculation-formulas';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { CalculationFormulaInterface } from 'interfaces/calculation-formula';

function CalculationFormulaCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CalculationFormulaInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCalculationFormula(values);
      resetForm();
      router.push('/calculation-formulas');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CalculationFormulaInterface>({
    initialValues: {
      formula: '',
      company_id: (router.query.company_id as string) ?? null,
    },
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
            Create Calculation Formula
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'calculation_formula',
  operation: AccessOperationEnum.CREATE,
})(CalculationFormulaCreatePage);
