import { SITE_MAP } from "@/common/constants/frontendRouting";
import { StudentRepositoryTabs } from "./enum";

export const HEADER_ITEMS = {
    [StudentRepositoryTabs.STUDENT_DETAILS]: {
      title: 'Student Details',
      route: (id: string) => SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(id, 'student-details')
    },
    [StudentRepositoryTabs.ACADEMIC_DETAILS]: {
      title: 'Academic Details',
      route: (id: string) => SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(id, 'academic-details')
    },
    [StudentRepositoryTabs.ALL_DOCUMENTS]: {
      title: 'All Documents',
      route: (id: string) => SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(id, 'all-documents')
    },
    [StudentRepositoryTabs.OFFICE_DETAILS]: {
      title: 'Office Details',
      route: (id: string) => SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(id, 'office-details')
    }
  };