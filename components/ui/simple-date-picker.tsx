// import { format } from 'date-fns';
// import { Calendar as CalendarIcon, X } from 'lucide-react';
// import { Calendar } from '@/components/ui/calendar';
// import { Button } from '@/components/ui/button';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import { parse, isValid } from 'date-fns';

// const parseDDMMYYYY = (dateString: string): Date | undefined => {
//   const parsed = parse(dateString, 'dd/MM/yyyy', new Date());
//   return isValid(parsed) ? parsed : undefined;
// };

// type SimpleDatePickerProps = {
//   value?: Date;
//   onChange: (date: Date | undefined) => void;
//   placeholder?: string;
//   dateFormat?: string;
//   disabled?: boolean;
//   className?: string;
//   calendarProps?: Omit<
//     React.ComponentProps<typeof Calendar>,
//     'mode' | 'selected' | 'onSelect'
//   >;
//   showYearMonthDropdowns?: boolean;
//   fromYear?: number;
//   toYear?: number;
// };

// export const SimpleDatePicker = ({
//   value,
//   onChange,
//   placeholder = 'Pick a date',
//   dateFormat = 'dd/MM/yyyy',
//   disabled = false,
//   className = '',
//   calendarProps = {},
//   showYearMonthDropdowns = true,
//   fromYear = new Date().getFullYear() - 100,
//   toYear = new Date().getFullYear() + 10,
// }: SimpleDatePickerProps) => {
//   const formattedValue = value && isValid(value) ? format(value, dateFormat) : '';

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           type="button"
//           variant="outline"
//           className={cn(
//             'pl-3 pr-2 text-left font-normal h-9 w-[180px] flex items-center justify-between transition-all',
//             !value && 'text-muted-foreground',
//             className
//           )}
//           disabled={disabled}
//         >
//           <span className="truncate">
//             {formattedValue || placeholder}
//           </span>
//           {value && isValid(value) ? (
//             <X
//               className="ml-2 h-4 w-4 cursor-pointer opacity-50 hover:opacity-80"
//               onClick={(e) => {
//                 e.stopPropagation(); // prevent popover from opening
//                 onChange(undefined);
//               }}
//             />
//           ) : (
//             <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           mode="single"
//           selected={value}
//           onSelect={onChange}
//           initialFocus
//           captionLayout={showYearMonthDropdowns ? 'dropdown-buttons' : 'buttons'}
//           fromYear={showYearMonthDropdowns ? fromYear : undefined}
//           toYear={showYearMonthDropdowns ? toYear : undefined}
//           {...calendarProps}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };
import { format, isValid, parse } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type SimpleDatePickerProps = {
  value?: string; // 'dd/MM/yyyy'
  onChange: (formattedDate: string | undefined) => void;
  placeholder?: string;
  dateFormat?: string;
  disabled?: boolean;
  className?: string;
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    'mode' | 'selected' | 'onSelect'
  >;
  showYearMonthDropdowns?: boolean;
  fromYear?: number;
  toYear?: number;
};

export const SimpleDatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  dateFormat = 'dd/MM/yyyy',
  disabled = false,
  className = '',
  calendarProps = {},
  showYearMonthDropdowns = true,
  fromYear = new Date().getFullYear() - 100,
  toYear = new Date().getFullYear() + 10,
}: SimpleDatePickerProps) => {
  const parsedDate = useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, dateFormat, new Date());
    const [day, month, year] = value.split('/');
    const isExactMatch =
      isValid(parsed) &&
      parsed.getDate() === Number(day) &&
      parsed.getMonth() + 1 === Number(month) &&
      parsed.getFullYear() === Number(year);
    return isExactMatch ? parsed : undefined;
  }, [value, dateFormat]);

  const formattedValue = parsedDate ? format(parsedDate, dateFormat) : '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'pl-3 pr-2 text-left font-normal h-9 w-[180px] flex items-center justify-between transition-all',
            !parsedDate && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">{formattedValue || placeholder}</span>
          {parsedDate ? (
            <X
              className="ml-2 h-4 w-4 cursor-pointer opacity-50 hover:opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
            />
          ) : (
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={(selected) => {
            if (selected && isValid(selected)) {
              onChange(format(selected, dateFormat));
            } else {
              onChange(undefined);
            }
          }}
          initialFocus
          captionLayout={showYearMonthDropdowns ? 'dropdown-buttons' : 'buttons'}
          fromYear={showYearMonthDropdowns ? fromYear : undefined}
          toYear={showYearMonthDropdowns ? toYear : undefined}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
};
