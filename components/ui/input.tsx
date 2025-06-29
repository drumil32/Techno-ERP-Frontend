import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ 
  className, 
  type = 'text',
  value,
  defaultValue,
  ...props 
}: React.ComponentProps<'input'>) {
  const inputProps = value !== undefined 
    ? { value, ...props }
    : { defaultValue, ...props };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:italic',
        className
      )}
      {...inputProps}
    />
  );
}

export { Input };