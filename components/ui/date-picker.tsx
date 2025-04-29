import React from 'react';
import { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { format, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Matcher } from 'react-day-picker';

type ShadcnCalendarProps = React.ComponentProps<typeof Calendar>;

interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  dateFormat?: string;
  labelClassName?: string;
  buttonClassName?: string;
  formItemClassName?: string;
  disabled?: any;
  timelineDisabled?: Matcher | Matcher[];
  calendarProps?: Omit<
    ShadcnCalendarProps,
    | 'mode'
    | 'selected'
    | 'onSelect'
    | 'initialFocus'
    | 'captionLayout'
    | 'fromYear'
    | 'toYear'
    | 'defaultMonth'
  >;
  showYearMonthDropdowns?: boolean;
  fromYear?: number;
  toYear?: number;
  isRequired?: boolean;
  defaultMonth?: Date;
  defaultSelectedDate?: Date;
}

const parseDateString = (
  dateString: string | undefined | null,
  formatString: string
): Date | undefined => {
  if (!dateString) return undefined;
  try {
    const parsed = parse(dateString, formatString, new Date());
    const reformatCheck = format(parsed, formatString);
    if (isValid(parsed) && reformatCheck === dateString) {
      return parsed;
    }
  } catch (e) {}
  return undefined;
};

export function DatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  placeholder = 'Pick a date',
  dateFormat = 'dd/MM/yyyy',
  labelClassName,
  buttonClassName,
  formItemClassName,
  disabled,
  calendarProps,
  showYearMonthDropdowns = true,
  fromYear = new Date().getFullYear() - 100,
  toYear = new Date().getFullYear() + 10,
  isRequired = false,
  timelineDisabled,
  defaultMonth = new Date(),
  defaultSelectedDate
}: DatePickerProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={
        defaultSelectedDate
          ? (format(defaultSelectedDate, dateFormat) as PathValue<TFieldValues, TName>)
          : undefined
      }
      render={({ field, fieldState: { error } }) => {
        const selectedDate = parseDateString(field.value, dateFormat);

        const handleDateSelect = (date: Date | undefined) => {
          if (date) {
            const formattedDate = format(date, dateFormat);
            field.onChange(formattedDate);
          } else {
            field.onChange('');
          }
        };

        return (
          <FormItem className={cn('flex flex-col', formItemClassName)}>
            <FormLabel className={cn(labelClassName, isRequired && 'gap-x-1')}>
              {label}
              {isRequired && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full mt-0 pl-3 text-left font-normal h-9',
                    !field.value && 'text-muted-foreground',
                    buttonClassName
                  )}
                  disabled={disabled}
                >
                  {field.value && selectedDate ? (
                    format(selectedDate, dateFormat)
                  ) : field.value ? (
                    field.value
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={timelineDisabled}
                  initialFocus
                  defaultMonth={selectedDate || defaultMonth} // Show selected date's month if available, otherwise fall back to defaultMonth
                  captionLayout={showYearMonthDropdowns ? 'dropdown-buttons' : 'buttons'}
                  fromYear={showYearMonthDropdowns ? fromYear : undefined}
                  toYear={showYearMonthDropdowns ? toYear : undefined}
                  {...calendarProps}
                />
              </PopoverContent>
            </Popover>
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
}
