import React from 'react';
import PersonalDetailsSection from '../sub-sections/personal-details';
import AddressDetailsSection from '../sub-sections/address-details';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { updateStudentDetailsRequestSchema } from '../helpers/schema';
import { z } from 'zod';
import { set } from 'nprogress';
import AcademicDetailsSection from '../sub-sections/academic-details';
import { formatDisplayDate } from '../../enquiry-form/stage-2/student-fees-form';
import { filterBySchema } from '@/lib/utils';
import { updateStudent } from '../helpers/api';
import { toast } from 'sonner';
import { StudentData } from '../helpers/interface';
import { getPersonalDetailsFormData } from '../helpers/helper';

interface StudentDetailsTabProps {
  personalDetailsForm: UseFormReturn<z.infer<typeof updateStudentDetailsRequestSchema>>; 
  commonFieldClass: string;
  commonFormItemClass: string;
  setStudentData: (data: any) => void;
}
const StudentDetailsTab: React.FC<StudentDetailsTabProps> = ({
  personalDetailsForm,
  commonFieldClass,
  commonFormItemClass,
  setStudentData
}) => {

  const handleSave = async () => {
    const data = personalDetailsForm.getValues();

    data.dateOfBirth = data.dateOfBirth
      ? (formatDisplayDate(new Date(data.dateOfBirth)) ?? '')
      : '';

    const filteredData = filterBySchema(updateStudentDetailsRequestSchema, data);

    // if form contains errors, then show toast error
    if (personalDetailsForm.formState.errors && Object.keys(personalDetailsForm.formState.errors).length > 0) {
      console.log('Form errors:', personalDetailsForm.formState);
      const errorMessages = Object.values(personalDetailsForm.formState.errors).map(
        (error) => error.message
      );
      toast.error(errorMessages.join(', '));

      // reset form to original values
      personalDetailsForm.reset();

      return;
    }

    const response: StudentData = await updateStudent(filteredData);

    if (response) {
      setStudentData(response);
      const filteredResponse = getPersonalDetailsFormData(response);
      personalDetailsForm.reset(filteredResponse);
      toast.success('Student data updated successfully');
    } else {
      toast.error('Failed to update student data');
    }
  };

  return (
    <Form {...personalDetailsForm}>
      {/* Personal Details */}
      <PersonalDetailsSection
        form={personalDetailsForm}
        commonFieldClass={commonFieldClass}
        commonFormItemClass={commonFormItemClass}
        handleSave={handleSave}
      />

      {/* Address Details */}
      <AddressDetailsSection
        form={personalDetailsForm}
        commonFieldClass={commonFieldClass}
        commonFormItemClass={commonFormItemClass}
        handleSave={handleSave}
      />

      {/* Academic Details */}
      <AcademicDetailsSection
        form={personalDetailsForm}
        commonFieldClass={commonFieldClass}
        commonFormItemClass={commonFormItemClass}
        handleSave={handleSave}
      />
    </Form>
  );
};

export default StudentDetailsTab;
