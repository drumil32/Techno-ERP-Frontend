import { CourseDues, CourseDueTableItem } from "@/types/finance";

export const convertForTableView = (courseDues: CourseDues[]): CourseDueTableItem[] => {
  let tableViewData: CourseDueTableItem[] = []
  let sno = 1;
  courseDues.forEach((courseDue) => {
    const {courseName, courseCode, departmentHODEmail, departmentHODName, dues} = {...courseDue}
    dues.forEach((due) => {
      tableViewData.push({
        sno,
        courseName,
        courseCode,
        courseYear: due.courseYear,
        dueStudentCount: due.dueStudentCount,
        totalDue: due.totalDue,
        departmentHODName,
        departmentHODEmail
      })
      sno++
    })
  })

  return tableViewData
}
