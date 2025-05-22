export const SITE_MAP = {
  HOME: {
    DEFAULT: '/c/marketing/all-leads'
  },
  AUTH: {
    DEFAULT: '/auth',
    LOGIN: '/auth/login'
  },
  MARKETING: {
    DEFAULT: '/',
    ALL_LEADS: '/c/marketing/all-leads',
    ACTIVE_LEADS: '/c/marketing/active-leads',
    ADMIN_TRACKER: '/c/marketing/admin-tracker'
  },
  ADMISSIONS: {
    DEFAULT: '/c/admissions/application-process',
    RECENT_ADMISSIONS: '/c/admissions/recent-admissions',
    CREATE_ADMISSION: '/c/admissions/application-process/new',
    ONGOING_ADMISSION: '/c/admissions/application-process/ongoing',
    FORM_STAGE_1: (id: string) => `/c/admissions/application-process/ongoing/${id}/step_1`,
    FORM_STAGE_2: (id: string) => `/c/admissions/application-process/ongoing/${id}/step_2`,
    FORM_STAGE_3: (id: string) => `/c/admissions/application-process/ongoing/${id}/step_3`,
    FORM_STAGE_4: (id: string) => `/c/admissions/application-process/ongoing/${id}/step_4`,
    GO_TO_ENQUIRY: (id: string, stage: string) =>
      `/c/admissions/application-process/ongoing/${id}/${stage}`
  },
  FINANCE: {
    DEFAULT: '/c/finance/student-dues',
    STUDENT_DUES: '/c/finance/student-dues',
    STUDENT_DUES_ID: (id: string) => `/c/finance/student-dues/${id}`,
    COURSE_DUES: '/c/finance/course-dues',
    SELECTED_COURSE_DUES: (course: string, year: string) =>
      `/c/finance/course-dues/${course}/${year}`,
    ADMIN_TRACKER: '/c/finance/admin-tracker'
  },
  STUDENT_REPOSITORY: {
    DEFAULT: '/c/student-repository',
    SINGLE_STUDENT: (universityId: string, stage: string, studentId: string) =>
      `/c/student-repository/${universityId}/${stage}?studentId=${studentId}`
  },
  FACULTY: {
    DEFAULT: '/c/faculty'
  },
  ACADEMICS: {
    DEFAULT: '/c/academics/courses',
    COURSES: '/c/academics/courses',
    SUBJECTS: '/c/academics/subjects'
  }
};
