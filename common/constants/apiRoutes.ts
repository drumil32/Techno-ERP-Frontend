export const API_ROUTES = {
  login: '/auth/login',
  enquiryFormStage1: (id: string) => `/c/admissions/admission-form/${id}/step_1`,
  enquiryFormStage2: (id: string) => `/c/admissions/admission-form/${id}/step_2`,
  admissions : `/c/admissions`
};
