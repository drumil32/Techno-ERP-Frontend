import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { courseDropdown } from '../admin-tracker/helpers/fetch-data';
import { useTechnoFilterContext } from '@/components/custom-ui/filter/filter-context';
import TechnoFiltersGroup from '@/components/custom-ui/filter/techno-filters-group';
import TechnoFilter, { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import FilterBadges from '../allLeads/components/filter-badges';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { z } from 'zod';
import { get } from 'http';
import { Input } from '@/components/ui/input';

// Zod schema for validation
const feeSchema = z.object({
  finalFees: z.number().positive('Fee must be greater than 0').optional()
});

interface StudentFee {
  id: number;
  studentName: string;
  studentId: string;
  courseCode: string;
  semester: string;
  feesType: string;
  amount: number | null;
}

// Mock API function to generate student data based on filters
const fetchStudentDataByFilters = (filters: any): StudentFee[] => {
  // This would be replaced by an actual API call
  const baseStudentName = 'Vaibhav Gupta';
  const courseCode = 'TGI2025MBA123';
  const semester = '03';

  // Get fees type from filters or default to 'Misc'
  const feesType = filters['fees-type']?.[0] || 'Misc';

  // Create 10 mock entries
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    studentName: baseStudentName,
    studentId: courseCode,
    courseCode: courseCode,
    semester: semester,
    feesType: feesType,
    amount: i === 4 ? null : i === 2 ? 4000 : i === 3 ? 13000 : i === 0 ? 1000 : 100
  }));
};

