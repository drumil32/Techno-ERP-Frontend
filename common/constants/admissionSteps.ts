export const ADMISSION_STEPS = [
    { id: 1, name: 'Enquiry', path: 'step_1' },
    { id: 2, name: 'Fees Details', path: 'step_2' },
    { id: 3, name: 'Registrar Office', path: 'step_3' }, 
    { id: 4, name: 'Finance Office', path: 'step_4' } 
  ];
  
  export type AdmissionStep = typeof ADMISSION_STEPS[0];
