import TechnoDataTable from "@/components/custom-ui/data-table/techno-data-table";
import { useState } from "react";

export default function CourseWiseRevenue() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const columns = [
    { accessorKey: 'sno', header: 'S. No' },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'year', header: 'Year' },
    { accessorKey: 'nuberOfStudents', header: 'No. of Students' },
    { accessorKey: 'totalCollections', header: 'Total Collections' },
    { accessorKey: 'totalExprectedRevenue', header: 'Total Expected Revenue' },
    { accessorKey: 'remainingDues', header: 'Remaining Dues' },
  ]

  const tableData: any[] = []

  return (
    <TechnoDataTable
      selectedRowId={selectedRowId}
      setSelectedRowId={setSelectedRowId}
      columns={columns}
      data={tableData}
      tableName="Course-Wise Revenue"
      tableActionButton={<></>}
      showPagination={false}
      isLoading={false}
      handleViewMore={() => { }}
      headerStyles={'text-[#5B31D1] bg-[#F7F4FF]'}
    >

    </TechnoDataTable>
  )
}

const yearOptions = [
  { id: 'ALL', label: 'All' },
]

const monthOptions = [
  { id: 'ALL', label: 'All' },
]