export const SITE_MAP = {
  HOME: {
    DEFAULT: '/c/marketing/all-leads'
  },
  AUTH: {
    DEFAULT: '/auth',
    LOGIN: '/auth/login'
  },
  MARKETING: {
    DEFAULT: '/c/marketing/all-leads',
    ALL_LEADS: '/c/marketing/all-leads',
    ACTIVE_LEADS: '/c/marketing/active-leads',
    ADMIN_TRACKER: '/c/marketing/admin-tracker'
  },
  ADMISSIONS: {
    DEFAULT: '/c/admissions',
    FORM_STAGE_1: (id: string) => `/c/admissions/application-process/${id}/step_1`,
    FORM_STAGE_2: (id: string) => `/c/admissions/application-process/${id}/step_2`,
    FORM_STAGE_3: (id: string) => `/c/admissions/application-process/${id}/step_3`,
    FORM_STAGE_4: (id: string) => `/c/admissions/application-process/${id}/step_4`,
    GO_TO_ENQUIRY: (id: string, stage: string) => `/c/admissions/application-process/${id}/${stage}`
  },
  FINANCE: {
    DEFAULT: '/c/finance/student-dues',
    STUDENT_DUES: '/c/finance/student-dues',
    STUDENT_DUES_ID: (id:string) => `/c/finance/student-dues/${id}`,
    COURSE_DUES: '/c/finance/course-dues',
    SELECTED_COURSE_DUES: (course: string, year:string) => `/c/finance/course-dues/${course}/${year}`,
    OVERALL_DUES: '/c/finance/overall-dues',
  },
  STUDENT_REPOSITORY: {
    DEFAULT: '/c/student-repository',
    SINGLE_STUDENT: (universityId : string, stage:string, studentId : string) => `/c/student-repository/${universityId}/${stage}?studentId=${studentId}`,  
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
