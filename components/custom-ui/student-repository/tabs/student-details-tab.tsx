import React from 'react';
import PersonalDetailsSection from '../sub-sections/personal-details';
import AddressDetailsSection from '../sub-sections/address-details';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { updateStudentDetailsRequestSchema } from '../helpers/schema';
import { z } from 'zod';
import { filterBySchema, removeNullValues } from '@/lib/utils';
import { updateStudent } from '../helpers/api';
import { toast } from 'sonner';
import { StudentData } from '../helpers/interface';
import { getPersonalDetailsFormData } from '../helpers/helper';
import {
  IAcademicDetailArraySchema,
  IAcademicDetailSchema
} from '../../enquiry-form/schema/schema';
import PastAcademicDetailsSection from '../sub-sections/past-academic-details';

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

    const filteredData = filterBySchema(updateStudentDetailsRequestSchema, data);

    if (filteredData.academicDetails) {
      const filteredAcademicDetails: IAcademicDetailArraySchema =
        filteredData.academicDetails.filter((entry: IAcademicDetailSchema) => {
          entry = removeNullValues(entry);
          if (!entry) return false;

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

      filteredData.academicDetails = filteredAcademicDetails;
    }

    const cleanedData = removeNullValues(filteredData);
    console.log(cleanedData);
    // if form contains errors, then show toast error
    const validationResult = updateStudentDetailsRequestSchema.safeParse(cleanedData);

    if (!validationResult.success) {
      console.log(validationResult.error);
      const errorMessages = validationResult?.error?.issues?.map((issue) => {
        // Get the field name from the path
        const fieldPath = issue.path;
        let fieldName = '';

        // Handle academic details fields specially
        if (fieldPath[0] === 'academicDetails') {
          const index = fieldPath[1];
          const field = fieldPath[2];

          // Map education levels to user-friendly names
          const levelMap: Record<string, string> = {
            '0': '10th',
            '1': '12th',
            '2': 'Graduation'
          };

          // Format field name for academic details
          fieldName = `${levelMap[index]} ${String(field)
            .split(/(?=[A-Z])/)
            .join(' ')}`;
        } else {
          // Format regular field names
          fieldName = String(fieldPath[fieldPath.length - 1])
            .split(/(?=[A-Z])/)
            .join(' ');
        }

        return issue.message === "Required" ? `${fieldName} is required` : issue?.message;
      });

      // if there is another error, then show toast error
      if (errorMessages && errorMessages.length > 1) {
        toast.error('Something went wrong');
      }

      personalDetailsForm.reset(getPersonalDetailsFormData(studentData));
      toast.error(
        <div className="space-y-1">
          <p className="font-semibold">Please fill in all required fields:</p>
          {errorMessages.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              • {error}
            </p>
          ))}
        </div>
      );
      return;
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

      {/* Past Academic Details */}
      <PastAcademicDetailsSection
        form={personalDetailsForm}
        commonFieldClass={commonFieldClass}
        commonFormItemClass={commonFormItemClass}
        handleSave={handleSave}
      />
    </Form>
  );
};

export default StudentDetailsTab;
