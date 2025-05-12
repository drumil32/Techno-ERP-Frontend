import React from 'react';
import PersonalDetailsSection from '../sub-sections/personal-details';
import AddressDetailsSection from '../sub-sections/address-details';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { updateStudentDetailsRequestSchema } from '../helpers/schema';
import { z } from 'zod';
import AcademicDetailsSection from '../sub-sections/academic-details';
import { formatDisplayDate } from '../../enquiry-form/stage-2/student-fees-form';
import { filterBySchema, removeNullValues } from '@/lib/utils';
import { updateStudent } from '../helpers/api';
import { toast } from 'sonner';
import { StudentData } from '../helpers/interface';
import { getPersonalDetailsFormData } from '../helpers/helper';
import { requestDateSchema } from '@/common/constants/schemas';
import {
  IAcademicDetailArraySchema,
  IAcademicDetailSchema
} from '../../enquiry-form/schema/schema';
import { useSearchParams } from 'next/navigation';

interface StudentDetailsTabProps {
  personalDetailsForm: UseFormReturn<z.infer<typeof updateStudentDetailsRequestSchema>>;
  commonFieldClass: string;
  commonFormItemClass: string;
  studentData: StudentData;
  setStudentData: (data: any) => void;
}
const StudentDetailsTab: React.FC<StudentDetailsTabProps> = ({
  personalDetailsForm,
  commonFieldClass,
  commonFormItemClass,
  studentData,
  setStudentData
}) => {
  const handleSave = async () => {
    let data = personalDetailsForm.getValues();

    if (data.dateOfBirth && !requestDateSchema.safeParse(data.dateOfBirth).success) {
      data.dateOfBirth = formatDisplayDate(new Date(data.dateOfBirth)) ?? '';
    }

    const filteredData = filterBySchema(updateStudentDetailsRequestSchema, data);

    if (filteredData.academicDetails) {
      const filteredAcademicDetails: IAcademicDetailArraySchema =
        filteredData.academicDetails.filter((entry: IAcademicDetailSchema) => {

          if (!entry) return false;

          entry = removeNullValues(entry);

          // Only look at the fields we care about for "emptiness"
          const { schoolCollegeName, universityBoardName, passingYear, percentageObtained } = entry;

          // If ALL are empty/undefined/null/blank, skip the row
          const isAllEmpty =
            !schoolCollegeName &&
            !universityBoardName &&
            (passingYear === undefined || passingYear === null) &&
            (percentageObtained === undefined || percentageObtained === null);

          return !isAllEmpty; // keep if at least one is filled
        });

      console.log('Filtered Academic Details:', filteredAcademicDetails);
      filteredData.academicDetails = filteredAcademicDetails;
      personalDetailsForm.setValue('academicDetails', filteredAcademicDetails);
    }

    const cleanedData = removeNullValues(filteredData);

    // if form contains errors, then show toast error
    const validationResult = updateStudentDetailsRequestSchema.safeParse(cleanedData);

    console.log('Validation Result:', validationResult);

    if (!validationResult.success) {
      toast.error('Validation failed. Please check the form fields.');
      personalDetailsForm.setError('root', {
        type: 'manual',
        message: 'Validation failed. Please check the form fields.'
      });

      function setNestedErrors(errorObj: any, path = '') {
        Object.entries(errorObj).forEach(([key, value]) => {
          if (key === '_errors') {
            if (Array.isArray(value) && value.length > 0) {
              personalDetailsForm.setError(path as keyof typeof filteredData, {
                type: 'manual',
                message: value[0] || 'Invalid value'
              });
            }
          } else if (typeof value === 'object' && value !== null) {
            setNestedErrors(value, path ? `${path}.${key}` : key);
          }
        });
      }

      setNestedErrors(validationResult.error.format());
      personalDetailsForm.reset(getPersonalDetailsFormData(studentData));
      throw new Error('Validation failed');
    }

    const response: StudentData = await updateStudent(cleanedData);

    if (response) {
      setStudentData(response);
      const filteredResponse = getPersonalDetailsFormData(response);
      personalDetailsForm.reset(filteredResponse);
      toast.success('Student data updated successfully');
    } else {
      personalDetailsForm.reset(getPersonalDetailsFormData(studentData));
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
