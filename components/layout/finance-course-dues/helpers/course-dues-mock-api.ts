// @/components/layout/finance-course-dues/helpers/course-dues-mock-api.ts

import { CourseDue, CourseDuesApiResponse } from "@/types/finance";
import { QueryFunctionContext } from "@tanstack/react-query";

// const generateMockCourseDues = (count: number): CourseDue[] => {
//   const courses = ['MBA', 'BCA', 'B.Tech CSE', 'B.Tech ECE', 'MCA', 'B.Com'];
//   const courseYears = ['First', 'Second', 'Third', 'Fourth'];
//   const courseHeads = ['Reema Sharma', 'Ashish Verma', 'Ritu Gupta', 'Sunil Kumar', 'Priya Singh'];
//   const baseContact = 8234567800;

//   const dues: CourseDue[] = [];
//   let idCounter = 1;

//   for (const course of courses) {
//     const maxYear = course.startsWith('B.Tech') ? 4 : (course === 'MBA' || course === 'MCA' ? 2 : 3);
//     for (let yearIndex = 0; yearIndex < maxYear; yearIndex++) {
//       if (dues.length >= count) break;

//       const yearName = courseYears[yearIndex];
//       const numStudents = Math.floor(Math.random() * 30) + 20; // 20-49 students
//       const avgDuePerStudent = Math.random() > 0.3 ? (Math.floor(Math.random() * 1500) + 500) : 0;
//       const totalDue = avgDuePerStudent * numStudents;
//       const headIndex = Math.floor(Math.random() * courseHeads.length);

//       dues.push({
//         _id: `crs_${idCounter.toString().padStart(4, '0')}`,
//         course: course,
//         courseYear: yearName,
//         numberOfStudents: numStudents,
//         totalDue: totalDue,
//         courseHead: courseHeads[headIndex],
//         courseHeadContact: (baseContact + headIndex * 1000 + idCounter).toString(),
//       });
//       idCounter++;
//     }
//     if (dues.length >= count) break;
//   }

//   // Add more if needed to reach the count
//   while (dues.length < count) {
//     const course = courses[Math.floor(Math.random() * courses.length)];
//     const maxYear = course.startsWith('B.Tech') ? 4 : (course === 'MBA' || course === 'MCA' ? 2 : 3);
//     const yearIndex = Math.floor(Math.random() * maxYear);
//     const yearName = courseYears[yearIndex];
//     const numStudents = Math.floor(Math.random() * 30) + 20;
//     const avgDuePerStudent = Math.random() > 0.3 ? (Math.floor(Math.random() * 1500) + 500) : 0;
//     const totalDue = avgDuePerStudent * numStudents;
//     const headIndex = Math.floor(Math.random() * courseHeads.length);

//     // Avoid duplicates
//     if (!dues.some(d => d.course === course && d.courseYear === yearName)) {
//       dues.push({
//         _id: `crs_${idCounter.toString().padStart(4, '0')}`,
//         course: course,
//         courseYear: yearName,
//         numberOfStudents: numStudents,
//         totalDue: totalDue,
//         courseHead: courseHeads[headIndex],
//         courseHeadContact: (baseContact + headIndex * 1000 + idCounter).toString(),
//       });
//       idCounter++;
//     }
//   }

//   return dues.slice(0, count);
// };

// // Create the full dataset once (not on every call)
// const allMockCourseDues = generateMockCourseDues(40);

// // Mock API function to fetch Course Dues
// export const fetchCourseDuesMock = async ({ queryKey }: any) => {
//   try {
//     // Extract parameters from queryKey
//     const [_key, params] = queryKey as [string, any];

//     const {
//       page = 1,
//       limit = 10,
//       search = '',
//       sortBy = ['course'],
//       orderBy = ['asc'],
//     } = params || {};

//     console.log("Fetching mock course dues with params:", params);

//     // Simulate network delay (reduced for better UX during testing)
//     await new Promise((resolve) => setTimeout(resolve, 200));

//     // --- Filtering ---
//     let filteredData = [...allMockCourseDues]; // Create a copy to avoid mutation issues

//     // Filter by Search Term
//     if (search) {
//       const searchTerm = search.toLowerCase();
//       filteredData = filteredData.filter((due) =>
//         due.course.toLowerCase().includes(searchTerm) ||
//         due.courseHead.toLowerCase().includes(searchTerm)
//       );
//     }

//     // --- Sorting ---
//     if (sortBy && sortBy.length > 0 && orderBy && orderBy.length > 0) {
//       const sortField = sortBy[0] as keyof CourseDue;
//       const sortOrder = orderBy[0];

//       // List of valid sort fields
//       const validSortFields: (keyof CourseDue)[] = ['course', 'courseYear', 'numberOfStudents', 'totalDue', 'courseHead', 'courseHeadContact'];
      
//       if (validSortFields.includes(sortField)) {
//         filteredData.sort((a, b) => {
//           let valA = a[sortField];
//           let valB = b[sortField];

//           // Convert to numbers for numeric fields
//           if (sortField === 'numberOfStudents' || sortField === 'totalDue') {
//             valA = Number(valA);
//             valB = Number(valB);
//           } else {
//             // For string fields
//             valA = String(valA).toLowerCase();
//             valB = String(valB).toLowerCase();
//           }

//           let comparison = 0;
//           if (valA > valB) {
//             comparison = 1;
//           } else if (valA < valB) {
//             comparison = -1;
//           }

//           return sortOrder === 'desc' ? comparison * -1 : comparison;
//         });
//       } else {
//         console.warn(`Invalid sort field provided: ${sortField}`);
//       }
//     }

//     // --- Pagination ---
//     const total = filteredData.length;
//     const totalPages = Math.ceil(total / limit);
//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;
//     const paginatedData = filteredData.slice(startIndex, endIndex);

//     // Add the 'S. No' based on pagination
//     const dataWithSno = paginatedData.map((item, index) => ({
//       ...item,
//       sno: startIndex + index + 1,
//     }));

//     // --- Return Response ---
//     return {
//       courseDues: dataWithSno,
//       total,
//       totalPages,
//       currentPage: page,
//       limit
//     };
//   } catch (error) {
//     console.error("Error in fetchCourseDuesMock:", error);
//     throw error; // Re-throw to let React Query handle it
//   }
// };


// @/components/layout/finance-course-dues/helpers/course-dues-mock-api.ts


export const fetchCourseDuesMock = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate network delay

  const hardcodedData: (CourseDue & { sno: number })[] = [
    {
      _id: "crs_0001",
      course: "MBA",
      courseYear: "First",
      numberOfStudents: 35,
      totalDue: 42000,
      courseHead: "Reema Sharma",
      courseHeadContact: "8234567801",
      sno: 1
    },
    {
      _id: "crs_0002",
      course: "B.Tech CSE",
      courseYear: "Second",
      numberOfStudents: 40,
      totalDue: 60000,
      courseHead: "Ashish Verma",
      courseHeadContact: "8234568802",
      sno: 2
    },
    {
      _id: "crs_0003",
      course: "BCA",
      courseYear: "Third",
      numberOfStudents: 30,
      totalDue: 27000,
      courseHead: "Ritu Gupta",
      courseHeadContact: "8234570803",
      sno: 3
    }
  ];

  return {
    courseDues: hardcodedData,
    total: hardcodedData.length,
    totalPages: 1,
    currentPage: 1,
    limit: hardcodedData.length
  };
};
