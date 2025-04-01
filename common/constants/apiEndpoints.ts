export const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  login: `${API_DOMAIN}/auth/login`,
  profile: `${API_DOMAIN}/user/profile`,
  register: `${API_DOMAIN}/auth/register`,
  send_otp: `${API_DOMAIN}/auth/send-otp`,
  verify_otp: `${API_DOMAIN}/auth/verify-otp`,
  forgot_password: `${API_DOMAIN}/auth/forgot-password`,
  update_password: `${API_DOMAIN}/auth/update-password`,
  logout: `${API_DOMAIN}/auth/logout`,
  isAuthenticated: `${API_DOMAIN}/auth/is-authenticated`,

  getAllLeads: `${API_DOMAIN}/crm/fetch-data`,
  getAllLeadsAnalytics: `${API_DOMAIN}/crm/analytics`,
  fetchAssignedToDropdown: `${API_DOMAIN}/user/fetch-dropdown?role=LEAD_MARKETING&moduleName=MARKETING`,
  updateLead: `${API_DOMAIN}/crm/edit`,

  getAdminAnalytics: `${API_DOMAIN}/crm/admin/analytics`,

  getYellowLeads: `${API_DOMAIN}/crm/yellow-lead`,
  getYellowLeadsAnalytics: `${API_DOMAIN}/crm/yellow-lead-analytics`,
  updateYellowLead: `${API_DOMAIN}/crm/update-yellow-lead`
};