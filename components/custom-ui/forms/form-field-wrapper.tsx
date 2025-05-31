import { FormLabel, FormMessage } from '@/components/ui/form';

interface FormFieldWrapperProps {
  children: React.ReactNode;
  label: string;
  required?: boolean;
  className?: string;
}

export const FormFieldWrapper = ({
  children,
  label,
  required = false,
  className = ''
}: FormFieldWrapperProps) => {
  return (
    <div className={`grid grid-rows-[auto,1fr,auto] gap-1 ${className}`}>
      <FormLabel className="font-inter font-semibold text-[14px] text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>

      <div className="min-h-[40px] flex items-center">{children}</div>

      <div className="min-h-[20px]">
        <div className="h-[20px]">
          <FormMessage className="text-[11px]" />
        </div>
      </div>
    </div>
  );
};
