// React and related libraries
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// UI components
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface ConfirmationCheckBoxInterface {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  id?: string; // optional HTML id
  className?: string;
  isViewable?: boolean;
}

const ConfirmationCheckBox: React.FC<ConfirmationCheckBoxInterface> = ({
  form,
  name,
  label,
  id = 'confirmation-checkbox',
  className = '',
  isViewable
}) => {
  return (
    <FormField
      
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormControl>
            <div className=" flex items-start bg-white font-semibold rounded-[5px] p-[10px]">
              <Checkbox
                disabled={isViewable}
                id={id}
                checked={field.value}
                onCheckedChange={field.onChange}
                className="w-[18px] h-[18px]"
              />
              <label htmlFor={id} className="ml-2 w-full text-[15px] cursor-pointer">
                {label}
                <span className="text-red-500 pl-0">*</span>
              </label>
            </div>
          </FormControl>
          {/* <div className="h-[20px]"> */}
          <FormMessage className="text-[11px]" />
          {/* </div> */}
        </FormItem>
      )}
    />
  );
};

export default ConfirmationCheckBox;
