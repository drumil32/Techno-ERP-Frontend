// prev: how many previous year required from current,
// next: how many next year required from current
export function generateAcademicYearDropdown(prev:number = -5, next: number = 5): string[] {
    const date = new Date();
    const currentYear = date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1;
    const academicYears: string[] = [];

    for (let i = prev; i <= next; i++) {
        const startYear = currentYear + i;
        const endYear = startYear + 1;
        academicYears.push(`${startYear}-${endYear}`);
    }

    return academicYears;
}
