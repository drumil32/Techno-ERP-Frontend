import { FeesPaidStatus } from "@/types/enum";
import { StudentDue } from "@/types/finance";
import { QueryFunctionContext } from "@tanstack/react-query";

const generateMockStudentDues = (count: number): StudentDue[] => {
  const courses = ['B.Tech CSE', 'B.Tech ECE', 'MBA', 'BCA', 'MCA'];
  const statuses = Object.values(FeesPaidStatus);
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Reddy', 'Naidu', 'Malhotra'];

  const dues: StudentDue[] = [];
  for (let i = 1; i <= count; i++) {
    const studentFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const studentLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fatherFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const fatherLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const courseYear = Math.floor(Math.random() * 4) + 1;
    const semester = (courseYear - 1) * 2 + (Math.floor(Math.random() * 2) + 1);

    dues.push({
      _id: `stud_${i.toString().padStart(5, '0')}`,
      studentName: `${studentFirstName} ${studentLastName}`,
      studentId: `TCH${new Date().getFullYear()}${i.toString().padStart(4, '0')}`,
      studentPhoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
      fatherName: `${fatherFirstName} ${fatherLastName}`,
      fatherPhoneNumber: `8${Math.floor(100000000 + Math.random() * 900000000)}`,
      course: course,
      courseYear: courseYear,
      semester: semester,
      feeStatus: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in last 30 days
    });
  }
  return dues;
};

const allMockDues = generateMockStudentDues(40);


export const fetchStudentDuesMock = async ({ queryKey }: QueryFunctionContext) => {
  const [_key, params] = queryKey as [string, any];

  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = ['studentName'],
    orderBy = ['asc']
  } = params || {};

  console.log("Fetching mock dues with params:", params);

  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = allMockDues;
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredData = allMockDues.filter((due) =>
      due.studentName.toLowerCase().includes(searchTerm) ||
      due.studentId.toLowerCase().includes(searchTerm) ||
      due.studentPhoneNumber.includes(searchTerm) ||
      due.fatherName.toLowerCase().includes(searchTerm) ||
      due.fatherPhoneNumber.includes(searchTerm) ||
      due.course.toLowerCase().includes(searchTerm)
    );
  }

  if (sortBy && sortBy.length > 0 && orderBy && orderBy.length > 0) {
    const sortField = sortBy[0] as keyof StudentDue;
    const sortOrder = orderBy[0];

    filteredData.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }

      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  }

  const total = filteredData.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const dataWithSno = paginatedData.map((item, index) => ({
    ...item,
    id: startIndex + index + 1,
  }));

  return {
    dues: dataWithSno,
    total,
    totalPages,
    currentPage: page,
    limit
  };
};