export default function BulkFeeUpdateDialogue() {
  const [open, setOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [studentData, setStudentData] = useState<StudentFee[]>([]);
  const [showList, setShowList] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editedFees, setEditedFees] = useState<Record<number, number | null>>({});

  const [refreshKey, setRefreshKey] = useState(0);

  const courseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: courseDropdown
  });
  const courses = Array.isArray(courseQuery.data) ? courseQuery.data : [];

  const { filters, updateFilter } = useTechnoFilterContext();

  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setAppliedFilters({ ...filters });
    setRefreshKey((prevKey) => prevKey + 1);
    console.log('Applied Filters:', filters);
  };

  const handleShowList = () => {
    setShowList(true);
    const data = fetchStudentDataByFilters(filters);
    setStudentData(data);
  };

  const handleInputChange = (id: number, value: string) => {
    try {
      // Clear previous error for this field
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);

      if (value === '') {
        // Handle empty input as null
        setEditedFees({
          ...editedFees,
          [id]: null
        });
        return;
      }

      const numValue = parseFloat(value);

      // Validate the value
      feeSchema.shape.finalFees.parse(numValue);

      // Update edited fees
      setEditedFees({
        ...editedFees,
        [id]: numValue
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({
          ...errors,
          [id]: error.errors[0]?.message || 'Invalid value'
        });
      }
    }
  };

  const getFiltersData = () => {
    return [
      {
        filterKey: 'academic-year',
        label: 'Academic Year',
        options: [
          {
            label: '24-25',
            id: '2024-25'
          }
        ] as FilterOption[],
        multiSelect: true
      },
      {
        filterKey: 'course',
        label: 'Course',
        options: courses.map((item: string) => {
          return {
            label: item,
            id: item
          };
        }),
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'selected-semester',
        label: 'Semester',
        options: [
          {
            label: 'Sem 1',
            id: 'sem1'
          }
        ] as FilterOption[],
        multiSelect: true
      },
      {
        filterKey: 'fees-type',
        label: 'Fees Type',
        options: [
          {
            label: 'MISC',
            id: 'misc'
          },
          {
            label: 'Optional',
            id: 'optional'
          }
        ],
        hasSearch: true,
        multiSelect: true
      }
    ];
  };

  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };

    if (filterKey === 'date' || filterKey.includes('Date')) {
      const dateKeys = ['startDate', 'endDate', 'startLTCDate', 'endLTCDate', 'date'];

      dateKeys.forEach((key) => {
        delete updatedFilters[key];
        updateFilter(key, undefined);
      });
    } else {
      delete updatedFilters[filterKey];
      updateFilter(filterKey, undefined);
    }

    setAppliedFilters(updatedFilters);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const clearFilters = () => {
    getFiltersData().forEach((filter) => {
      updateFilter(filter.filterKey, undefined);
    });
    setAppliedFilters({});
    currentFiltersRef.current = {};
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleSaveFeeChanges = () => {
    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Prepare payload
    const updatedData = studentData.map((item) => {
      const editedFee = editedFees[item.id];
      return {
        ...item,
        amount: editedFee !== undefined ? editedFee : item.amount
      };
    });

    console.log('Apply Fee Changes Payload:', {
      filters: appliedFilters,
      updatedData
    });
  };

  const handleSaveDraft = () => {
    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Prepare payload
    const updatedData = studentData.map((item) => {
      const editedFee = editedFees[item.id];
      return {
        ...item,
        amount: editedFee !== undefined ? editedFee : item.amount
      };
    });

    console.log('Save Draft Payload:', {
      filters: appliedFilters,
      updatedData
    });
  };

  const handleClose = () => {
    setOpen(false);
    setShowList(false);
    setStudentData([]);
    setEditedFees({});
    setErrors({});
    // Reset filters
    getFiltersData().forEach((filter) => {
      updateFilter(filter.filterKey, undefined);
    });
    setAppliedFilters({});
  };

  // Helper function to convert null to empty string for the input value
  const getInputValue = (id: number): string | number => {
    const editedValue = editedFees[id];
    if (editedValue !== undefined) {
      return editedValue === null ? '' : editedValue;
    }
    
    const originalValue = studentData.find(item => item.id === id)?.amount;
    return originalValue === null ? '' : originalValue || '';
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose();
        }
        setOpen(newOpen);
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline" className="h-8 rounded-[10px] border">
          Bulk Fee Update
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-30 inset-0 bg-black/30" />
        <Dialog.Content className="bg-white sm:min-w-[850px] z-40 p-6 rounded-xl shadow-xl w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/*Dialogue Title Header*/}
          <div className="flex justify-between items-center mb-8">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-gray-500 text-xl" />
              &nbsp;Bulk Fees Update
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-black text-xl font-bold">
              &times;
            </Dialog.Close>
          </div>
          <div className="flex flex-row gap-4 my-4">
            {getFiltersData().map((filter) => (
              <TechnoFilter
                key={filter.filterKey}
                filterKey={filter.filterKey}
                filterLabel={filter.label}
                options={filter.options}
                multiSelect={filter.multiSelect}
                hasSearch={filter.hasSearch}
                applyFilters={applyFilter}
                filterPlaceholder={filter.label}
              />
            ))}
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={handleShowList}
            >
              Show list
            </Button>
          </div>

          <div className="mb-4 w-full">
            <div className="border rounded-lg">
              {/* Fixed header */}
              <div className="bg-[#F7F7F7]">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="rounded-l-[5px] w-12">S No</TableHead>
                      <TableHead className="w-1/6">Student Name</TableHead>
                      <TableHead className="w-1/6">Student ID</TableHead>
                      <TableHead className="w-1/6">Course Code</TableHead>
                      <TableHead className="w-1/6">Semester</TableHead>
                      <TableHead className="w-1/6">Fees Type</TableHead>
                      <TableHead className="text-right w-24">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
              
              {/* Scrollable body */}
              <div className="max-h-[300px] overflow-y-auto">
                <Table className="w-full">
                  <TableBody>
                    {showList && studentData.length > 0 ? (
                      studentData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="w-12">{item.id}</TableCell>
                          <TableCell className="w-1/6">{item.studentName}</TableCell>
                          <TableCell className="w-1/6">{item.studentId}</TableCell>
                          <TableCell className="w-1/6">{item.courseCode}</TableCell>
                          <TableCell className="w-1/6">{item.semester}</TableCell>
                          <TableCell className="w-1/6">{item.feesType}</TableCell>
                          <TableCell className="text-right w-24">
                            <div className="flex flex-col items-end">
                              <Input
                                className="w-24 text-right"
                                type="number"
                                value={getInputValue(item.id)}
                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                placeholder="—"
                              />
                              {errors[item.id] && (
                                <span className="text-red-500 text-xs mt-1">{errors[item.id]}</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-[300px] text-gray-500">
                          {showList
                            ? 'No results found for the selected filters.'
                            : "There are no filters selected. Please select the filters and click 'Show list' to create a list of dues for students"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft} 
              className="border-gray-300"
              disabled={!showList || studentData.length === 0 || Object.keys(errors).length > 0}
            >
              Save Draft
            </Button>
            <Button
              disabled={!showList || studentData.length === 0 || Object.keys(errors).length > 0}
              onClick={handleSaveFeeChanges}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Apply Fees Changes
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}