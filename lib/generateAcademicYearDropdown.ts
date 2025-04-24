export function generateAcademicYearDropdown(): string[] {
    const date = new Date();
    const currentYear = date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1;
    const academicYears: string[] = [];

    for (let i = -5; i <= 5; i++) {
        const startYear = currentYear + i;
        const endYear = startYear + 1;
        academicYears.push(`${startYear}-${endYear}`);
    }

    return academicYears;
}
