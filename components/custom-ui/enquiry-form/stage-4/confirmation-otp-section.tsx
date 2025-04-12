import React, { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ConfirmationOTPSectionProps {
  form: UseFormReturn<any>;
  studentEmail: string | null;
  studentPhone: string | null;
}

const ConfirmationOTPSection: React.FC<ConfirmationOTPSectionProps> = ({
  form,
  studentEmail,
  studentPhone
}) => {
  const [isOtpSending, setIsOtpSending] = useState(false);

  const selectedOtpTarget = useWatch({ control: form.control, name: 'otpTarget' });

  const otpDisplayValue = useMemo(() => {
    if (selectedOtpTarget === 'email') {
      return studentEmail || '(Email not available)';
    } else if (selectedOtpTarget === 'phone') {
      return studentPhone || '(Phone not available)';
    }
    return '';
  }, [selectedOtpTarget, studentEmail, studentPhone]);

  return (
    <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="college-info">
      <AccordionItem value="confirmation" className="border-b-0">
        <AccordionTrigger className="w-full items-center">
          <h3 className="font-inter text-[16px] font-semibold"> Confirmation</h3>
          <hr className="flex-1 border-t border-[#DADADA] ml-2" />
        </AccordionTrigger>
        <AccordionContent className="p-6 space-y-4 bg-white text-gray-600 rounded-[10px]">
          <FormField
            control={form.control}
            name="otpTarget"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium block">
                  Select Contact for OTP Verification
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                    className="flex flex-col sm:flex-row gap-y-2 gap-x-6 pt-1"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="email" id="otp-email" disabled={!studentEmail} />
                      </FormControl>
                      <FormLabel
                        htmlFor="otp-email"
                        className={`font-normal text-sm cursor-pointer ${!studentEmail ? 'text-gray-400 cursor-not-allowed' : ''}`}
                      >
                        Email: {studentEmail || '(Not Available)'}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="phone" id="otp-phone" disabled={!studentPhone} />
                      </FormControl>
                      <FormLabel
                        htmlFor="otp-phone"
                        className={`font-normal text-sm cursor-pointer ${!studentPhone ? 'text-gray-400 cursor-not-allowed' : ''}`}
                      >
                        Phone: {studentPhone || '(Not Available)'}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-xs pt-1" />
              </FormItem>
            )}
          />

          <div className="flex gap-8 items-stretch">
            <div>
              <FormLabel htmlFor="otp-display" className="text-sm mb-3 text-gray-600">
                Selected Contact
              </FormLabel>
              <Input
                id="otp-display"
                readOnly
                value={otpDisplayValue}
                placeholder="Select Email or Phone above"
                className="h-9 text-sm cursor-not-allowed"
              />
            </div>

            <Button
              type="button"
              onClick={() => {}}
              disabled={isOtpSending || !selectedOtpTarget}
              className="h-9 text-sm mt-auto"
            >
              {isOtpSending ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ConfirmationOTPSection;
