// React and related libraries
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// UI components
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface ConfirmationCheckBoxInterface {
    form: UseFormReturn<any>;
}

const ConfirmationCheckBox: React.FC<ConfirmationCheckBoxInterface> = ({form}) => {
  return (
    <FormField
          control={form.control}
          name="confirmation"
          render={({ field }) => (
            <FormItem className="cols-span-3">
              <FormControl>
                <div className="flex items-center bg-white rounded-[5px] p-[10px]">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="w-[16px] h-[16px]" />
                  <label className={`ml-2 w-full text-[12px]`}>
                    All the above information has been verified by the applicant and thoroughly
                    check by the Admissions team.
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  )
}

export default ConfirmationCheckBox;