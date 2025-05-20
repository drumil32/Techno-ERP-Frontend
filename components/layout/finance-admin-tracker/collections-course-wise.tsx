import { CourseCollection } from "@/types/finance";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CourseWiseCollections({ courseWiseCollection }: { courseWiseCollection: CourseCollection[] }) {
  console.log(courseWiseCollection)
  const totals = courseWiseCollection.reduce(
    (totals, item) => {
      totals.year1 += item.details[0]?.totalCollection ?? 0;
      totals.year2 += item.details[1]?.totalCollection ?? 0;
      totals.year3 += item.details[2]?.totalCollection ?? 0;
      totals.year4 += item.details[3]?.totalCollection ?? 0;
      totals.totalCollection += item.totalCollection ?? 0;
      return totals
    }, {
    year1: 0,
    year2: 0,
    year3: 0,
    year4: 0,
    totalCollection: 0
  }
  )
  return (
    <div className="w-full flex flex-col gap-4 px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="font-semibold text-lg">Course-Wise Collections</div>
      {
        courseWiseCollection.length > 0 ?

          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1]">

                <TableHead className="rounded-l-[5px]">S. No</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Year 1</TableHead>
                <TableHead>Year 2</TableHead>
                <TableHead>Year 3</TableHead>
                <TableHead>Year 4</TableHead>
                <TableHead className="rounded-r-[5px]">Collections</TableHead>
              </TableHeader>
              <TableBody>
                {
                  courseWiseCollection.map((item, index) => (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.courseCode}</TableCell>
                      <TableCell>{item.details[0]?.totalCollection ? `₹${item.details[0]?.totalCollection?.toLocaleString()}` : "--"}</TableCell>
                      <TableCell>{item.details[1]?.totalCollection ? `₹${item.details[1]?.totalCollection?.toLocaleString()}` : "--"}</TableCell>
                      <TableCell>{item.details[2]?.totalCollection ? `₹${item.details[2]?.totalCollection?.toLocaleString()}` : "--"}</TableCell>
                      <TableCell>{item.details[3]?.totalCollection ? `₹${item.details[3]?.totalCollection?.toLocaleString()}` : "--"}</TableCell>
                      <TableCell>{item.totalCollection ? `₹${item.totalCollection?.toLocaleString()}` : "--"}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
              <TableFooter>
                <TableRow className="font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell>₹{totals.year1?.toLocaleString()}</TableCell>
                  <TableCell>₹{totals.year2?.toLocaleString()}</TableCell>
                  <TableCell>₹{totals.year3?.toLocaleString()}</TableCell>
                  <TableCell>₹{totals.year4?.toLocaleString()}</TableCell>
                  <TableCell>₹{totals.totalCollection?.toLocaleString()}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          :
          <>
            <div className="flex flex-col items-center justify-center h-[480px]">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Results Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting date to find what you're looking for.
              </p>
            </div>

          </>
      }
    </div>
  )
}
