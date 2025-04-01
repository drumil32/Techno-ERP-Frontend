import { updateEnquiry } from '@/components/custom-ui/enquiry-form/stage-1/enquiry-form-api';
import { get } from 'http';

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
  fetchAssignedToDropdown: `${API_DOMAIN}/user/fetch-dropdown?moduleName=MARKETING`,
  updateLead: `${API_DOMAIN}/crm/edit`,

  getAdminAnalytics: `${API_DOMAIN}/crm/admin/analytics`,

  getYellowLeads: `${API_DOMAIN}/crm/yellow-lead`,
  getYellowLeadsAnalytics: `${API_DOMAIN}/crm/yellow-lead-analytics`,
  updateYellowLead: `${API_DOMAIN}/crm/update-yellow-lead`,

  admissionsData: `${API_DOMAIN}/admission/enquiry/search`,

  // Admissions

  getEnquiry: (enquiry_id: string) => `${API_DOMAIN}/admission/enquiry/${enquiry_id}`,
  createEnquiry: `${API_DOMAIN}/admission/enquiry/step-1`,
  updateEnquiry: `${API_DOMAIN}/admission/enquiry/step-1`,

  createEnquiryDraft: `${API_DOMAIN}/admission/enquiry/create-draft-step-1`,
  updateEnquiryDraft: `${API_DOMAIN}/admission/enquiry/update-draft-step-1`,

  updateEnquiryStatus: `${API_DOMAIN}/admission/enquiry/update-status`,

  // Fees Details
  getOtherFees: `${API_DOMAIN}/fees-structure/other-fees`,
  getFeesByCourse: (course_name: string) => `${API_DOMAIN}/fees-structure/course/${course_name}`,

  createStudentFees: `${API_DOMAIN}/admission/enquiry/step-2`,
  updateStudentFees: `${API_DOMAIN}/admission/enquiry/step-2`,

  createStudentFeesDraft: `${API_DOMAIN}/admission/enquiry/create-draft-step-2`,
  updateStudentFeesDraft: `${API_DOMAIN}/admission/enquiry/update-draft-step-2`,

};
