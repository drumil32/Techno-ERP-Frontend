export const parseAcademicYear = (academicYear : string) : number => {
    const academicYearParts = academicYear.split("-");
    return parseInt(academicYearParts[0]);
}