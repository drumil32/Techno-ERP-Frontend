export const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  // Auth
  login: `${API_DOMAIN}/auth/login`,
  profile: `${API_DOMAIN}/user/profile`,
  register: `${API_DOMAIN}/auth/register`,
  send_otp: `${API_DOMAIN}/auth/send-otp`,
  verify_otp: `${API_DOMAIN}/auth/verify-otp`,
  forgot_password: `${API_DOMAIN}/auth/forgot-password`,
  update_password: `${API_DOMAIN}/auth/update-password`,
  logout: `${API_DOMAIN}/auth/logout`,
  isAuthenticated: `${API_DOMAIN}/auth/is-authenticated`,

  // Marketing
  getAllLeads: `${API_DOMAIN}/crm/fetch-data`,
  getAllLeadsAnalytics: `${API_DOMAIN}/crm/analytics`,
  fetchAssignedToDropdown: `${API_DOMAIN}/user/fetch-dropdown?role=EMPLOYEE_MARKETING&moduleName=MARKETING`,
  updateLead: `${API_DOMAIN}/crm/edit`,

  getAdminAnalytics: `${API_DOMAIN}/crm/admin/analytics`,

  getYellowLeads: `${API_DOMAIN}/crm/yellow-lead`,
  getYellowLeadsAnalytics: `${API_DOMAIN}/crm/yellow-lead-analytics`,
  updateYellowLead: `${API_DOMAIN}/crm/update-yellow-lead`,

  // Admissions
  admissionData: `${API_DOMAIN}/admission/enquiry/search`,
  getEnquiry: (enquiry_id: string) => `${API_DOMAIN}/admission/enquiry/${enquiry_id}`,
  createEnquiry: `${API_DOMAIN}/admission/enquiry/step-1`,
  updateEnquiry: `${API_DOMAIN}/admission/enquiry/step-1`,

  createEnquiryDraft: `${API_DOMAIN}/admission/enquiry/create-draft-step-1`,
  updateEnquiryDraft: `${API_DOMAIN}/admission/enquiry/update-draft-step-1`,

  updateEnquiryStatus: `${API_DOMAIN}/admission/enquiry/update-status`,

  // Dropdowns
  fetchTeleCallersDropdown: `${API_DOMAIN}/user/fetch-dropdown?role=EMPLOYEE_MARKETING&moduleName=ADMISSION`,
  fetchCounsellorsDropdown: `${API_DOMAIN}/user/fetch-dropdown?role=COUNSELOR&moduleName=ADMISSION`,
  fetchMarketingSourcesDropdown: `${API_DOMAIN}/dropdown/MAKRETING_SOURCE`,
  fetchCityDropdown: `${API_DOMAIN}/dropdown/CITY`,
  fetchFixCityDropdown: `${API_DOMAIN}/dropdown/FIX_CITY`,
  fetchCourseDropdown: `${API_DOMAIN}/dropdown/COURSE`,
  fetchFixCourseDropdown: `${API_DOMAIN}/dropdown/FIX_COURSE`,
  fetchDistricts: `${API_DOMAIN}/dropdown/DISTRICT`,

  // Fees Details
  getOtherFees: `${API_DOMAIN}/fees-structure/other-fees`,
  getFeesByCourse: (course_name: string) => `${API_DOMAIN}/fees-structure/course/${course_name}`,

  createStudentFees: `${API_DOMAIN}/admission/enquiry/step-2`,
  updateStudentFees: `${API_DOMAIN}/admission/enquiry/step-2`,

  createStudentFeesDraft: `${API_DOMAIN}/admission/enquiry/create-draft-step-2`,
  updateStudentFeesDraft: `${API_DOMAIN}/admission/enquiry/update-draft-step-2`,

  createEnquiryStep4: `${API_DOMAIN}/admission/enquiry/step-4`,
  updateEnquiryStep4: `${API_DOMAIN}/admission/enquiry/step-4`,

  updateEnquiryDraftStep3: `${API_DOMAIN}/admission/enquiry/save-draft-step-3`,
  updateEnquiryStep3: `${API_DOMAIN}/admission/enquiry/step-3`,

  // Document Upload
  uploadDocument: `${API_DOMAIN}/admission/enquiry/update-document`,

  //Department Meta Data
  createDepartmentMetaData: `${API_DOMAIN}/department-metadata`,
  updateDepartmentMetaData: `${API_DOMAIN}/department-metadata`,
  getDepartmentMetaData: `${API_DOMAIN}/department-metadata`,
  fetchInstructorsMetaData: `${API_DOMAIN}/department-metadata/instructors`,

  //Courses
  createCourse: `${API_DOMAIN}/course`,
  getCourseDetails: `${API_DOMAIN}/course/course-details`,
  getUniqueCourseDetails: `${API_DOMAIN}/course/unique-courses`,
  updateCourse: `${API_DOMAIN}/course`,

  createSubject: `${API_DOMAIN}/course/subject`,
  getSubjectDetails: `${API_DOMAIN}/course/subject/subject-details`,
  getFilteredSubjectDetails: `${API_DOMAIN}/course/subject/filtered-subject-details`,
  updateSubject: `${API_DOMAIN}/course/subject`,
  deleteSubject: `${API_DOMAIN}/course/subject`,

  createPlan: `${API_DOMAIN}/course/subject/schedule/plan`,
  uploadPlan: `${API_DOMAIN}/course/subject/schedule/upload-plan`,
  uploadAdditionalResources: `${API_DOMAIN}/course/subject/schedule/upload-additional-resource`,
  getScheduleDetails: `${API_DOMAIN}/course/subject/schedule/schedule-details`,
  batchUpdatePlan: `${API_DOMAIN}/course/subject/schedule/plan`,
  deletePlan: `${API_DOMAIN}/course/subject/schedule/plan`,
  deleteFileUsingURL: `${API_DOMAIN}/course/subject/schedule/delete-file`
};
