import {
  AdmissionReference,
  AreaType,
  BloodGroup,
  Countries,
  EducationLevel,
  Gender,
  Religion,
  StatesOfIndia
} from '@/types/enum';
import { StudentData } from './interface';

export const getDisplayFields = (formData: Record<string, any>) => {
  return [
    { label: 'Student Name', value: formData.studentName },
    { label: 'Student Phone Number', value: formData.studentPhoneNumber },
    { label: 'Email ID', value: formData.emailId },
    { label: 'Student ID', value: formData.studentID },
    { label: 'Form No.', value: formData.formNo },
    { label: 'Lurn/ Pre-registration No', value: formData.lurnRegistrationNo },
    { label: "Father's Name", value: formData.fatherName },
    { label: "Father's Phone Number", value: formData.fatherPhoneNumber },
    { label: "Father's Occupation", value: formData.fatherOccupation },
    { label: "Mother's Name", value: formData.motherName },
    { label: "Mother's Phone Number", value: formData.motherPhoneNumber },
    { label: "Mother's Occupation", value: formData.motherOccupation },
    { label: 'Gender', value: formData.gender },
    {
      label: 'Date of Birth',
      value: formData.dateOfBirth
    },
    { label: 'Religion', value: formData.religion },
    { label: 'Category', value: formData.category },
    { label: 'Blood Group', value: formData.bloodGroup },
    { label: 'Aadhaar Number', value: formData.aadharNumber },
    { label: 'State Of Domicile', value: formData.stateOfDomicile },
    { label: 'Area Type', value: formData.areaType },
    { label: 'Nationality', value: formData.nationality }
  ];
};

export const getPersonalDetailsFormData = (data: StudentData) => {
  // Create a fixed-size array for academic details
  const academicDetailsArray = new Array(3).fill(null);

  // Map academic details to their correct positions based on education level
  if (data.studentInfo.academicDetails) {
    data.studentInfo.academicDetails.forEach((detail) => {
      if (!detail) return;

      let index = -1;
      switch (detail.educationLevel) {
        case EducationLevel.Tenth:
          index = 0;
          break;
        case EducationLevel.Twelfth:
          index = 1;
          break;
        case EducationLevel.Graduation:
          index = 2;
          break;
      }

      if (index !== -1) {
        academicDetailsArray[index] = detail;
      }
    });
  }

  const formData = {
    id: data._id,
    studentID: data.studentInfo.universityId,
    formNo: data.studentInfo.formNo,
    studentName: data.studentInfo.studentName,
    studentPhoneNumber: data.studentInfo.studentPhoneNumber,
    fatherName: data.studentInfo.fatherName,
    fatherPhoneNumber: data.studentInfo.fatherPhoneNumber,
    fatherOccupation: data.studentInfo.fatherOccupation,
    motherName: data.studentInfo.motherName,
    motherPhoneNumber: data.studentInfo.motherPhoneNumber,
    motherOccupation: data.studentInfo.motherOccupation,
    dateOfBirth: data.studentInfo.dateOfBirth,
    category: data.studentInfo.category,
    emailId: data.studentInfo.emailId,
    nationality: data.studentInfo.nationality,
    stateOfDomicile: data.studentInfo.stateOfDomicile as StatesOfIndia,
    areaType: data.studentInfo.areaType as AreaType,
    religion: data.studentInfo.religion as Religion,
    bloodGroup: data.studentInfo.bloodGroup as BloodGroup,
    aadharNumber: data.studentInfo.aadharNumber,
    gender: data.studentInfo.gender as Gender,
    academicDetails: academicDetailsArray,
    address: {
      addressLine1: data.studentInfo.address?.addressLine1 || '',
      addressLine2: data.studentInfo.address?.addressLine2 || '',
      pincode: data.studentInfo.address?.pincode || '',
      district: data.studentInfo.address?.district || '',
      state: data.studentInfo.address?.state as StatesOfIndia,
      country: data.studentInfo.address?.country as Countries
    },
    reference: data.studentInfo.reference as AdmissionReference,
    entranceExamDetails: data?.studentInfo?.entranceExamDetails,
    lurnRegistrationNo: data.studentInfo.lurnRegistrationNo
  };
  return formData;
};
