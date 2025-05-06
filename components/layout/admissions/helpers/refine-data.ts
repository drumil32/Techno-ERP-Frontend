import logger from '@/lib/logger';

const displayGender = (gender: string) => {
  if (gender == 'MALE') {
    return 'Male';
  } else if (gender == 'FEMALE') {
    return 'Female';
  } else {
    return 'Not to mention';
  }
};

export const refineAdmissions = (data: any) => {
  const refineAdmissions = data.map((admission: any, index: number) => {
    return {
      ...admission,
      id: index + 1,

      district: admission.address?.district ?? '-',
      fatherPhoneNumber: admission.fatherPhoneNumber ?? '-',
      motherPhoneNumber: admission.motherPhoneNumber ?? '-',
      course: admission.course ?? '-',
      genderDisplay: displayGender(admission.gender)
    };
  });
  return refineAdmissions;
};
