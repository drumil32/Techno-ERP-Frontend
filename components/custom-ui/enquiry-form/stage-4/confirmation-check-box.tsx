// React and related libraries
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// UI components
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ConfirmationCheckBoxInterface {
  form: UseFormReturn<any>;
}

const ConfirmationCheckBox: React.FC<ConfirmationCheckBoxInterface> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="confirmationCheck"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start bg-white rounded-md p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal">
              All the Fees Deposited is Non Refundable/Non Transferable. Examination fees will be
              charged extra based on LU/AKTU norms.
            </FormLabel>
            <FormMessage className="text-xs" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default ConfirmationCheckBox;
