import { StudentListData } from "./interface";

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
        currentAcademicYear: student.currentAcademicYear,
        currentYear: Math.ceil(student.currentSemester / 2),
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