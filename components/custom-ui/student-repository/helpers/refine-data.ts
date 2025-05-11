import { formatYearRange } from "@/lib/utils";
import { StudentListData } from "./interface";
import { YearMap } from "./constants";

export const refineStudents = (data: StudentListData): StudentListData => {
    console.log('Refining students data:', data);
    const refinedStudents = data.students.map((student,index) => ({
        _id: student._id,
        id: index+1,
        universityId: student.universityId,
        studentName: student.studentName,
        studentPhoneNumber: student.studentPhoneNumber,
        fatherName: student.fatherName,
        fatherPhoneNumber: student.fatherPhoneNumber,
        courseName: student.courseName,
        currentSemester: student.currentSemester,
        currentAcademicYear: formatYearRange(student.currentAcademicYear),
        currentYear: Math.ceil(student.currentSemester / 2),
        courseYear: (() => {
            const currentYear = Math.ceil(student.currentSemester / 2);
            return YearMap[currentYear - 1] || "Unknown";
        })(),
    }));
    
    return {
        students: refinedStudents,
        pagination: {
            total: data.pagination.total,
            page: data.pagination.page,
            limit: data.pagination.limit,
            totalPages: data.pagination.totalPages
        }
    };

}