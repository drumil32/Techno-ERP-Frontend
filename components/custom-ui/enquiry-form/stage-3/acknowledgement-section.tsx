import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import ConfirmationCheckBox from '../stage-1/confirmation-check-box';

interface ConfirmationCheckBoxInterface {
  form: UseFormReturn<any>;
}

const AcknowledgementSection: React.FC<ConfirmationCheckBoxInterface> = ({ form }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">Undertaking for Admissions</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <ConfirmationCheckBox
              form={form}
              name="confirmation"
              id="acknowledgement-checkbox"
              className="cols-span-3"
              label={`In case I am admitted, I undertake that I will make all the payments laid down by the institute from time to time. I solemnly declare that the information provided by me in the admission form is correct and I have not concealed any facts. I undertake to abide by all the rules, instructions and guidelines of the University and the Institute. I am taking admission in the institute. I am taking admission in the Institute provisionally at my own risk and responsibility, subject to the confirmation of my eligibility as per the norms laid down by University. If any stage, I am found ineligible, my admission shall be cancelled by the University under the rules, I will have no claim for it. Further, I undertake not to taken part in Ragging, Act of Indiscipline or any unlawful activities whatsoever, directly or Indirectly. If my attendance is below 75% detainment will be the sole decision of the Principal/Management. No refund is admissible if a student withdraws voluntarily after registering, or his/her admission is cancelled due to any reason.`}
            />
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default AcknowledgementSection;
