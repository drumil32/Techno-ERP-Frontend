import { AdmissionAggregationType, DropDownType } from '@/types/enum';

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
  uploadMarketingData: `${API_DOMAIN}/crm/upload`,
  downloadMarketingData: `${API_DOMAIN}/crm/export-data`,
  getAllLeads: `${API_DOMAIN}/crm/fetch-data`,
  getAllLeadsAnalytics: `${API_DOMAIN}/crm/analytics`,
  fetchAssignedToDropdown: `${API_DOMAIN}/user/fetch-dropdown?role=EMPLOYEE_MARKETING&moduleName=MARKETING`,
  updateLead: `${API_DOMAIN}/crm/edit`,

  getAvailableSheets: `${API_DOMAIN}/crm/assigned-sheets`,
  getUserAnalytics: `${API_DOMAIN}/crm/user-daily-analytics`,

  // Marketing Analytics

  sourceAnalytics: `${API_DOMAIN}/crm/source-analytics`,
  durationBasedSourceAnalytics: `${API_DOMAIN}/crm/user-wise-analytics-duration`,
  todaySourceAnalytics: `${API_DOMAIN}/crm/user-wise-analytics-daily`,

  getAdminAnalytics: `${API_DOMAIN}/crm/admin/analytics`,

  getYellowLeads: `${API_DOMAIN}/crm/yellow-lead`,
  getYellowLeadsAnalytics: `${API_DOMAIN}/crm/yellow-lead-analytics`,
  updateYellowLead: `${API_DOMAIN}/crm/update-yellow-lead`,

  // Admissions
  admissionData: `${API_DOMAIN}/admission/enquiry/search`,
  admissionReceipt: `${API_DOMAIN}/download-reciept/admission`,
  admissionFeeReceipt: `${API_DOMAIN}/download-reciept/admission-transaction-slip`,
  getEnquiry: (enquiry_id: string) => `${API_DOMAIN}/admission/enquiry/${enquiry_id}`,
  createEnquiry: `${API_DOMAIN}/admission/enquiry/step-1`,
  updateEnquiry: `${API_DOMAIN}/admission/enquiry/step-1`,

  createEnquiryDraft: `${API_DOMAIN}/admission/enquiry/create-draft-step-1`,
  updateEnquiryDraft: `${API_DOMAIN}/admission/enquiry/update-draft-step-1`,

  updateEnquiryStatus: `${API_DOMAIN}/admission/enquiry/update-status`,

  // Dropdowns
  fetchTeleCallersDropdown: `${API_DOMAIN}/user/fetch-dropdown?role=EMPLOYEE_MARKETING&moduleName=ADMISSION`,
  fetchCounsellorsDropdown: `${API_DOMAIN}/user/fetch-dropdown?role=COUNSELOR&moduleName=ADMISSION`,
  fetchMarketingSourcesDropdown: `${API_DOMAIN}/dropdown/${DropDownType.MARKETING_SOURCE}`,
  fetchCityDropdown: `${API_DOMAIN}/dropdown/${DropDownType.MARKETING_CITY}`,
  fetchFixCityDropdown: `${API_DOMAIN}/dropdown/${DropDownType.FIX_MARKETING_CITY}`,
  fetchCourseDropdown: `${API_DOMAIN}/dropdown/${DropDownType.MARKETING_COURSE_CODE}`,
  fetchFixCourseDropdown: `${API_DOMAIN}/dropdown/${DropDownType.FIX_MARKETING_COURSE_CODE}`,
  fetchFixCourseCodesDropdown: `${API_DOMAIN}/course-metadata/course-code`,

  fetchDistricts: `${API_DOMAIN}/dropdown/${DropDownType.DISTRICT}`,

  // Fees Details
  getOtherFees: `${API_DOMAIN}/fees-structure/other-fees`,
  getFeesByCourse: (course_name: string) => `${API_DOMAIN}/fees-structure/course/${course_name}`,

  createStudentFees: `${API_DOMAIN}/admission/enquiry/step-2`,
  updateStudentFees: `${API_DOMAIN}/admission/enquiry/step-2`,

  createStudentFeesDraft: `${API_DOMAIN}/admission/enquiry/create-draft-step-2`,
  updateStudentFeesDraft: `${API_DOMAIN}/admission/enquiry/update-draft-step-2`,

  createEnquiryStep4: `${API_DOMAIN}/admission/enquiry/step-4`,
  updateEnquiryStep4: `${API_DOMAIN}/admission/enquiry/step-4`,
  approveEnquiry: `${API_DOMAIN}/admission/enquiry/approve-enquiry`,

  updateEnquiryDraftStep3: `${API_DOMAIN}/admission/enquiry/save-draft-step-3`,
  updateEnquiryStep3: `${API_DOMAIN}/admission/enquiry/step-3`,
  verifyOtpSection: `${API_DOMAIN}/admission/enquiry/step-3/verify-otp`,

  admissionAnalyticsData: ({ type, date }: { type: AdmissionAggregationType; date: string }) => {
    return `${API_DOMAIN}/admission/analytics?type=${type}&date=${date}`;
  },

  // Document Upload
  uploadDocument: `${API_DOMAIN}/admission/enquiry/update-document`,
  fetchDocumentsByCourse: `${API_DOMAIN}/course-metadata`,

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
  deleteFileUsingURL: `${API_DOMAIN}/course/subject/schedule/delete-file`,

  //Student Repository

  getStudentRepository: `${API_DOMAIN}/student/repo/search`,
  getSingleStudent: (id: string) => `${API_DOMAIN}/student/repo/${id}`,
  updateStudentRepository: `${API_DOMAIN}/student/repo/student-details`,
  updateStudentDocuments: `${API_DOMAIN}/student/repo/student-physical-document`,
  updateDocument: `${API_DOMAIN}/student/repo/document`,

  //Finance
  transactionSlip: `${API_DOMAIN}/download-reciept/transaction-slip`,
  getStudentActiveDues: `${API_DOMAIN}/student/fees/active-dues`,
  getStudentFeeInformation: (student_id: string) =>
    `${API_DOMAIN}/student/fees/fee-information/${student_id}`,

  recordPayment: `${API_DOMAIN}/student/fees/record-payment`,
  updateFeeBreakup: `${API_DOMAIN}/student/fees/fee-breakup`,
  fetchFeeBreakUpHistory: `${API_DOMAIN}/student/fees/fee-update-history`,

  getCourseDues: `${API_DOMAIN}/course/fetch-dues`,
  updateCourseDues: `${API_DOMAIN}/course/dues`,

  overallCollections: `${API_DOMAIN}/fee-analytics/overall`,
  getDailyCollections: `${API_DOMAIN}/fee-analytics/daywise`,
  getMonthlyCollections: `${API_DOMAIN}/fee-analytics/monthwise`
};
