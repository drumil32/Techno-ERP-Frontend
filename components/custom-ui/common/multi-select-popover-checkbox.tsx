import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface MultiSelectPopoverCheckboxProps {
  form: any;
  name: string;
  label: string;
  options: { _id: string; name: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MultiSelectPopoverCheckbox: React.FC<MultiSelectPopoverCheckboxProps> = ({
  form,
  name,
  label,
  options,
  placeholder = "Select options",
  className = "",
  disabled = false,
}) => {
  return (
    <FormField
      key={name}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
            {label}
          </FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild disabled={disabled}>
                <Button
                  variant="outline"
                  className="text-left bg-inherit w-full max-w-full truncate font-normal text-[#666666]"
                  disabled={disabled}
                >
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    {field.value && field.value.length > 0
                      ? options
                        .filter((opt) => field?.value?.includes(opt._id))
                        .map((opt) => opt.name)
                        .join(", ")
                      : placeholder}
                  </span>
                </Button>
              </PopoverTrigger>
              {!disabled && (
                <PopoverContent className="w-[180px] p-2 rounded-sm">
                  <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
                    {options?.map((option) => (
                      <div
                        key={option._id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          id={option._id}
                          checked={field?.value?.includes(option._id)}
                          onCheckedChange={(checked) => {
                            const newValues = checked
                              ? [...(field.value || []), option._id]
                              : field.value?.filter((id: string) => id !== option._id);
                            field.onChange(newValues);
                          }}
                          className="rounded-sm"
                          disabled={disabled}
                        />
                        <label
                          htmlFor={option._id}
                          className="text-[12px] cursor-pointer"
                        >
                          {option.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              )}
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};