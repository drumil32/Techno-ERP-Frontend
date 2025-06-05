// helpers/validation.ts or within StudentFeesForm.tsx
import { displayFeeMapper } from './mappers';
import { UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import { FeeType } from '@/types/enum'; // Adjust path if needed
import { IFeesRequestSchema } from '../studentFeesSchema';

// Helper to find original fee amount for 'other' fees
const findOriginalOtherFee = (
  type: FeeType | string | undefined,
  otherFeesData: any[] | undefined | null // Assuming structure like [{ type: FeeType, fee: number }, ...]
): number | undefined => {
  if (!otherFeesData || type === undefined) return undefined;
  const found = otherFeesData.find((f) => f.type === type);
  // Ensure the fee is a valid number before returning

  return typeof found?.amount === 'number' && !isNaN(found.amount) ? found.amount : undefined;
};

// Helper to format currency
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    // Return a default or empty string based on preference
    // Using '₹-' for undefined/NaN might be clearer than '₹0' sometimes
    return '₹-';
    // Or return '₹0' if that's preferred
    // return `₹${(0).toLocaleString('en-IN')}`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

/**
 * Performs custom validation logic for fee amounts.
 * - Final Fee <= Original Fee
 * - Fees Deposited <= Final Fee
 * @returns true if all custom validations pass, false otherwise.
 */
export const validateCustomFeeLogic = (
  values: IFeesRequestSchema,
  otherFeesDataBase: any, // Base data with original fees
  semWiseFeesDataBase: any, // Base data with original fees { fee: [num1, num2,...] }
  setError: UseFormSetError<IFeesRequestSchema>,
  clearErrors: UseFormClearErrors<IFeesRequestSchema>
): boolean => {
  let isOverallValid = true;
  // console.log('--- Starting fee validation ---');
  // console.log('Form values:', values);
  // console.log('Other fees base data:', otherFeesDataBase);
  // console.log('Semester fees base data:', semWiseFeesDataBase);

  // --- Validate Other Fees ---
  values.otherFees?.forEach((otherFee: any, index: any) => {
    if (!otherFee) return; // Skip if item is somehow null/undefined

    // Define field names for clarity
    const finalFeeField = `otherFees.${index}.finalFee` as const;
    const depositField = `otherFees.${index}.feesDepositedTOA` as const;

    // Get fee values (handle potential undefined/null)
    const originalFeeAmount = findOriginalOtherFee(
      otherFee.type === FeeType.SEM1FEE
        ? otherFee.type
        : displayFeeMapper(otherFee?.type as FeeType),
      otherFeesDataBase
    );
    const finalFee = otherFee.finalFee; // Already potentially undefined | number
    const feesDeposited = otherFee.feesDepositedTOA; // Already potentially undefined | number

    // console.log(`Validating Other Fee [${index}]:`, {
    //   type: otherFee.type,
    //   originalFeeAmount,
    //   finalFee,
    //   feesDeposited
    // });

    // Clear previous errors for these fields before re-validating
    clearErrors(finalFeeField);
    clearErrors(depositField);

    // Validation 1: Final Fee <= Original Fee
    // Just an update as Transport fee and Hostel Fees are going to be dynamic and we are sure that final and original is gonna be exact same we have to ignore that part here
    if (
      !(otherFee.type === FeeType.TRANSPORT || otherFee.type === FeeType.HOSTEL) &&
      typeof finalFee === 'number' &&
      typeof originalFeeAmount === 'number' &&
      finalFee > originalFeeAmount
    ) {
      // console.log(
      //   `Other Fee [${index}] validation failed: Final fee (${finalFee}) > Original fee (${originalFeeAmount})`
      // );
      setError(finalFeeField, {
        type: 'manual_comparison'
        // message: `Cannot exceed original fee (${formatCurrency(originalFeeAmount)})`
      });
      isOverallValid = false;
    }

    // Validation 2: Fees Deposited <= Final Fee
    if (
      typeof feesDeposited === 'number' &&
      feesDeposited > 0 // Only validate if deposit > 0
    ) {
      if (typeof finalFee !== 'number' || isNaN(finalFee)) {
        // If deposit exists but final fee is invalid/missing
        // console.log(
        //   `Other Fee [${index}] validation failed: Deposit exists (${feesDeposited}) but final fee is invalid (${finalFee})`
        // );
        setError(depositField, {
          type: 'manual_dependency'
          // message: `Final fee required`
        });
        isOverallValid = false;
      } else if (feesDeposited > finalFee) {
        // If deposit exceeds final fee
        // console.log(
        //   `Other Fee [${index}] validation failed: Deposit (${feesDeposited}) > Final fee (${finalFee})`
        // );
        setError(depositField, {
          type: 'manual_comparison'
          // message: `Cannot exceed final fee (${formatCurrency(finalFee)})`
        });
        isOverallValid = false;
      }
    }
  });

  // --- Validate Semester Fees ---
  const originalSemFees = semWiseFeesDataBase; // Assuming structure { fee: [num1, num2,...] }
  if (Array.isArray(originalSemFees)) {
    values.semWiseFees?.forEach((semFee: any, index: any) => {
      if (!semFee) return;

      const finalFeeField = `semWiseFees.${index}.finalFee` as const;
      const originalFeeAmount = originalSemFees[index];
      const finalFee = semFee.finalFee;

      // console.log(`Validating Semester Fee [${index}]:`, {
      //   originalFeeAmount,
      //   finalFee
      // });

      // Clear previous error
      clearErrors(finalFeeField);

      // Validation: Final Fee <= Original Fee
      if (
        typeof finalFee === 'number' &&
        typeof originalFeeAmount === 'number' && // Make sure original fee is also valid
        finalFee > originalFeeAmount
      ) {
        // console.log(
        //   `Semester Fee [${index}] validation failed: Final fee (${finalFee}) > Original fee (${originalFeeAmount})`
        // );
        setError(finalFeeField, {
          type: 'manual_comparison'
          // message: `Cannot exceed original fee (${formatCurrency(originalFeeAmount)})`
        });
        isOverallValid = false;
      }
    });
  }

  // console.log('--- Validation complete ---');
  // console.log('Overall validation status:', isOverallValid ? 'VALID' : 'INVALID');
  return isOverallValid;
};
