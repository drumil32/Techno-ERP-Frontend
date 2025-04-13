export const SITE_MAP = {
    HOME: {
        DEFAULT: '/c/marketing/all-leads',
    },
    AUTH: {
        DEFAULT: '/auth',
        LOGIN: '/auth/login',
    },
    MARKETING: {
        DEFAULT: '/c/marketing/all-leads',
        ALL_LEADS: '/c/marketing/all-leads',
        YELLOW_LEADS: '/c/marketing/yellow-leads',
        ADMIN_TRACKER: '/c/marketing/admin-tracker',
    },
    ADMISSIONS: {
        DEFAULT: '/c/admissions',
        FORM_STAGE_1: (id: string) => `/c/admissions/application-process/${id}/step_1`,
        FORM_STAGE_2: (id: string) => `/c/admissions/application-process/${id}/step_2`,
        FORM_STAGE_3: (id: string) => `/c/admissions/application-process/${id}/step_3`,
        FORM_STAGE_4: (id: string) => `/c/admissions/application-process/${id}/step_4`,
        GO_TO_ENQUIRY: (id: string, stage: string) => `/c/admissions/application-process/${id}/${stage}`,
    },
    FINANCE: {
        DEFAULT: '/c/finance',
    },
    STUDENT_REPOSITORY: {
        DEFAULT: '/c/student-repository',
    },
    ALL_COURSES: {
        DEFAULT: '/c/courses',
    },
    FACULTY: {
        DEFAULT: '/c/faculty',
    },
};
